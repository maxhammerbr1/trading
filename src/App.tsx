import React from 'react';
import { LineChart, ExternalLink, X, CloudUpload, Upload, Trash, Brain, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';

function App() {
  // State for mini browser visibility
  const [isMiniBrowserOpen, setIsMiniBrowserOpen] = React.useState(false);
  // State for uploaded image
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  // State for selected AI
  const [selectedAI, setSelectedAI] = React.useState<string | null>(null);
  // State for analysis results visibility
  const [showResults, setShowResults] = React.React.useState(false);
  // State for loading overlay visibility
  const [isLoading, setIsLoading] = React.useState(false);
  // State for loading text
  const [loadingText, setLoadingText] = React.useState("Processando imagem com IA...");
  // State for analysis results
  const [analysisResult, setAnalysisResult] = React.useState<any>(null);

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

  const assets = [
    "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", 
    "NZD/USD", "EUR/GBP", "EUR/JPY", "GBP/JPY", "BITCOIN", "ETHEREUM",
    "GOLD", "SILVER", "OIL", "NASDAQ", "S&P500", "DOW JONES"
  ];

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

  const getRandomAsset = () => {
    return assets[Math.floor(Math.random() * assets.length)];
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

  const generateMockResults = (isAutomatic: boolean) => {
    const randomResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];
    const timeframe = (document.querySelector('input[name="timeframe"]:checked') as HTMLInputElement)?.value || "M1";
    const selectedAsset = (document.getElementById('assetSelect') as HTMLSelectElement)?.value || getRandomAsset();
    const now = new Date();
    const analysisTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const entryDelay = Math.floor(Math.random() * 3) + 2;
    const entryTime = new Date(now.getTime() + entryDelay * 60000);
    const entryTimeStr = entryTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const aiUsed = isAutomatic ? "Análise Automática (Todas as IAs)" : aiOptions.find(ai => ai.id === selectedAI)?.name || "N/A";
    
    const baseConfidence = randomResult.confidence;
    const confidence = Math.min(97, Math.max(85, baseConfidence + Math.floor(Math.random() * 6) - 3));

    return {
        direction: randomResult.direction,
        confidence: confidence,
        asset: selectedAsset,
        timeframe: timeframe,
        analysisTime: analysisTime,
        entryTime: entryTimeStr,
        aiUsed: aiUsed,
        reasoning: randomResult.reasoning,
        pattern: randomResult.pattern
    };
  };

  const performAnalysis = async (isAutomatic: boolean) => {
    setIsLoading(true);
    setShowResults(false); // Hide previous results
    setLoadingText("Processando imagem com IA..."); // Reset loading text
    
    await simulateAnalysis(isAutomatic);
    
    const results = generateMockResults(isAutomatic);
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
      <div className={`mini-browser ${isMiniBrowserOpen ? '' : 'hidden'}`}>
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
                      <CloudUpload />
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
                    <button className="btn btn--sm btn--outline" onClick={removeImage}>
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
                  <option value="">Detectar automaticamente</option>
                  {assets.map(asset => (
                    <option key={asset} value={asset}>{asset}</option>
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
                  className="btn btn--primary btn--lg" 
                  onClick={() => performAnalysis(false)} 
                  disabled={!uploadedImage || !selectedAI}
                >
                  <Brain />
                  Analisar com IA Selecionada
                </button>
                <button 
                  className="btn btn--secondary btn--lg" 
                  onClick={() => performAnalysis(true)} 
                  disabled={!uploadedImage}
                >
                  <Sparkles />
                  Análise Automática Completa
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
                        {analysisResult.direction === 'CALL' ? <ArrowUp /> : <ArrowDown />}
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