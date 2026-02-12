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
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s+\-()]{5,20}$/;
  return phoneRegex.test(phone);
}

function validateString(str: string, maxLength: number = 200): boolean {
  return typeof str === "string" && str.trim().length > 0 && str.length <= maxLength;
}

interface ContactEmailRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const subjectLabels: Record<string, string> = {
  devis: "Angebotsanfrage",
  info: "Allgemeine Information",
  reclamation: "Beschwerde",
  partenariat: "Partnerschaft",
  autre: "Sonstiges",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-contact-email");

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
    const data: ContactEmailRequest = await req.json();
    console.log("Contact request received from IP:", clientIp);

    // Validate required fields
    if (!validateString(data.firstName, 100)) {
      return new Response(
        JSON.stringify({ error: "Invalid first name provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateString(data.lastName, 100)) {
      return new Response(
        JSON.stringify({ error: "Invalid last name provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateEmail(data.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.phone && !validatePhone(data.phone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateString(data.subject, 50)) {
      return new Response(
        JSON.stringify({ error: "Invalid subject provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateString(data.message, 1000)) {
      return new Response(
        JSON.stringify({ error: "Invalid message (max 1000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize all user inputs for HTML
    const safeFirstName = escapeHtml(data.firstName);
    const safeLastName = escapeHtml(data.lastName);
    const safeEmail = escapeHtml(data.email);
    const safePhone = escapeHtml(data.phone);
    const safeSubject = escapeHtml(subjectLabels[data.subject] || data.subject);
    const safeMessage = escapeHtml(data.message);

    // Email to the company
    const companyEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UmzugTeam365 <contact@umzugteam365.de>",
        to: ["contact@umzugteam365.de"],
        subject: `Neue Kontaktanfrage: ${safeSubject} - von ${safeFirstName} ${safeLastName}`,
        html: `
          <h1>Neue Kontaktanfrage</h1>
          
          <h2>Absender</h2>
          <ul>
            <li><strong>Name:</strong> ${safeFirstName} ${safeLastName}</li>
            <li><strong>E-Mail:</strong> ${safeEmail}</li>
            ${safePhone ? `<li><strong>Telefon:</strong> ${safePhone}</li>` : ""}
          </ul>
          
          <h2>Betreff: ${safeSubject}</h2>
          
          <h2>Nachricht</h2>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">${safeMessage}</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">
            Diese Nachricht wurde über das Kontaktformular auf umzugteam365.de gesendet.
          </p>
        `,
      }),
    });

    if (!companyEmailRes.ok) {
      const errorData = await companyEmailRes.text();
      console.error("Error sending company email:", errorData);
      throw new Error(`Failed to send company email`);
    }

    console.log("Contact email sent successfully");

    // Confirmation email to the customer
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UmzugTeam365 <contact@umzugteam365.de>",
        to: [data.email],
        subject: "Wir haben Ihre Nachricht erhalten - UmzugTeam365",
        html: `
          <h1>Vielen Dank für Ihre Nachricht, ${safeFirstName}!</h1>
          
          <p>Wir haben Ihre Anfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
          
          <h2>Ihre Nachricht</h2>
          <p><strong>Betreff:</strong> ${safeSubject}</p>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">${safeMessage}</p>
          
          <p>Mit freundlichen Grüßen,<br>Ihr UmzugTeam365</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">
            Bei dringenden Fragen erreichen Sie uns unter:<br>
            Telefon: +49 151 66532563<br>
            E-Mail: office@umzugteam365.de
          </p>
        `,
      }),
    });

    if (!customerEmailRes.ok) {
      const errorData = await customerEmailRes.text();
      console.error("Error sending customer confirmation email:", errorData);
      // Don't throw - company email was sent successfully
    } else {
      console.log("Customer confirmation email sent successfully");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact message sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
