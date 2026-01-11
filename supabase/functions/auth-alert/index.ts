import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthAlertRequest {
  type: 'signup' | 'login';
  email: string;
  name?: string;
  userAgent?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEB3FORMS_API_KEY = Deno.env.get("WEB3FORMS_API_KEY");
    
    if (!WEB3FORMS_API_KEY) {
      console.error("WEB3FORMS_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { type, email, name, userAgent }: AuthAlertRequest = await req.json();
    
    // Validate input
    if (!type || !['signup', 'login'].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    if (!email || typeof email !== 'string' || email.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    // Get IP from request headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               req.headers.get("x-real-ip") || 
               "Unknown";

    // Try to get location from IP using a free service
    let location = "Unknown";
    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.status === "success") {
          location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
        }
      }
    } catch (geoError) {
      console.log("Could not fetch location:", geoError);
    }

    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });

    const alertTitle = type === 'signup' 
      ? "🆕 AskAI New User Sign Up Alert" 
      : "🔐 AskAI User Login Alert";

    const sanitizedName = name ? String(name).slice(0, 100) : "Not provided";
    const sanitizedUserAgent = userAgent ? String(userAgent).slice(0, 500) : "Unknown";

    const message = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${alertTitle}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email: ${email}
👤 Name: ${sanitizedName}
🕐 Time: ${formattedTime}
🌐 IP Address: ${ip}
📍 Approx Location: ${location}
💻 Device/Browser: ${sanitizedUserAgent}
🔄 Action Type: ${type === 'signup' ? 'New Registration' : 'User Login'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    // Send to Web3Forms using secret
    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_API_KEY);
    formData.append("subject", alertTitle);
    formData.append("from_name", "AskAI Auth System");
    formData.append("message", message);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Web3Forms error:", data);
      return new Response(JSON.stringify({ error: "Failed to send alert" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Auth alert sent successfully for:", email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in auth-alert function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
