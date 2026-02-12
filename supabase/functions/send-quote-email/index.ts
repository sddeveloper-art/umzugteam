import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (per IP, 5 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validatePhone(phone: string): boolean {
  // Allow digits, spaces, +, -, and parentheses, max 20 chars
  const phoneRegex = /^[\d\s+\-()]{5,20}$/;
  return phoneRegex.test(phone);
}

function validateString(str: string, maxLength: number = 200): boolean {
  return typeof str === "string" && str.trim().length > 0 && str.length <= maxLength;
}

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

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("cf-connecting-ip") || 
                   "unknown";
  
  // Check rate limit
  if (isRateLimited(clientIp)) {
    console.log(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const data: QuoteEmailRequest = await req.json();
    console.log("Quote request received from IP:", clientIp);

    // Validate required fields
    if (!validateString(data.name, 100)) {
      return new Response(
        JSON.stringify({ error: "Invalid name provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateEmail(data.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validatePhone(data.phone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateString(data.fromCity, 100) || !validateString(data.toCity, 100)) {
      return new Response(
        JSON.stringify({ error: "Invalid city provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.message && data.message.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 1000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize all user inputs for HTML
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safePhone = escapeHtml(data.phone);
    const safeFromCity = escapeHtml(data.fromCity);
    const safeToCity = escapeHtml(data.toCity);
    const safeApartmentSize = escapeHtml(data.apartmentSize);
    const safePreferredDate = escapeHtml(data.preferredDate);
    const safeMessage = escapeHtml(data.message);

    // Sanitize numeric values
    const safeFloor = Number.isFinite(data.floor) ? data.floor : 0;
    const safeDistance = Number.isFinite(data.distance) ? data.distance : 0;
    const safeVolume = Number.isFinite(data.volume) ? data.volume : 0;
    const safeEstimatedPrice = Number.isFinite(data.estimatedPrice) ? data.estimatedPrice : 0;

    // Email to the company
    const companyEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UmzugTeam365 <onboarding@resend.dev>",
        to: ["sbinfodor@gmail.com"],
        subject: `Neue Angebotsanfrage von ${safeName}`,
        html: `
          <h1>Neue Angebotsanfrage</h1>
          <h2>Kundendaten</h2>
          <ul>
            <li><strong>Name:</strong> ${safeName}</li>
            <li><strong>E-Mail:</strong> ${safeEmail}</li>
            <li><strong>Telefon:</strong> ${safePhone}</li>
          </ul>
          
          <h2>Umzugsdetails</h2>
          <ul>
            <li><strong>Von:</strong> ${safeFromCity}</li>
            <li><strong>Nach:</strong> ${safeToCity}</li>
            <li><strong>Entfernung:</strong> ${safeDistance} km</li>
            <li><strong>Wohnungsgröße:</strong> ${safeApartmentSize}</li>
            <li><strong>Volumen:</strong> ${safeVolume} m³</li>
            <li><strong>Etage:</strong> ${safeFloor}</li>
            <li><strong>Aufzug:</strong> ${data.hasElevator ? "Ja" : "Nein"}</li>
            <li><strong>Verpackungsservice:</strong> ${data.needsPacking ? "Ja" : "Nein"}</li>
            <li><strong>Möbelmontage:</strong> ${data.needsAssembly ? "Ja" : "Nein"}</li>
            <li><strong>Wunschtermin:</strong> ${safePreferredDate || "Nicht angegeben"}</li>
          </ul>
          
          <h2>Geschätzter Preis: ${safeEstimatedPrice}€</h2>
          
          ${safeMessage ? `<h2>Nachricht</h2><p>${safeMessage}</p>` : ""}
        `,
      }),
    });

    if (!companyEmailRes.ok) {
      const errorData = await companyEmailRes.text();
      console.error("Error sending company email:", errorData);
      throw new Error(`Failed to send company email`);
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
        to: ["sbinfodor@gmail.com"],
        subject: "Ihre Angebotsanfrage bei UmzugTeam365",
        html: `
          <h1>Vielen Dank für Ihre Anfrage, ${safeName}!</h1>
          
          <p>Wir haben Ihre Angebotsanfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          
          <h2>Zusammenfassung Ihrer Anfrage</h2>
          <ul>
            <li><strong>Von:</strong> ${safeFromCity}</li>
            <li><strong>Nach:</strong> ${safeToCity}</li>
            <li><strong>Entfernung:</strong> ${safeDistance} km</li>
            <li><strong>Wohnungsgröße:</strong> ${safeApartmentSize}</li>
            <li><strong>Wunschtermin:</strong> ${safePreferredDate || "Nicht angegeben"}</li>
          </ul>
          
          <h2>Geschätzter Preis: ${safeEstimatedPrice}€</h2>
          
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
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
