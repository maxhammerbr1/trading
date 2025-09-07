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

    // Get Google Cloud Vision API Key from environment variables
    const GOOGLE_CLOUD_VISION_API_KEY = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');

    if (!GOOGLE_CLOUD_VISION_API_KEY) {
      return new Response(JSON.stringify({ error: 'Google Cloud Vision API Key not configured as a Supabase secret.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Prepare image for Generative AI API (remove data:image/jpeg;base64, prefix)
    const base64EncodedImage = imageUrl.split(',')[1];

    // CHANGED: v1beta to v1 for the API endpoint
    const generativeAiApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${GOOGLE_CLOUD_VISION_API_KEY}`;
    
    const generativeAiPayload = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this image of a trading chart and identify the main asset being traded. Provide only the asset name, if found. If multiple assets are present, list the most prominent one. If no asset is clearly identifiable, state 'Ativo Desconhecido'.",
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

    let detectedAsset = "Ativo Desconhecido";
    if (generativeAiData.candidates && generativeAiData.candidates.length > 0 && generativeAiData.candidates[0].content && generativeAiData.candidates[0].content.parts && generativeAiData.candidates[0].content.parts.length > 0) {
      const textResponse = generativeAiData.candidates[0].content.parts[0].text;
      // Simple parsing: if the AI returns "Ativo Desconhecido", use that. Otherwise, use the response.
      if (textResponse && textResponse.trim() !== "Ativo Desconhecido") {
        detectedAsset = textResponse.trim();
      }
    }

    return new Response(
      JSON.stringify({ asset: detectedAsset, fullText: detectedAsset, message: "Detecção automática via Google Generative AI API." }),
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