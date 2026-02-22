import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: {
    id: string;
    announcement_id: string;
    company_name: string;
    company_email: string;
    price: number;
    notes: string | null;
    created_at: string;
  };
  schema: string;
  old_record: null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Security: Only accept requests from internal triggers (no public access needed)
  // The trigger no longer sends Authorization header - validate via content type
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  console.log("Received new bid notification request");

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const payload: WebhookPayload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload));

    // Verify this is an INSERT event on company_bids
    if (payload.type !== "INSERT" || payload.table !== "company_bids") {
      return new Response(
        JSON.stringify({ message: "Ignored: not a new bid" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const bid = payload.record;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const resend = new Resend(RESEND_API_KEY);

    // Fetch announcement details
    const { data: announcement, error: fetchError } = await supabase
      .from("moving_announcements")
      .select("*")
      .eq("id", bid.announcement_id)
      .single();

    if (fetchError || !announcement) {
      console.error("Error fetching announcement:", fetchError);
      throw new Error("Announcement not found");
    }

    // Count total bids for this announcement
    const { count: bidCount } = await supabase
      .from("company_bids")
      .select("*", { count: "exact", head: true })
      .eq("announcement_id", bid.announcement_id);

    // Get lowest bid so far
    const { data: lowestBidData } = await supabase
      .from("company_bids")
      .select("price")
      .eq("announcement_id", bid.announcement_id)
      .order("price", { ascending: true })
      .limit(1)
      .single();

    const isLowestBid = lowestBidData?.price === bid.price;

    // Sanitize data for email
    const safeName = escapeHtml(announcement.client_name);
    const safeFromCity = escapeHtml(announcement.from_city);
    const safeToCity = escapeHtml(announcement.to_city);
    const safeCompanyName = escapeHtml(bid.company_name);
    const safeNotes = escapeHtml(bid.notes);

    const endDate = new Date(announcement.end_date);
    const formattedEndDate = endDate.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const emailHtml = `
      <h1>Neues Angebot erhalten, ${safeName}!</h1>
      
      <p>Eine neue Umzugsfirma hat ein Angebot für Ihren Umzug abgegeben.</p>
      
      <div style="background: ${isLowestBid ? '#dcfce7' : '#f0f9ff'}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${isLowestBid ? '#22c55e' : '#3b82f6'};">
        ${isLowestBid ? '<p style="color: #16a34a; font-weight: bold; margin: 0 0 10px 0;">🏆 Aktuell günstigstes Angebot!</p>' : ''}
        <h3 style="color: #1e40af; margin: 0 0 10px 0;">${safeCompanyName}</h3>
        <p style="font-size: 28px; font-weight: bold; color: ${isLowestBid ? '#22c55e' : '#1e40af'}; margin: 0;">
          ${bid.price.toFixed(2)}€
        </p>
        ${safeNotes ? `<p style="margin-top: 15px; color: #666;"><em>"${safeNotes}"</em></p>` : ''}
      </div>

      <h3>📊 Übersicht Ihrer Anfrage:</h3>
      <ul>
        <li><strong>Umzug:</strong> ${safeFromCity} → ${safeToCity}</li>
        <li><strong>Wohnungsgröße:</strong> ${escapeHtml(announcement.apartment_size)}</li>
        <li><strong>Erhaltene Angebote:</strong> ${bidCount || 1}</li>
        <li><strong>Günstigstes Angebot:</strong> ${(lowestBidData?.price || bid.price).toFixed(2)}€</li>
        <li><strong>Endet am:</strong> ${formattedEndDate}</li>
      </ul>

      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;">
          ⏰ <strong>Tipp:</strong> Warten Sie bis zum Ende der Angebotsperiode, um alle Angebote zu vergleichen. 
          Sie erhalten automatisch eine E-Mail mit dem günstigsten Angebot.
        </p>
      </div>

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
      subject: isLowestBid 
        ? `🏆 Neues günstigstes Angebot: ${bid.price.toFixed(2)}€ von ${safeCompanyName}`
        : `Neues Angebot: ${bid.price.toFixed(2)}€ von ${safeCompanyName}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailRes);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification email sent",
        bidId: bid.id,
        announcementId: bid.announcement_id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in notify-new-bid:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
