import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, to, data } = await req.json();
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    let subject = "";
    let html = "";

    switch (type) {
      case "booking_confirmation":
        subject = "Buchungsbestätigung – UmzugTeam365";
        html = `
          <h2>Vielen Dank für Ihre Buchung!</h2>
          <p>Sehr geehrte(r) ${data.name},</p>
          <p>Ihre Umzugsanfrage wurde erfolgreich registriert.</p>
          <ul>
            <li><strong>Von:</strong> ${data.from_city}</li>
            <li><strong>Nach:</strong> ${data.to_city}</li>
            <li><strong>Wohnungsgröße:</strong> ${data.apartment_size}</li>
            <li><strong>Geschätzter Preis:</strong> ${data.estimated_price} €</li>
          </ul>
          <p>Wir melden uns in Kürze bei Ihnen.</p>
          <p>Mit freundlichen Grüßen,<br/>Ihr UmzugTeam365</p>
        `;
        break;
      case "reminder":
        subject = "Erinnerung: Ihr Umzug steht bevor! – UmzugTeam365";
        html = `
          <h2>Umzugs-Erinnerung</h2>
          <p>Sehr geehrte(r) ${data.name},</p>
          <p>Ihr Umzug ist für den <strong>${data.date}</strong> geplant.</p>
          <p>Bitte stellen Sie sicher, dass alles vorbereitet ist. Nutzen Sie unsere <a href="https://umzugteam365.de/checkliste">Checkliste</a> als Hilfe.</p>
          <p>Bei Fragen erreichen Sie uns unter +49 151 66532563.</p>
          <p>Mit freundlichen Grüßen,<br/>Ihr UmzugTeam365</p>
        `;
        break;
      case "review_request":
        subject = "Wie war Ihr Umzug? – UmzugTeam365";
        html = `
          <h2>Ihr Feedback ist uns wichtig!</h2>
          <p>Sehr geehrte(r) ${data.name},</p>
          <p>Ihr Umzug wurde abgeschlossen. Wir hoffen, Sie waren zufrieden!</p>
          <p>Bitte bewerten Sie uns: <a href="https://umzugteam365.de/bewertungen">Bewertung abgeben</a></p>
          <p>Mit freundlichen Grüßen,<br/>Ihr UmzugTeam365</p>
        `;
        break;
      default:
        throw new Error("Unknown email type");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "UmzugTeam365 <noreply@umzugteam365.de>",
        to: [to],
        subject,
        html,
      }),
    });

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
