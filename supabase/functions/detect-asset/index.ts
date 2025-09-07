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
              // MODIFIED PROMPT: Requesting more detailed and trading-specific analysis in Portuguese
              text: `Analise esta imagem de um gráfico de negociação para fins de trading de curto prazo (1-5 minutos).
              1. Identifique o ATIVO principal.
              2. Identifique o TIMEFRAME (se visível).
              3. Identifique quaisquer PADRÕES DE CANDLESTICK proeminentes (ex: Martelo, Estrela Cadente, Engolfo de Alta/Baixa, Doji, Pin Bar, etc.).
              4. Observe INDICADORES TÉCNICOS visíveis (ex: Médias Móveis, RSI, MACD, Bandas de Bollinger).
              5. Avalie a ESTRUTURA DO PREÇO (suporte, resistência, linhas de tendência).

              Com base EXCLUSIVAMENTE nesta análise técnica visual, determine a DIREÇÃO mais provável para uma operação de trading de curto prazo:
              - "CALL" se houver forte indicação de alta.
              - "PUT" se houver forte indicação de baixa.
              - "NEUTRAL" se o mercado estiver indeciso ou sem sinais claros.

              Forneça um nível de CONFIANÇA para esta previsão (0-100%).
              Explique seu RACIOCÍNIO detalhadamente, mencionando os padrões, indicadores e a estrutura do preço que levaram à sua decisão.

              Responda APENAS no seguinte formato JSON, em português:
              {
                "asset": "Nome do Ativo Detectado (ex: EUR/USD, BTC/USD, Ativo Desconhecido)",
                "direction": "CALL" | "PUT" | "NEUTRAL",
                "confidence": "Número (0-100)",
                "reasoning": "Explicação detalhada da análise, padrões e indicadores que levam à previsão, em português.",
                "pattern": "Padrão de Candlestick Identificado (ex: Martelo, Doji, Engolfo de Alta, Nenhum)"
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