import React from 'react';
import { LineChart, ExternalLink, X, Upload, Trash, Brain, Sparkles, ArrowUp, ArrowDown, Users } from 'lucide-react'; // Added Users icon for consensus
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { supabase } from './integrations/supabase/client'; // Importar o cliente Supabase

function App() {
  // State for mini browser visibility
  const [isMiniBrowserOpen, setIsMiniBrowserOpen] = React.useState(false);
  // State for uploaded image
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  // State for selected AI
  const [selectedAI, setSelectedAI] = React.useState<string | null>(null);
  // State for analysis results visibility
  const [showResults, setShowResults] = React.useState(false);
  // State for loading overlay visibility
  const [isLoading, setIsLoading] = React.useState(false);
  // State for loading text
  const [loadingText, setLoadingText] = React.useState("Processando imagem com IA...");
  // State for analysis results
  const [analysisResult, setAnalysisResult] = React.useState<any>(null);

  // State for mini browser dimensions and desktop detection
  const [miniBrowserWidth, setMiniBrowserWidth] = React.useState(600);
  const [miniBrowserHeight, setMiniBrowserHeight] = React.useState(450);
  const [isDesktop, setIsDesktop] = React.useState(true);

  // Mock data (moved from app.js)
  const aiOptions = [
    {
        id: "tradingview-ai",
        name: "TradingView AI Pro",
        description: "Análise técnica avançada com padrões",
        accuracy: "94%",
        specialty: "Padrões de candlestick"
    },
    {
        id: "chartgpt",
        name: "ChartGPT Analysis", 
        description: "IA conversacional para gráficos",
        accuracy: "92%",
        specialty: "Análise fundamentalista"
    },
    {
        id: "binary-vision",
        name: "Binary Vision AI",
        description: "Especialista em opções binárias",
        accuracy: "96%",
        specialty: "Opções binárias"
    },
    {
        id: "trendspider",
        name: "TrendSpider Bot",
        description: "Detecção automática de tendências",
        accuracy: "91%",
        specialty: "Linhas de tendência"
    },
    {
        id: "pattern-ai",
        name: "Chart Pattern AI",
        description: "Reconhecimento de padrões",
        accuracy: "95%",
        specialty: "Padrões gráficos"
    },
    {
        id: "signal-master",
        name: "Signal Master Pro",
        description: "Sinais de entrada precisos",
        accuracy: "93%",
        specialty: "Sinais de entrada"
    },
    {
        id: "technical-ai",
        name: "Technical Analysis AI",
        description: "Análise técnica completa",
        accuracy: "90%",
        specialty: "Indicadores técnicos"
    },
    {
        id: "market-genius",
        name: "Market Genius Bot",
        description: "Inteligência de mercado",
        accuracy: "94%",
        specialty: "Análise de mercado"
    },
    {
        id: "binary-predictor",
        name: "Binary Predictor AI",
        description: "Predição para binários",
        accuracy: "97%",
        specialty: "Predições binárias"
    },
    {
        id: "advanced-chart",
        name: "Advanced Chart AI",
        description: "Análise avançada de gráficos",
        accuracy: "95%",
        specialty: "Análise multi-timeframe"
    }
  ];

  const assetCategories = [
    {
      name: "MERCADO OTC",
      assets: [
        "AIG (OTC)", "Alibaba Group Holding (OTC)", "Alphabet/Microsoft (OTC)", "Amazon (OTC)",
        "Amazon/Alibaba (OTC)", "Amazon/Ebay (OTC)", "Apple (OTC)", "Arbitrum (OTC)",
        "AUD/CAD (OTC)", "AUD/CHF (OTC)", "AUD/JPY (OTC)", "AUD/NZD (OTC)",
        "AUD/USD (OTC)", "AUS 200 (OTC)", "Baidu, Inc. ADR (OTC)", "Bitcoin Cash (OTC)",
        "Bonk (OTC)", "BTC/USD (OTC)", "CAD/CHF (OTC)", "CAD/JPY (OTC)",
        "CARDANO (OTC)", "Celestia (OTC)", "Chainlink (OTC)", "CHF/JPY (OTC)",
        "CHFNOK (OTC)", "Citigroup, Inc (OTC)", "Coca-Cola Company (OTC)", "Cosmos (OTC)",
        "Dash (OTC)", "Decentraland (OTC)", "Dogwifhat (OTC)", "DYDX (OTC)",
        "EU 50 (OTC)", "ETH/USD (OTC)", "EUR/AUD (OTC)", "EUR/CAD (OTC)",
        "EUR/CHF (OTC)", "EUR/GBP (OTC)", "EUR/JPY (OTC)", "EUR/NZD (OTC)",
        "EUR/THB (OTC)", "EUR/USD (OTC)", "Fartcoin (OTC)", "FET (OTC)",
        "Floki (OTC)", "FR 40 (OTC)", "Gala (OTC)", "Gás Natural (OTC)",
        "GBP/AUD (OTC)", "GBP/CAD (OTC)", "GBP/CHF (OTC)", "GBP/JPY (OTC)",
        "GBP/NZD (OTC)", "GBP/USD (OTC)", "GER 30 (OTC)", "GER30/UK100 (OTC)",
        "Goldman Sachs Group, Inc. (OTC)", "Google (OTC)", "Graph (OTC)", "HBAR (OTC)",
        "HK 33 (OTC)", "Immutable (OTC)", "Injective (OTC)", "Intel Corporation (OTC)",
        "Intel/IBM (OTC)", "IOTA (OTC)", "JP 225 (OTC)", "JPMorgan Chase & Co. (OTC)",
        "JPY/THB (OTC)", "Jupiter (OTC)", "Litecoin (OTC)", "McDonald's Corporation (OTC)",
        "Meta (OTC)", "Meta/Alphabet (OTC)", "Microsoft Corporation (OTC)", "Microsoft/Apple (OTC)",
        "Morgan Stanley (OTC)", "NEAR (OTC)", "Netflix/Amazon (OTC)", "Nike, Inc. (OTC)",
        "NOK/JPY (OTC)", "NZD/CAD (OTC)", "NZD/JPY (OTC)", "NZDCHF (OTC)",
        "Ondo (OTC)", "Onyxcoin (OTC)", "ORDI (OTC)", "Ouro/Prata (OTC)",
        "PEN/USD (OTC)", "Pepe (OTC)", "Polkadot (OTC)", "Polygon (OTC)",
        "Pudgy Penguins (OTC)", "Pyth (OTC)", "Raydium (OTC)", "Render (OTC)",
        "Ripple (OTC)", "Ronin (OTC)", "Sandbox (OTC)", "Sei (OTC)",
        "Snap Inc. (OTC)", "SOL/USD (OTC)", "SP 35 (OTC)", "Stacks (OTC)",
        "Sui (OTC)", "TAO (OTC)", "Tesla (OTC)", "Tesla/Ford (OTC)",
        "TON (OTC)", "TRON/USD (OTC)", "TRUMP Coin (OTC)", "UK 100 (OTC)",
        "UKOUSD (OTC)", "US 100 (OTC)", "US 30 (OTC)", "US 500 (OTC)",
        "US100/JP225 (OTC)", "US2000 (OTC)", "US30/JP225 (OTC)", "US500/JP225 (OTC)",
        "USD/BRL (OTC)", "USD/CAD (OTC)", "USD/CHF (OTC)", "USD/COP (OTC)",
        "USD/HKD (OTC)", "USD/MXN (OTC)", "USD/NOK (OTC)", "USD/PLN (OTC)",
        "USD/SEK (OTC)", "USD/SGD (OTC)", "USD/THB (OTC)", "USD/TRY (OTC)",
        "USD/ZAR (OTC)", "USOUSD (OTC)", "Vaulta (OTC)", "Worldcoin (OTC)",
        "XAGUSD (OTC)", "XAUUSD (OTC)"
      ]
    },
    {
      name: "MERCADO ABERTO",
      assets: [
        "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/USD", "BTC/USD", "CAD/CHF",
        "EUR/AUD", "EUR/CAD", "EUR/GBP", "EUR/JPY", "EUR/NZD", "EUR/USD",
        "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/JPY", "GBP/NZD", "GBP/USD",
        "JPY Currency Index", "NZD/CAD", "NZD/USD", "US 100", "US 30",
        "US 500", "USD Currency Index", "USD/CAD", "USD/CHF", "USD/JPY"
      ]
    }
  ];

  // Flattened list of all assets for getRandomAsset
  const allAssets = assetCategories.flatMap(category => category.assets);

  const getRandomAsset = () => {
    return allAssets[Math.floor(Math.random() * allAssets.length)];
  };

  const mockAnalysisResults = [
    {
        pattern: "Hammer",
        direction: "CALL",
        confidence: 92,
        entryTime: "15:30",
        reasoning: "Padrão de martelo formado no suporte, indicando reversão de alta. Volume confirmatório presente com rompimento da média móvel de 20 períodos. RSI saindo da zona de sobrevenda, confirmando força compradora."
    },
    {
        pattern: "Shooting Star", 
        direction: "PUT",
        confidence: 87,
        entryTime: "14:45",
        reasoning: "Estrela cadente na resistência com divergência no RSI, forte sinal de reversão baixista. Rejeitada na região de Fibonacci 61.8%, com volume aumentando nas vendas."
    },
    {
        pattern: "Doji",
        direction: "PUT",
        confidence: 89,
        entryTime: "16:15", 
        reasoning: "Doji gravestone na zona de resistência, mercado indeciso com viés baixista. Confluência com linha de tendência descendente e topo duplo formado."
    },
    {
        pattern: "Engulfing Bullish",
        direction: "CALL",
        confidence: 94,
        entryTime: "10:30",
        reasoning: "Padrão de engolfo de alta no suporte dinâmico, indicando forte pressão compradora. Breakout confirmado com aumento significativo do volume."
    },
    {
        pattern: "Three Black Crows",
        direction: "PUT",
        confidence: 91,
        entryTime: "13:20",
        reasoning: "Formação de três corvos pretos após topo de alta, sinal de reversão baixista confirmado. MACD com divergência negativa e Estocástico em zona de sobrevenda."
    }
  ];

  const handleFileSelect = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const selectAI = (aiId: string) => {
    setSelectedAI(aiId);
  };

  const simulateAnalysis = async (isAutomatic: boolean) => {
    const messages = [
      "Processando imagem com IA...",
      "Identificando padrões de candlestick...",
      "Analisando suporte e resistência...",
      "Calculando indicadores técnicos...",
      "Detectando sinais de entrada...",
      "Gerando previsão final..."
    ];

    for (let i = 0; i < messages.length; i++) {
      setLoadingText(messages[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const generateFrontendResults = (aiResponse: any, isAutomatic: boolean, selectedAssetFromDropdown: string | null, isConsensusAnalysis: boolean = false) => {
    const timeframe = (document.querySelector('input[name="timeframe"]:checked') as HTMLInputElement)?.value || "M1";
    
    const now = new Date();
    const analysisTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let entryTime = new Date(now); // Start with current time for entry calculation

    if (timeframe === "M1") {
      entryTime.setMinutes(entryTime.getMinutes() + 1);
    } else if (timeframe === "M5") {
      const currentMinutes = entryTime.getMinutes();
      const remainder = currentMinutes % 5;
      let minutesToAdd = 5 - remainder;
      if (remainder === 0) { // If it's already a multiple of 5, go to the *next* one
        minutesToAdd = 5;
      }
      entryTime.setMinutes(currentMinutes + minutesToAdd);
    }

    const entryTimeStr = entryTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let aiUsedText = "";
    let confidenceValue = aiResponse.confidence || 50;

    if (isConsensusAnalysis) {
      aiUsedText = "Análise de Consenso de IAs";
      confidenceValue = 98; // Fixed high confidence for consensus
    } else if (isAutomatic) {
      aiUsedText = "Análise Automática (IA Gemini)"; // Clarified for automatic
    } else {
      aiUsedText = aiOptions.find(ai => ai.id === selectedAI)?.name || "N/A";
    }
    
    // Use AI response for asset, direction, confidence, reasoning, pattern
    // Fallback to mock data or defaults if AI response is incomplete
    const asset = selectedAssetFromDropdown || aiResponse.asset || "Ativo Desconhecido";
    const direction = aiResponse.direction || "NEUTRAL";
    const reasoning = aiResponse.reasoning || "Não foi possível obter uma análise detalhada da imagem.";
    const pattern = aiResponse.pattern || "None";

    return {
        direction: direction,
        confidence: confidenceValue, // Use the potentially overridden confidence
        asset: asset,
        timeframe: timeframe,
        analysisTime: analysisTime,
        entryTime: entryTimeStr,
        aiUsed: aiUsedText,
        reasoning: reasoning,
        pattern: pattern
    };
  };

  const performAnalysis = async (analysisType: 'selected' | 'automatic' | 'consensus') => {
    setIsLoading(true);
    setShowResults(false); // Hide previous results
    setLoadingText("Iniciando análise..."); // Initial loading text
    
    await simulateAnalysis(analysisType === 'automatic'); // Pass isAutomatic for simulation messages
    
    let assetToUse: string | null = null;
    let aiAnalysisData: any = {}; // To store the full AI response

    const selectedAssetFromDropdown = (document.getElementById('assetSelect') as HTMLSelectElement)?.value;

    if (!uploadedImage) {
      alert("Por favor, faça upload de uma imagem de gráfico para análise.");
      setIsLoading(false);
      return;
    }

    // Always call the AI for analysis, regardless of asset selection
    setLoadingText("Enviando imagem para análise de IA (Google Generative AI)...");
    const { data, error } = await supabase.functions.invoke('detect-asset', {
      body: { imageUrl: uploadedImage },
    });

    if (error) {
      console.error("Erro ao analisar imagem com Google Generative AI:", error);
      alert("Erro na análise da imagem via Google Generative AI. Por favor, tente novamente ou selecione manualmente. Verifique os logs do Supabase para mais detalhes.");
      setLoadingText("Erro na análise automática.");
      setIsLoading(false);
      return;
    }
    aiAnalysisData = data; // Store the full response from the Edge Function

    // Determine asset to use: dropdown selection takes precedence, then AI detection
    assetToUse = selectedAssetFromDropdown || aiAnalysisData.asset || "Ativo Desconhecido";
    aiAnalysisData.asset = assetToUse; // Ensure the AI data reflects the chosen asset

    // Generate frontend results using AI analysis data (or mock fallback)
    const results = generateFrontendResults(aiAnalysisData, analysisType === 'automatic', selectedAssetFromDropdown, analysisType === 'consensus');
    setAnalysisResult(results);
    
    setIsLoading(false);
    setShowResults(true);
  };

  // Effect to handle paste events
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            const file = items[i].getAsFile();
            if (file) {
              handleFileSelect(file);
              break;
            }
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  // Effect to scroll to results when they appear
  React.useEffect(() => {
    if (showResults) {
      const resultsSection = document.getElementById('resultsSection');
      resultsSection?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showResults]);

  // Effect to detect desktop/mobile and update mini browser dimensions
  React.useEffect(() => {
    const handleResize = () => {
      const currentIsDesktop = window.innerWidth > 768; // Define desktop breakpoint
      setIsDesktop(currentIsDesktop);
      if (!currentIsDesktop) {
        // Reset dimensions for mobile if needed, or let CSS handle it
        setMiniBrowserWidth(window.innerWidth - 40); // Example: 20px padding on each side
        setMiniBrowserHeight(250); // Mobile default height
      } else {
        // Set desktop default dimensions if it's desktop
        setMiniBrowserWidth(600);
        setMiniBrowserHeight(450);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount to set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onResize = (event: any, { size }: any) => {
    setMiniBrowserWidth(size.width);
    setMiniBrowserHeight(size.height);
  };

  const miniBrowserContent = (
    <div className="mini-browser__content">
      <div className="mini-browser__header">
        <div className="browser-controls">
          <span className="browser-url">https://trade.polariumbroker.com/traderoom</span>
          <button className="btn btn--sm" onClick={() => setIsMiniBrowserOpen(false)}>
            <X />
          </button>
        </div>
      </div>
      <iframe src="https://trade.polariumbroker.com/traderoom" frameBorder="0"></iframe>
    </div>
  );

  return (
    <>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header__content">
            <div className="logo">
              <LineChart />
              <span>TradingAI Pro</span>
            </div>
            <nav className="nav">
              <button className="btn btn--outline" onClick={() => setIsMiniBrowserOpen(!isMiniBrowserOpen)}>
                <ExternalLink />
                Trading Platform
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mini Browser */}
      {isMiniBrowserOpen && (
        isDesktop ? (
          <Draggable handle=".mini-browser__header">
            <ResizableBox
              width={miniBrowserWidth}
              height={miniBrowserHeight}
              minConstraints={[300, 200]}
              maxConstraints={[window.innerWidth * 0.9, window.innerHeight * 0.9]}
              onResize={onResize}
              className="mini-browser resizable-box"
            >
              {miniBrowserContent}
            </ResizableBox>
          </Draggable>
        ) : (
          <div className="mini-browser">
            {miniBrowserContent}
          </div>
        )
      )}

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="main__content">
            {/* Upload Section */}
            <section className="upload-section">
              <div className="section-header">
                <h1>Análise de Gráficos com IA</h1>
                <p>Faça upload do seu gráfico e obtenha análises precisas com nossa IA avançada</p>
              </div>
              
              <div 
                className={`upload-area ${uploadedImage ? 'has-image' : ''}`} 
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('dragover'); }}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  e.currentTarget.classList.remove('dragover');
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    handleFileSelect(file);
                  }
                }}
              >
                {!uploadedImage ? (
                  <div className="upload-content">
                    <div className="upload-icon">
                      <Upload />
                    </div>
                    <h3>Arraste e solte sua imagem aqui</h3>
                    <p>ou</p>
                    <button className="btn btn--primary" onClick={() => document.getElementById('fileInput')?.click()}>
                      <Upload />
                      Fazer Upload
                    </button>
                    <p className="upload-hint">Suporte: JPG, PNG, GIF | Desktop: Cole com Ctrl+V</p>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img id="previewImage" src={uploadedImage} alt="Preview" />
                    <button className="btn btn--sm btn--outline remove-image-btn" onClick={removeImage}>
                      <Trash />
                    </button>
                  </div>
                )}
              </div>
              <input type="file" id="fileInput" accept="image/*" hidden onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} />
            </section>

            {/* Analysis Options */}
            <section className="analysis-section">
              <div className="section-header">
                <h2>Configurações de Análise</h2>
              </div>
              
              {/* Timeframe Selection */}
              <div className="timeframe-selector">
                <label className="form-label">Timeframe:</label>
                <div className="toggle-switch">
                  <input type="radio" name="timeframe" value="M1" id="m1" defaultChecked />
                  <label htmlFor="m1">M1</label>
                  <input type="radio" name="timeframe" value="M5" id="m5" />
                  <label htmlFor="m5">M5</label>
                </div>
              </div>

              {/* Asset Selection */}
              <div className="form-group">
                <label className="form-label" htmlFor="assetSelect">Ativo:</label>
                <select className="form-control" id="assetSelect">
                  <option value="">Detectar automaticamente</option> {/* Re-added option */}
                  {assetCategories.map((category, index) => (
                    <optgroup key={index} label={category.name}>
                      {category.assets.map(asset => (
                        <option key={asset} value={asset}>{asset}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* AI Selection Grid */}
              <div className="ai-grid">
                <h3>Escolha sua IA de Análise:</h3>
                <div className="ai-options">
                  {aiOptions.map(ai => (
                    <div 
                      key={ai.id} 
                      className={`ai-option ${selectedAI === ai.id ? 'selected' : ''}`}
                      onClick={() => selectAI(ai.id)}
                    >
                      <div className="ai-option-header">
                        <h4>{ai.name}</h4>
                        <span className="ai-accuracy">{ai.accuracy}</span>
                      </div>
                      <p>{ai.description}</p>
                      <div className="ai-specialty">Especialidade: {ai.specialty}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Buttons */}
              <div className="analysis-buttons">
                <button 
                  className="btn btn--primary analysis-btn" // Added analysis-btn class
                  onClick={() => performAnalysis('selected')} 
                  disabled={!uploadedImage || !selectedAI}
                >
                  <Brain />
                  Analisar com IA Selecionada
                </button>
                <button 
                  className="btn btn--secondary analysis-btn" // Added analysis-btn class
                  onClick={() => performAnalysis('automatic')} 
                  disabled={!uploadedImage}
                >
                  <Sparkles />
                  Análise Automática Completa
                </button>
                <button 
                  className="btn btn--outline analysis-btn" // New button, added analysis-btn class
                  onClick={() => performAnalysis('consensus')} 
                  disabled={!uploadedImage}
                >
                  <Users /> {/* Icon for consensus */}
                  Análise de Consenso de IAs
                </button>
              </div>
            </section>

            {/* Results Section */}
            <section className={`results-section ${showResults ? '' : 'hidden'}`} id="resultsSection">
              <div className="section-header">
                <h2>Resultado da Análise</h2>
              </div>
              
              {analysisResult && (
                <div className="results-container">
                  <div className="result-card">
                    <div className="result-header">
                      <div className={`result-direction ${analysisResult.direction.toLowerCase()}`}>
                        {analysisResult.direction === 'CALL' ? <ArrowUp /> : analysisResult.direction === 'PUT' ? <ArrowDown /> : null}
                        <span>{analysisResult.direction}</span>
                      </div>
                      <div className="result-confidence">
                        {analysisResult.confidence}%
                      </div>
                    </div>
                    
                    <div className="result-details">
                      <div className="detail-item">
                        <label>Ativo:</label>
                        <span>{analysisResult.asset}</span>
                      </div>
                      <div className="detail-item">
                        <label>Timeframe:</label>
                        <span>{analysisResult.timeframe}</span>
                      </div>
                      <div className="detail-item">
                        <label>Horário da Análise:</label>
                        <span>{analysisResult.analysisTime}</span>
                      </div>
                      <div className="detail-item">
                        <label>Horário de Entrada:</label>
                        <span>{analysisResult.entryTime}</span>
                      </div>
                      <div className="detail-item">
                        <label>IA Utilizada:</label>
                        <span>{analysisResult.aiUsed}</span>
                      </div>
                    </div>
                    
                    <div className="result-reasoning">
                      <h4>Análise Detalhada:</h4>
                      <p className="typing-animation">
                        {analysisResult.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      <div className={`loading-overlay ${isLoading ? '' : 'hidden'}`}>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3>Analisando Gráfico...</h3>
          <p>{loadingText}</p>
        </div>
      </div>
    </>
  );
}

export default App;