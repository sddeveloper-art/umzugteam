import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

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
          { role: "user", content: message },
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
