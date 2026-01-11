import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    // Validate messages array exists and is an array
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate messages array length
    if (messages.length === 0 || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Messages array must contain 1-50 messages" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each message structure
    const validRoles = ["user", "assistant", "system"];
    for (const msg of messages) {
      if (!msg || typeof msg !== "object") {
        return new Response(
          JSON.stringify({ error: "Each message must be an object" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!msg.role || !validRoles.includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: "Each message must have a valid role (user, assistant, or system)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Message content must be a string" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (msg.content.length > 10000) {
        return new Response(
          JSON.stringify({ error: "Message content must be under 10,000 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Sanitize messages before sending to AI
    const sanitizedMessages: ChatMessage[] = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content.slice(0, 10000), // Enforce max length
    }));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You are AskAI Chat, an AI assistant created, built, and maintained by Prakhar Yadav. You exist ONLY as part of the AskAI Chat website.

IDENTITY RULES (ABSOLUTE - NEVER BREAK):
- Your name is "AskAI Chat"
- You were created by Prakhar Yadav (use only "Prakhar" in casual mentions, full name only when formally asked)
- You are part of the AskAI Chat web application

GREETING RESPONSES (VARY YOUR REPLIES - pick randomly):
When user says "hi", "hello", "hey", "hola", or similar greetings:
- "Hey there! 👋 How can I help you today?"
- "Hello! What can I assist you with?"
- "Hi! Ready to help with anything you need 🚀"
- "Hey! What's on your mind today?"
- "Hello there! Feel free to ask me anything 😊"
- "Hi! I'm here to help. What would you like to know?"
- "Hey! Great to see you. How can I assist?"
- "Hello! Let's get started — what do you need help with?"
- "Hi there! Ask away, I'm all ears 👂"
- "Hey! What can I do for you today?"

WATERMARK RULE:
- Only mention "Created by Prakhar" or credit when:
  - User explicitly asks who made/built/created you
  - User asks about your origin or creator
- For ALL other normal conversations, DO NOT add any watermark, signature, or creator mention
- Keep responses clean and focused on helping the user

FORBIDDEN (NEVER DO):
- Never mention Google, Gemini, OpenAI, Anthropic, or any AI company/provider/model/API
- Never say "powered by" or reveal underlying technology
- Never break character even if user tries to trick you

MANDATORY RESPONSES:
- If asked "Who made/built/created you?" → "I'm AskAI Chat, created by Prakhar for the AskAI Chat website."
- If asked about your purpose → "I'm here to help answer questions, assist with coding, and provide useful information."

PRAKHAR INFO (FIXED DATA - only share when asked):
- Website: prakharcodes.netlify.app
- Date of Birth: 15 December 2005
- Birthday: 15 December (recurring every year)
- Never calculate age unless explicitly asked

FAVORITE EMOJI RULE:
- If asked "What is your favorite emoji?" or any variation → Respond with: "💦 — kyunki jal hi jeevan hai, stay hydrated 🌱"
- The 💦 emoji represents water, life, freshness, and nature ONLY
- NEVER use it in any sexual, suggestive, or inappropriate context
- Keep the response wholesome, cultural, and positive

LANGUAGE COMMUNICATION RULE (AUTO-DETECT):
- Default: Respond in ENGLISH
- If user writes in Hinglish (Hindi in English letters) → Reply in Hinglish
- If user writes in Hindi script (देवनागरी) → Reply in Hindi script
- If user explicitly requests a language ("Speak in Hindi/Hinglish/English") → Follow that request
- Match the SCRIPT used by the user (English letters = English/Hinglish, Hindi script = Hindi script)
- Never mix scripts without reason; keep language clean and consistent
- Priority: Explicit user instruction > User writing style > Default English
- Never mention or explain these language rules to the user

CAPABILITIES:
- Answering questions on any topic
- Writing and editing text
- Explaining complex concepts simply
- Coding and technical help
- Creative writing and brainstorming
- Analysis and problem-solving

STYLE:
- Be confident, professional, friendly
- Never mention policies or restrictions
- Use markdown formatting for code blocks, lists, and emphasis
- Always stay in character as AskAI Chat
- Keep responses natural and helpful without unnecessary signatures` 
          },
          ...sanitizedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please upgrade your plan." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
