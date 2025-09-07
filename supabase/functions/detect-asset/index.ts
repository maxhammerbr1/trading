import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json(); // Expecting base64 image string

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Image URL (base64) is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const GOOGLE_CLOUD_VISION_API_KEY = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');

    if (!GOOGLE_CLOUD_VISION_API_KEY) {
      return new Response(JSON.stringify({ error: 'Google Cloud Vision API Key not configured as a Supabase secret.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const base64EncodedImage = imageUrl.split(',')[1];

    // CHANGED: Model to gemini-2.5-pro and a more detailed prompt for analysis
    const generativeAiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GOOGLE_CLOUD_VISION_API_KEY}`;
    
    const generativeAiPayload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this trading chart image. Identify the main asset, any prominent candlestick patterns, and visible technical indicators (e.g., moving averages, RSI, MACD). Based on this analysis, predict the market direction (CALL for buy/up, PUT for sell/down). Provide a confidence level for your prediction (0-100%). Explain your reasoning clearly.
              
              Respond ONLY in the following JSON format:
              {
                "asset": "Detected Asset Name (e.g., EUR/USD, BTC/USD, Ativo Desconhecido)",
                "direction": "CALL" | "PUT" | "NEUTRAL",
                "confidence": "Number (0-100)",
                "reasoning": "Detailed explanation of the analysis, patterns, and indicators leading to the prediction.",
                "pattern": "Identified Candlestick Pattern (e.g., Hammer, Doji, Engulfing Bullish, None)"
              }`,
            },
            {
              inline_data: {
                mime_type: "image/jpeg", // Assuming JPEG, adjust if other types are expected
                data: base64EncodedImage,
              },
            },
          ],
        },
      ],
    };

    const generativeAiApiResponse = await fetch(generativeAiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(generativeAiPayload),
    });

    const generativeAiData = await generativeAiApiResponse.json();

    if (!generativeAiApiResponse.ok) {
      console.error('Google Generative AI API Error:', generativeAiData);
      return new Response(JSON.stringify({ error: 'Failed to analyze image with Google Generative AI API.', details: generativeAiData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: generativeAiApiResponse.status,
      });
    }

    let analysisResult = {
      asset: "Ativo Desconhecido",
      direction: "NEUTRAL",
      confidence: 50,
      reasoning: "Não foi possível obter uma análise detalhada da imagem.",
      pattern: "None"
    };

    if (generativeAiData.candidates && generativeAiData.candidates.length > 0 && generativeAiData.candidates[0].content && generativeAiData.candidates[0].content.parts && generativeAiData.candidates[0].content.parts.length > 0) {
      let textResponse = generativeAiData.candidates[0].content.parts[0].text;
      console.log("Raw AI Response:", textResponse); // Log the raw response for debugging

      // NEW: Clean the response: remove markdown code block if present
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        textResponse = jsonMatch[1];
      } else {
        // Fallback if no markdown block, try to clean up common AI conversational intros
        textResponse = textResponse.replace(/^(Here's the analysis in JSON format:|```json|```|\s)+/g, '').trim();
      }

      try {
        const parsedResponse = JSON.parse(textResponse);
        analysisResult.asset = parsedResponse.asset || analysisResult.asset;
        analysisResult.direction = parsedResponse.direction || analysisResult.direction;
        // Ensure confidence is parsed as an integer
        analysisResult.confidence = parseInt(parsedResponse.confidence) || analysisResult.confidence;
        analysisResult.reasoning = parsedResponse.reasoning || analysisResult.reasoning;
        analysisResult.pattern = parsedResponse.pattern || analysisResult.pattern;
      } catch (jsonError) {
        console.error("Failed to parse AI response as JSON:", jsonError);
        // If parsing fails, use a more informative error message for debugging
        analysisResult.reasoning = `Erro ao processar análise da IA. Resposta bruta: ${textResponse.substring(0, 500)}...`;
      }
    }

    return new Response(
      JSON.stringify({ 
        asset: analysisResult.asset, 
        direction: analysisResult.direction,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
        pattern: analysisResult.pattern,
        message: "Análise detalhada via Google Generative AI API." 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})