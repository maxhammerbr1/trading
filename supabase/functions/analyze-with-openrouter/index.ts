import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, selectedAI } = await req.json(); // Expecting base64 image string and selected AI ID

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Image URL (base64) is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenRouter API Key not configured as a Supabase secret.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const base64EncodedImage = imageUrl.split(',')[1];

    let specialtyPrompt = "";
    if (selectedAI) {
      const aiOptions = [
        { id: "tradingview-ai", specialty: "Padrões de candlestick" },
        { id: "chartgpt", specialty: "Análise fundamentalista" },
        { id: "binary-vision", specialty: "Opções binárias" },
        { id: "trendspider", specialty: "Linhas de tendência" },
        { id: "pattern-ai", specialty: "Padrões gráficos" },
        { id: "signal-master", specialty: "Sinais de entrada" },
        { id: "technical-ai", specialty: "Indicadores técnicos" },
        { id: "market-genius", specialty: "Análise de mercado" },
        { id: "binary-predictor", specialty: "Predições binárias" },
        { id: "advanced-chart", specialty: "Análise multi-timeframe" }
      ];
      const selectedAiOption = aiOptions.find(ai => ai.id === selectedAI);
      if (selectedAiOption) {
        specialtyPrompt = `Foque sua análise na especialidade de "${selectedAiOption.specialty}".`;
      }
    }

    const openRouterPayload = {
      model: "openai/gpt-4o", // Or another suitable multimodal model available via OpenRouter
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de um gráfico de negociação para uma decisão de trading de curtíssimo prazo (1-5 minutos). ${specialtyPrompt}
              1.  **Identifique o ATIVO principal e o TIMEFRAME (se visível).**
              2.  **Analise a ESTRUTURA DO PREÇO:** Suporte, resistência, linhas de tendência.
              3.  **Identifique PADRÕES DE CANDLESTICK proeminentes:** (ex: Martelo, Estrela Cadente, Engolfo de Alta/Baixa, Doji, Pin Bar, etc.).
              4.  **Observe INDICADORES TÉCNICOS visíveis:** (ex: Médias Móveis, RSI, MACD, Bandas de Bollinger).

              Com base EXCLUSIVAMENTE nesta análise técnica visual, e considerando a alta sensibilidade para decisões de trading, determine a **DIREÇÃO MAIS PROVÁVEL** para uma operação de curtíssimo prazo:
              -   **"CALL"** se houver **qualquer indicação razoável de alta** ou se a tendência geral for de alta.
              -   **"PUT"** se houver **qualquer indicação razoável de baixa** ou se a tendência geral for de baixa.
              -   **"NEUTRAL"** APENAS como último recurso, se não houver absolutamente NENHUM sinal discernível em qualquer direção, ou se os sinais forem completamente conflitantes e impossíveis de resolver.

              Forneça um nível de **CONFIANÇA** para esta previsão (0-100%).
              Explique seu **RACIOCÍNIO** detalhadamente, mencionando os padrões, indicadores e a estrutura do preço que levaram à sua decisão, com foco na clareza e justificativa técnica.

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
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64EncodedImage}`, // Assuming JPEG
              },
            },
          ],
        },
      ],
    };

    const openRouterApiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openRouterPayload),
    });

    const openRouterData = await openRouterApiResponse.json();

    if (!openRouterApiResponse.ok) {
      console.error('OpenRouter API Error:', openRouterData);
      return new Response(JSON.stringify({ error: 'Failed to analyze image with OpenRouter API.', details: openRouterData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: openRouterApiResponse.status,
      });
    }

    let analysisResult = {
      asset: "Ativo Desconhecido",
      direction: "NEUTRAL",
      confidence: 50,
      reasoning: "Não foi possível obter uma análise detalhada da imagem via OpenRouter.",
      pattern: "None"
    };

    if (openRouterData.choices && openRouterData.choices.length > 0 && openRouterData.choices[0].message && openRouterData.choices[0].message.content) {
      let textResponse = openRouterData.choices[0].message.content;
      console.log("Raw OpenRouter AI Response:", textResponse);

      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        textResponse = jsonMatch[1];
      } else {
        textResponse = textResponse.replace(/^(Here's the analysis in JSON format:|```json|```|\s)+/g, '').trim();
      }

      try {
        const parsedResponse = JSON.parse(textResponse);
        analysisResult.asset = parsedResponse.asset || analysisResult.asset;
        analysisResult.direction = parsedResponse.direction || analysisResult.direction;
        analysisResult.confidence = parseInt(parsedResponse.confidence) || analysisResult.confidence;
        analysisResult.reasoning = parsedResponse.reasoning || analysisResult.reasoning;
        analysisResult.pattern = parsedResponse.pattern || analysisResult.pattern;
      } catch (jsonError) {
        console.error("Failed to parse OpenRouter AI response as JSON:", jsonError);
        analysisResult.reasoning = `Erro ao processar análise da IA (OpenRouter). Resposta bruta: ${textResponse.substring(0, 500)}...`;
      }
    }

    return new Response(
      JSON.stringify({ 
        asset: analysisResult.asset, 
        direction: analysisResult.direction,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
        pattern: analysisResult.pattern,
        message: "Análise detalhada via OpenRouter API." 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('OpenRouter Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})