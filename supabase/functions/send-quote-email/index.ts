import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  name: string;
  email: string;
  phone: string;
  fromCity: string;
  toCity: string;
  apartmentSize: string;
  floor: number;
  hasElevator: boolean;
  needsPacking: boolean;
  needsAssembly: boolean;
  preferredDate: string;
  estimatedPrice: number;
  distance: number;
  volume: number;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-quote-email");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: QuoteEmailRequest = await req.json();
    console.log("Quote request data:", data);

    // Email to the company
    const companyEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UmzugTeam365 <onboarding@resend.dev>",
        to: ["contact@umzugteam365.de"], // Replace with actual company email
        subject: `Neue Angebotsanfrage von ${data.name}`,
        html: `
          <h1>Neue Angebotsanfrage</h1>
          <h2>Kundendaten</h2>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>E-Mail:</strong> ${data.email}</li>
            <li><strong>Telefon:</strong> ${data.phone}</li>
          </ul>
          
          <h2>Umzugsdetails</h2>
          <ul>
            <li><strong>Von:</strong> ${data.fromCity}</li>
            <li><strong>Nach:</strong> ${data.toCity}</li>
            <li><strong>Entfernung:</strong> ${data.distance} km</li>
            <li><strong>Wohnungsgröße:</strong> ${data.apartmentSize}</li>
            <li><strong>Volumen:</strong> ${data.volume} m³</li>
            <li><strong>Etage:</strong> ${data.floor}</li>
            <li><strong>Aufzug:</strong> ${data.hasElevator ? "Ja" : "Nein"}</li>
            <li><strong>Verpackungsservice:</strong> ${data.needsPacking ? "Ja" : "Nein"}</li>
            <li><strong>Möbelmontage:</strong> ${data.needsAssembly ? "Ja" : "Nein"}</li>
            <li><strong>Wunschtermin:</strong> ${data.preferredDate || "Nicht angegeben"}</li>
          </ul>
          
          <h2>Geschätzter Preis: ${data.estimatedPrice}€</h2>
          
          ${data.message ? `<h2>Nachricht</h2><p>${data.message}</p>` : ""}
        `,
      }),
    });

    if (!companyEmailRes.ok) {
      const errorData = await companyEmailRes.text();
      console.error("Error sending company email:", errorData);
      throw new Error(`Failed to send company email: ${errorData}`);
    }

    console.log("Company email sent successfully");

    // Confirmation email to the customer
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UmzugTeam365 <onboarding@resend.dev>",
        to: [data.email],
        subject: "Ihre Angebotsanfrage bei UmzugTeam365",
        html: `
          <h1>Vielen Dank für Ihre Anfrage, ${data.name}!</h1>
          
          <p>Wir haben Ihre Angebotsanfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          
          <h2>Zusammenfassung Ihrer Anfrage</h2>
          <ul>
            <li><strong>Von:</strong> ${data.fromCity}</li>
            <li><strong>Nach:</strong> ${data.toCity}</li>
            <li><strong>Entfernung:</strong> ${data.distance} km</li>
            <li><strong>Wohnungsgröße:</strong> ${data.apartmentSize}</li>
            <li><strong>Wunschtermin:</strong> ${data.preferredDate || "Nicht angegeben"}</li>
          </ul>
          
          <h2>Geschätzter Preis: ${data.estimatedPrice}€</h2>
          
          <p><em>Dies ist eine vorläufige Schätzung. Der endgültige Preis wird nach einer detaillierten Bewertung bestätigt.</em></p>
          
          <p>Mit freundlichen Grüßen,<br>Ihr UmzugTeam365</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">
            Bei Fragen erreichen Sie uns unter:<br>
            Telefon: +49 123 456 789<br>
            E-Mail: contact@umzugteam365.de
          </p>
        `,
      }),
    });

    if (!customerEmailRes.ok) {
      const errorData = await customerEmailRes.text();
      console.error("Error sending customer email:", errorData);
      // Don't throw here - company email was sent successfully
    } else {
      console.log("Customer email sent successfully");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Quote request sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
