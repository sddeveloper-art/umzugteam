import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

// Cache FAQs for 10 minutes
let faqCache: { data: any[]; timestamp: number } | null = null;
const FAQ_CACHE_TTL = 600000;

async function getFAQs(): Promise<any[]> {
  if (faqCache && Date.now() - faqCache.timestamp < FAQ_CACHE_TTL) {
    return faqCache.data;
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data, error } = await supabase
      .from("faq_items")
      .select("question, answer, question_fr, answer_fr")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    faqCache = { data: data || [], timestamp: Date.now() };
    return faqCache.data;
  } catch (e) {
    console.error("FAQ fetch error:", e);
    return faqCache?.data || [];
  }
}

function buildFAQBlock(faqs: any[], lang: string): string {
  if (faqs.length === 0) return "";
  const lines = faqs.map((f, i) => {
    const q = lang === "fr" ? (f.question_fr || f.question) : f.question;
    const a = lang === "fr" ? (f.answer_fr || f.answer) : f.answer;
    return `${i + 1}. Q: ${q}\n   A: ${a}`;
  });
  return `\n\nFAQ-Wissensdatenbank (nutze diese um Fragen zu beantworten):\n${lines.join("\n\n")}`;
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
    const { message, language } = await req.json();
    const lang = language === "fr" ? "fr" : "de";

    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 1000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const faqs = await getFAQs();
    const faqBlock = buildFAQBlock(faqs, lang);

    const systemPromptDe = `Du bist der freundliche Chatbot von UmzugTeam365, einem professionellen Umzugsunternehmen in Deutschland. 
Antworte IMMER auf Deutsch, kurz und hilfreich.

WICHTIG: Wenn eine Frage ähnlich zu einer FAQ ist, nutze die FAQ-Antwort als Basis. Verstehe auch umformulierte, verkürzte oder sinngemäß gleiche Fragen und ordne sie der passenden FAQ zu.

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

Wenn du die Antwort nicht weißt, verweise auf den Kontakt oder das kostenlose Angebot auf der Website.${faqBlock}`;

    const systemPromptFr = `Tu es le chatbot amical d'UmzugTeam365, une entreprise de déménagement professionnelle en Allemagne.
Réponds TOUJOURS en français, de manière concise et utile.

IMPORTANT : Si une question est similaire à une FAQ, utilise la réponse FAQ comme base. Comprends aussi les questions reformulées, raccourcies ou ayant le même sens et associe-les à la FAQ correspondante.

Informations importantes :
- Téléphone : +49 151 66532563
- E-mail : office@umzugteam365.de
- Plus de 25 ans d'expérience, 50 000+ clients satisfaits
- Trois forfaits : Basique (à partir de 299€), Komfort (à partir de 549€), Premium (à partir de 899€)
- Services : Déménagement privé, déménagement d'entreprise, emballage, stockage, nettoyage, transports spéciaux, montage de meubles, transport de piano
- Extras : Emballage délicat (+120€), Assurance premium (+89€), Express (+199€), Week-end (+149€), Nettoyage final (+180€), Stockage intermédiaire (+99€)
- Assurance complète jusqu'à 50 000€ avec le forfait Premium
- Devis gratuit en 2 minutes sur le site web
- Villes : Berlin, Munich, Hambourg, Cologne, Francfort, Stuttgart

Si tu ne connais pas la réponse, renvoie vers le contact ou le devis gratuit sur le site.${faqBlock}`;

    const systemContent = lang === "fr" ? systemPromptFr : systemPromptDe;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: message.trim() },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: lang === "fr" ? "Trop de requêtes, réessayez plus tard." : "Zu viele Anfragen, bitte später erneut versuchen." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: lang === "fr" ? "Service temporairement indisponible." : "Dienst vorübergehend nicht verfügbar." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || (lang === "fr" ? "Désolé, je n'ai pas pu générer de réponse." : "Entschuldigung, ich konnte keine Antwort generieren.");

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
