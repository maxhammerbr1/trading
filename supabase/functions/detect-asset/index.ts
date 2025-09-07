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

    // Prepare image for Vision API (remove data:image/jpeg;base64, prefix)
    const base64EncodedImage = imageUrl.split(',')[1];

    // CORRECTED: Changed GOOGLE_CLOUD_VISION_VISION_API_KEY to GOOGLE_CLOUD_VISION_API_KEY
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;
    const visionApiPayload = {
      requests: [
        {
          image: {
            content: base64EncodedImage,
          },
          features: [
            { type: 'TEXT_DETECTION' }, // Detect text in the image
            { type: 'LABEL_DETECTION' } // Detect general labels
          ],
        },
      ],
    };

    const visionApiResponse = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visionApiPayload),
    });

    const visionApiData = await visionApiResponse.json();

    if (!visionApiResponse.ok) {
      console.error('Google Vision API Error:', visionApiData);
      return new Response(JSON.stringify({ error: 'Failed to analyze image with Google Vision API.', details: visionApiData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: visionApiResponse.status,
      });
    }

    // Process Vision API response to find a relevant asset
    let detectedAsset = "Ativo Desconhecido";
    let detectedText = "";

    if (visionApiData.responses && visionApiData.responses.length > 0) {
      const response = visionApiData.responses[0];
      if (response.fullTextAnnotation && response.fullTextAnnotation.text) {
        detectedText = response.fullTextAnnotation.text;
        // Simple heuristic: look for common asset patterns or just return the first line
        const lines = detectedText.split('\n');
        if (lines.length > 0 && lines[0].length < 30) { // Assume first line is often the asset name if short
          detectedAsset = lines[0].trim();
        } else {
          // More robust parsing would be needed here
          // For demonstration, we'll just use a generic fallback or a simple regex
          const commonAssets = ["EUR/USD", "BTC/USD", "GOLD", "US 100", "Amazon", "GBP/JPY", "DYDX"];
          for (const asset of commonAssets) {
            if (detectedText.includes(asset)) {
              detectedAsset = asset;
              break;
            }
          }
        }
      } else if (response.labelAnnotations && response.labelAnnotations.length > 0) {
        // Fallback to label detection if no text, though less precise for assets
        detectedAsset = response.labelAnnotations[0].description;
      }
    }

    return new Response(
      JSON.stringify({ asset: detectedAsset, fullText: detectedText, message: "Detecção automática via Google Vision API." }),
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