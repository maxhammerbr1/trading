// TradingAI Pro - JavaScript Functionality

class TradingAI {
    constructor() {
        this.selectedAI = null;
        this.uploadedImage = null;
        this.analysisData = null;
        
        // Application data
        this.aiOptions = [
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

        this.assets = [
            "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", 
            "NZD/USD", "EUR/GBP", "EUR/JPY", "GBP/JPY", "BITCOIN", "ETHEREUM",
            "GOLD", "SILVER", "OIL", "NASDAQ", "S&P500", "DOW JONES"
        ];

        this.mockAnalysisResults = [
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

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateAIOptions();
        this.populateAssets();
    }

    setupEventListeners() {
        // Mini browser toggle
        const toggleBrowser = document.getElementById('toggleBrowser');
        const closeBrowser = document.getElementById('closeBrowser');
        const miniBrowser = document.getElementById('miniBrowser');

        toggleBrowser.addEventListener('click', () => {
            miniBrowser.classList.toggle('hidden');
        });

        closeBrowser.addEventListener('click', () => {
            miniBrowser.classList.add('hidden');
        });

        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');
        const removeImage = document.getElementById('removeImage');

        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
        removeImage.addEventListener('click', () => this.removeImage());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFileSelect(file);
            }
        });

        // Paste functionality
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData.items;
            for (let item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    this.handleFileSelect(file);
                    break;
                }
            }
        });

        // Analysis buttons
        const analyzeBtn = document.getElementById('analyzeBtn');
        const autoAnalyzeBtn = document.getElementById('autoAnalyzeBtn');

        analyzeBtn.addEventListener('click', () => this.performAnalysis(false));
        autoAnalyzeBtn.addEventListener('click', () => this.performAnalysis(true));
    }

    populateAIOptions() {
        const aiOptionsContainer = document.getElementById('aiOptions');
        
        this.aiOptions.forEach(ai => {
            const aiOption = document.createElement('div');
            aiOption.className = 'ai-option';
            aiOption.dataset.aiId = ai.id;
            
            aiOption.innerHTML = `
                <div class="ai-option-header">
                    <h4>${ai.name}</h4>
                    <span class="ai-accuracy">${ai.accuracy}</span>
                </div>
                <p>${ai.description}</p>
                <div class="ai-specialty">Especialidade: ${ai.specialty}</div>
            `;
            
            aiOption.addEventListener('click', () => this.selectAI(ai, aiOption));
            aiOptionsContainer.appendChild(aiOption);
        });
    }

    populateAssets() {
        const assetSelect = document.getElementById('assetSelect');
        
        this.assets.forEach(asset => {
            const option = document.createElement('option');
            option.value = asset;
            option.textContent = asset;
            assetSelect.appendChild(option);
        });
    }

    selectAI(ai, element) {
        // Remove previous selection
        document.querySelectorAll('.ai-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select current AI
        element.classList.add('selected');
        this.selectedAI = ai;
        
        // Enable analysis button
        this.updateAnalysisButtons();
    }

    handleFileSelect(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem válida.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImage = e.target.result;
            this.showImagePreview(e.target.result);
            this.updateAnalysisButtons();
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(imageSrc) {
        const uploadContent = document.getElementById('uploadContent');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        
        uploadContent.classList.add('hidden');
        imagePreview.classList.remove('hidden');
        previewImage.src = imageSrc;
    }

    removeImage() {
        const uploadContent = document.getElementById('uploadContent');
        const imagePreview = document.getElementById('imagePreview');
        
        this.uploadedImage = null;
        uploadContent.classList.remove('hidden');
        imagePreview.classList.add('hidden');
        this.updateAnalysisButtons();
    }

    updateAnalysisButtons() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const autoAnalyzeBtn = document.getElementById('autoAnalyzeBtn');
        
        const hasImage = this.uploadedImage !== null;
        const hasSelectedAI = this.selectedAI !== null;
        
        analyzeBtn.disabled = !hasImage || !hasSelectedAI;
        autoAnalyzeBtn.disabled = !hasImage;
    }

    async performAnalysis(isAutomatic) {
        this.showLoadingOverlay();
        
        // Simulate analysis delay
        await this.simulateAnalysis(isAutomatic);
        
        // Generate mock results
        const results = this.generateMockResults(isAutomatic);
        
        this.hideLoadingOverlay();
        this.showResults(results);
    }

    async simulateAnalysis(isAutomatic) {
        const loadingMessages = [
            "Processando imagem com IA...",
            "Identificando padrões de candlestick...",
            "Analisando suporte e resistência...",
            "Calculando indicadores técnicos...",
            "Detectando sinais de entrada...",
            "Gerando previsão final..."
        ];

        const loadingText = document.getElementById('loadingText');
        
        for (let i = 0; i < loadingMessages.length; i++) {
            loadingText.textContent = loadingMessages[i];
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    generateMockResults(isAutomatic) {
        const randomResult = this.mockAnalysisResults[Math.floor(Math.random() * this.mockAnalysisResults.length)];
        const timeframe = document.querySelector('input[name="timeframe"]:checked').value;
        const selectedAsset = document.getElementById('assetSelect').value || this.getRandomAsset();
        const now = new Date();
        const analysisTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Calculate entry time (2-5 minutes from now)
        const entryDelay = Math.floor(Math.random() * 3) + 2;
        const entryTime = new Date(now.getTime() + entryDelay * 60000);
        const entryTimeStr = entryTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const aiUsed = isAutomatic ? "Análise Automática (Todas as IAs)" : this.selectedAI.name;
        
        // Add some randomness to confidence
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
    }

    getRandomAsset() {
        return this.assets[Math.floor(Math.random() * this.assets.length)];
    }

    showLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.remove('hidden');
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('hidden');
    }

    showResults(results) {
        const resultsSection = document.getElementById('resultsSection');
        const resultDirection = document.getElementById('resultDirection');
        const resultConfidence = document.getElementById('resultConfidence');
        const resultAsset = document.getElementById('resultAsset');
        const resultTimeframe = document.getElementById('resultTimeframe');
        const resultAnalysisTime = document.getElementById('resultAnalysisTime');
        const resultEntryTime = document.getElementById('resultEntryTime');
        const resultAI = document.getElementById('resultAI');
        const resultReasoning = document.getElementById('resultReasoning');

        // Update direction
        resultDirection.innerHTML = `
            <i class="fas fa-arrow-${results.direction === 'CALL' ? 'up' : 'down'}"></i>
            <span>${results.direction}</span>
        `;
        resultDirection.className = `result-direction ${results.direction.toLowerCase()}`;

        // Update other fields
        resultConfidence.textContent = `${results.confidence}%`;
        resultAsset.textContent = results.asset;
        resultTimeframe.textContent = results.timeframe;
        resultAnalysisTime.textContent = results.analysisTime;
        resultEntryTime.textContent = results.entryTime;
        resultAI.textContent = results.aiUsed;

        // Show results section
        resultsSection.classList.remove('hidden');

        // Animate reasoning text
        this.animateReasoningText(results.reasoning);

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    animateReasoningText(text) {
        const resultReasoning = document.getElementById('resultReasoning');
        resultReasoning.textContent = '';
        resultReasoning.classList.remove('typing-animation');
        
        setTimeout(() => {
            let index = 0;
            const typeText = () => {
                if (index < text.length) {
                    resultReasoning.textContent += text[index];
                    index++;
                    setTimeout(typeText, 30);
                }
            };
            typeText();
        }, 300);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TradingAI();
});

// Add some visual enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle animations to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.ai-option, .upload-area, .result-card').forEach(el => {
        observer.observe(el);
    });

    // Add click ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});