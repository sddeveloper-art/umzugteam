import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  if (record.count >= 5) return true;
  record.count++;
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte warten Sie einen Moment." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { from_city, to_city, apartment_size, floor, has_elevator, needs_packing, needs_assembly, needs_fragile_packing, needs_cleaning, needs_storage, needs_premium_insurance, needs_express, needs_weekend, volume, description } = body;

    if (!from_city || !to_city || !apartment_size) {
      return new Response(JSON.stringify({ error: "Pflichtfelder fehlen." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const extras = [];
    if (needs_packing) extras.push("Verpackungsservice (+120€)");
    if (needs_assembly) extras.push("Möbelmontage (+80€)");
    if (needs_fragile_packing) extras.push("Empfindliches Verpacken (+120€)");
    if (needs_cleaning) extras.push("Endreinigung (+180€)");
    if (needs_storage) extras.push("Zwischenlagerung (+99€/Monat)");
    if (needs_premium_insurance) extras.push("Premium-Versicherung (+89€)");
    if (needs_express) extras.push("Express-Service (+199€)");
    if (needs_weekend) extras.push("Wochenend-Service (+149€)");

    const prompt = `Erstelle eine detaillierte Umzugskostenschätzung basierend auf folgenden Daten:

VON: ${from_city}
NACH: ${to_city}
Wohnungsgröße: ${apartment_size}
Volumen: ${volume || "nicht angegeben"} m³
Etage: ${floor ?? 0}
Aufzug: ${has_elevator ? "Ja" : "Nein"}
Gewählte Extras: ${extras.length > 0 ? extras.join(", ") : "Keine"}
Zusätzliche Infos: ${description || "Keine"}

WICHTIG - Du bist der KI-Schätzer von UmzugTeam365. Gib eine realistische Kostenschätzung ab. Antworte IMMER im folgenden JSON-Format (kein Markdown, nur reines JSON):

{
  "price_min": <Zahl>,
  "price_max": <Zahl>,
  "breakdown": [
    {"item": "<Beschreibung>", "cost": <Zahl>}
  ],
  "tips": ["<Tipp1>", "<Tipp2>", "<Tipp3>"],
  "confidence": "<hoch|mittel|niedrig>",
  "summary": "<Kurze Zusammenfassung in 2-3 Sätzen>"
}

Basispreise zur Orientierung:
- 1-Zimmer: 299-500€ Basis
- 2-Zimmer: 450-750€ Basis
- 3-Zimmer: 650-1100€ Basis
- 4-Zimmer: 900-1500€ Basis
- 5+ Zimmer: 1200-2200€ Basis
- Haus: 1500-3500€ Basis
- Büro: 800-3000€ Basis

Distanz-Zuschlag: ~1.50€/km für Entfernungen über 50km.
Etage ohne Aufzug: +30€ pro Etage ab 2. OG.
Berücksichtige alle gewählten Extras in der Aufschlüsselung.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Du bist ein präziser Umzugskostenrechner. Antworte NUR mit validem JSON, kein Markdown, keine Code-Blöcke." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "KI-Dienst überlastet. Bitte versuchen Sie es später." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "KI-Dienst vorübergehend nicht verfügbar." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code blocks if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let estimation;
    try {
      estimation = JSON.parse(content);
    } catch {
      estimation = {
        price_min: 500,
        price_max: 1500,
        breakdown: [{ item: "Geschätzte Gesamtkosten", cost: 1000 }],
        tips: ["Kontaktieren Sie uns für ein genaueres Angebot."],
        confidence: "niedrig",
        summary: "Aufgrund der Eingaben konnte nur eine grobe Schätzung erstellt werden. Bitte kontaktieren Sie uns für ein detailliertes Angebot.",
      };
    }

    return new Response(JSON.stringify({ estimation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI estimation error:", error);
    return new Response(JSON.stringify({ error: "Fehler bei der KI-Schätzung." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
