export default function ReaderPage(bookTitle) {
    return `
        <div class="modern-reader-wrapper" id="reader-container">
            
            <header class="reader-header glass-panel">
                <button class="cute-btn btn-back" id="btn-close" title="Voltar ao Acervo">
                    <span class="material-symbols-rounded">arrow_back</span>
                    <span>Voltar</span>
                </button>
                
                <div class="reader-title-group">
                    <h2 class="book-display-title">${bookTitle || 'Lendo agora...'}</h2>
                </div>
                
                <div class="spacer"></div>
            </header>

            <main class="reader-main">
                <div id="loading-indicator" class="modern-loader">
                    <div class="spinner"></div>
                    <p>Preparando seu livro...</p>
                </div>
                <div class="canvas-container">
                    <canvas id="pdf-render"></canvas>
                </div>
            </main>

            <footer class="reader-controls glass-panel">
                <div class="control-group zoom-controls">
                    <button class="cute-icon-btn" id="btn-zoom-out" title="Diminuir Zoom">
                        <span class="material-symbols-rounded">zoom_out</span>
                    </button>
                    <button class="cute-icon-btn" id="btn-fullscreen" title="Tela Cheia">
                        <span class="material-symbols-rounded">fullscreen</span>
                    </button>
                    <button class="cute-icon-btn" id="btn-zoom-in" title="Aumentar Zoom">
                        <span class="material-symbols-rounded">zoom_in</span>
                    </button>
                </div>

                <div class="control-group pagination-controls">
                    <button class="cute-icon-btn btn-page" id="btn-prev" title="Página Anterior">
                        <span class="material-symbols-rounded">chevron_left</span>
                    </button>
                    
                    <div class="page-indicator">
                        <span id="page-num" class="current-page">0</span>
                        <span class="separator">/</span>
                        <span id="page-count" class="total-pages">0</span>
                    </div>
                    
                    <button class="cute-icon-btn btn-page" id="btn-next" title="Próxima Página">
                        <span class="material-symbols-rounded">chevron_right</span>
                    </button>
                </div>
            </footer>

        </div>
    `;
}