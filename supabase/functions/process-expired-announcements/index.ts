import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface Announcement {
  id: string;
  client_name: string;
  client_email: string;
  from_city: string;
  to_city: string;
  apartment_size: string;
  preferred_date: string | null;
  end_date: string;
}

interface Bid {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string | null;
  price: number;
  notes: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Security: Validate shared webhook secret for internal-only access
  const webhookSecret = req.headers.get("x-webhook-secret");
  const expectedSecret = Deno.env.get("INTERNAL_WEBHOOK_SECRET");
  if (!expectedSecret || webhookSecret !== expectedSecret) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  console.log("Processing expired announcements...");

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const resend = new Resend(RESEND_API_KEY);

    // Get all expired announcements that haven't been processed
    const { data: expiredAnnouncements, error: fetchError } = await supabase
      .from("moving_announcements")
      .select("*")
      .eq("status", "active")
      .lte("end_date", new Date().toISOString())
      .eq("notification_sent", false);

    if (fetchError) {
      console.error("Error fetching announcements:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${expiredAnnouncements?.length || 0} expired announcements`);

    const results = [];

    for (const announcement of expiredAnnouncements || []) {
      try {
        // Get all bids for this announcement
        const { data: bids, error: bidsError } = await supabase
          .from("company_bids")
          .select("*")
          .eq("announcement_id", announcement.id)
          .order("price", { ascending: true });

        if (bidsError) {
          console.error(`Error fetching bids for ${announcement.id}:`, bidsError);
          continue;
        }

        const lowestBid = bids && bids.length > 0 ? bids[0] as Bid : null;

        // Update announcement status
        const updateData: Record<string, unknown> = {
          status: "expired",
          notification_sent: true,
        };

        if (lowestBid) {
          updateData.winner_bid_id = lowestBid.id;
          updateData.status = "completed";
        }

        const { error: updateError } = await supabase
          .from("moving_announcements")
          .update(updateData)
          .eq("id", announcement.id);

        if (updateError) {
          console.error(`Error updating announcement ${announcement.id}:`, updateError);
          continue;
        }

        // Send email to client
        const safeName = escapeHtml(announcement.client_name);
        const safeFromCity = escapeHtml(announcement.from_city);
        const safeToCity = escapeHtml(announcement.to_city);

        let emailHtml = "";

        if (lowestBid) {
          const safeCompanyName = escapeHtml(lowestBid.company_name);
          const safeCompanyPhone = escapeHtml(lowestBid.company_phone);
          const safeCompanyEmail = escapeHtml(lowestBid.company_email);
          const safeNotes = escapeHtml(lowestBid.notes);

          emailHtml = `
            <h1>Gute Nachrichten, ${safeName}!</h1>
            <p>Die Angebotsperiode für Ihren Umzug ist abgelaufen.</p>
            
            <h2>🏆 Die günstigste Gesellschaft:</h2>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0066cc; margin: 0;">${safeCompanyName}</h3>
              <p style="font-size: 24px; font-weight: bold; color: #22c55e; margin: 10px 0;">
                ${lowestBid.price.toFixed(2)}€
              </p>
              <p><strong>E-Mail:</strong> ${safeCompanyEmail}</p>
              ${safeCompanyPhone ? `<p><strong>Telefon:</strong> ${safeCompanyPhone}</p>` : ""}
              ${safeNotes ? `<p><strong>Bemerkungen:</strong> ${safeNotes}</p>` : ""}
            </div>

            <h3>Details Ihres Umzugs:</h3>
            <ul>
              <li><strong>Von:</strong> ${safeFromCity}</li>
              <li><strong>Nach:</strong> ${safeToCity}</li>
              <li><strong>Wohnungsgröße:</strong> ${escapeHtml(announcement.apartment_size)}</li>
              ${announcement.preferred_date ? `<li><strong>Wunschtermin:</strong> ${new Date(announcement.preferred_date).toLocaleDateString("de-DE")}</li>` : ""}
            </ul>

            <h3>Alle erhaltenen Angebote (${bids?.length || 0}):</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Rang</th>
                  <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Gesellschaft</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Preis</th>
                </tr>
              </thead>
              <tbody>
                ${(bids || []).map((bid: Bid, index: number) => `
                  <tr style="${index === 0 ? 'background: #dcfce7;' : ''}">
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${escapeHtml(bid.company_name)}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb; font-weight: bold;">${bid.price.toFixed(2)}€</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <p>Wir empfehlen Ihnen, sich direkt mit <strong>${safeCompanyName}</strong> in Verbindung zu setzen.</p>
          `;
        } else {
          emailHtml = `
            <h1>Hallo ${safeName},</h1>
            <p>Leider ist die Angebotsperiode für Ihren Umzug abgelaufen und wir haben keine Angebote erhalten.</p>
            
            <h3>Details Ihres Umzugs:</h3>
            <ul>
              <li><strong>Von:</strong> ${safeFromCity}</li>
              <li><strong>Nach:</strong> ${safeToCity}</li>
            </ul>

            <p>Sie können gerne eine neue Anfrage mit einer längeren Angebotsperiode erstellen.</p>
          `;
        }

        emailHtml += `
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Mit freundlichen Grüßen,<br>
            Ihr UmzugTeam365<br><br>
            Telefon: +49 151 66532563<br>
            E-Mail: contact@umzugteam365.de
          </p>
        `;

        const emailRes = await resend.emails.send({
          from: "UmzugTeam365 <onboarding@resend.dev>",
          to: ["sbinfodor@gmail.com"],
          subject: lowestBid 
            ? `Ihr günstigstes Angebot: ${lowestBid.price.toFixed(2)}€ von ${lowestBid.company_name}`
            : "Ihre Umzugsanfrage - Keine Angebote erhalten",
          html: emailHtml,
        });

        console.log(`Email sent for announcement ${announcement.id}:`, emailRes);

        results.push({
          announcementId: announcement.id,
          bidsCount: bids?.length || 0,
          winnerBidId: lowestBid?.id || null,
          lowestPrice: lowestBid?.price || null,
          emailSent: true,
        });
      } catch (err) {
        console.error(`Error processing announcement ${announcement.id}:`, err);
        results.push({
          announcementId: announcement.id,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in process-expired-announcements:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
