import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  record.count++;
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 1000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Du bist der freundliche Chatbot von UmzugTeam365, einem professionellen Umzugsunternehmen in Deutschland. 
Antworte immer auf Deutsch, kurz und hilfreich. 

Wichtige Infos:
- Telefon: +49 151 66532563
- E-Mail: office@umzugteam365.de
- Über 25 Jahre Erfahrung, 50.000+ zufriedene Kunden
- Drei Pakete: Basique (ab 299€), Komfort (ab 549€), Premium (ab 899€)
- Services: Privatumzug, Firmenumzug, Verpackung, Lagerung, Reinigung, Spezialtransporte, Möbelmontage, Klaviertransport
- Extras: Empfindliches Verpacken (+120€), Premium-Versicherung (+89€), Express (+199€), Wochenend (+149€), Endreinigung (+180€), Zwischenlagerung (+99€)
- Vollversicherung bis 50.000€ beim Premium-Paket
- Kostenloses Angebot in 2 Minuten auf der Website
- Standorte: Berlin, München, Hamburg, Köln, Frankfurt, Stuttgart

Wenn du die Antwort nicht weißt, verweise auf den Kontakt oder das kostenlose Angebot auf der Website.`,
          },
          { role: "user", content: message.trim() },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Entschuldigung, ich konnte keine Antwort generieren.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Ein Fehler ist aufgetreten." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
