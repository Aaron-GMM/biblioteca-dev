export function ReaderHeader({ bookTitle, bookAuthor, bookCategory, isSaved, isCompleted, isBookmarked, currentTheme }) {
    return `
        <header class="reader-header glass-panel">
            <div class="reader-header-left">
                <button class="cute-btn btn-back" id="btn-close" title="Voltar (Esc)">
                    <span class="material-symbols-rounded">arrow_back</span>
                    <span>Voltar</span>
                </button>
                
                <div class="reader-title-group">
                    <h2 class="book-display-title" title="${bookTitle}">${bookTitle || 'Lendo agora...'}</h2>
                    <span class="book-display-subtitle">${bookAuthor || 'BibliotecaDev'} ${bookCategory ? `• ${bookCategory}` : ''}</span>
                </div>
            </div>

            <div class="reader-header-actions">
                <!-- Mini Timer Pomodoro de Foco -->
                <div class="pomodoro-widget" title="Timer Pomodoro de Estudo (25 min)">
                    <span class="material-symbols-rounded pomodoro-icon">timer</span>
                    <span id="pomodoro-display" class="pomodoro-time">25:00</span>
                    <button class="pomodoro-btn" id="btn-pomodoro-toggle" title="Iniciar / Pausar Foco">
                        <span class="material-symbols-rounded">play_arrow</span>
                    </button>
                    <button class="pomodoro-btn" id="btn-pomodoro-reset" title="Reiniciar Timer">
                        <span class="material-symbols-rounded">replay</span>
                    </button>
                </div>

                <!-- Modos de Conforto Visual -->
                <div class="theme-switcher" role="group" aria-label="Conforto Visual do PDF">
                    <button class="theme-btn ${currentTheme === 'original' ? 'active' : ''}" data-pdf-theme="original" title="Modo Original (Claro)">
                        <span class="material-symbols-rounded">light_mode</span>
                        <span class="theme-btn-label">Original</span>
                    </button>
                    <button class="theme-btn ${currentTheme === 'sepia' ? 'active' : ''}" data-pdf-theme="sepia" title="Modo Sépia (Leitura Quente e Confortável)">
                        <span class="material-symbols-rounded">wb_twilight</span>
                        <span class="theme-btn-label">Sépia</span>
                    </button>
                    <button class="theme-btn ${currentTheme === 'night' ? 'active' : ''}" data-pdf-theme="night" title="Modo Noturno (Escuro)">
                        <span class="material-symbols-rounded">dark_mode</span>
                        <span class="theme-btn-label">Noturno</span>
                    </button>
                </div>

                <!-- Ações de Estudo -->
                <button class="cute-icon-btn ${isBookmarked ? 'active-accent' : ''}" id="btn-bookmark-page" title="Marcar esta página (Atalho: B)">
                    <span class="material-symbols-rounded">${isBookmarked ? 'bookmark_added' : 'bookmark'}</span>
                </button>

                <button class="cute-icon-btn ${isSaved ? 'active-accent' : ''}" id="btn-reader-shelf" title="${isSaved ? 'Salvo em Quero Ler' : 'Salvar na Minha Estante'}">
                    <span class="material-symbols-rounded">${isSaved ? 'library_add_check' : 'library_add'}</span>
                </button>

                <button class="cute-icon-btn ${isCompleted ? 'active-accent' : ''}" id="btn-reader-complete" title="${isCompleted ? 'Livro Concluído' : 'Marcar Livro como Concluído'}">
                    <span class="material-symbols-rounded">task_alt</span>
                </button>

                <button class="cute-btn btn-notes-toggle" id="btn-toggle-drawer" title="Abrir Sumário, Marcadores & Caderno de Notas (Atalho: N)">
                    <span class="material-symbols-rounded">side_navigation</span>
                    <span>Caderno & Sumário</span>
                </button>
            </div>
        </header>
    `;
}

export function ReaderFooter() {
    return `
        <footer class="reader-controls glass-panel">
            <div class="control-group zoom-controls">
                <button class="cute-icon-btn" id="btn-zoom-out" title="Diminuir Zoom (-)">
                    <span class="material-symbols-rounded">remove</span>
                </button>
                <span id="zoom-level-indicator" class="zoom-indicator" title="Nível de Zoom">125%</span>
                <button class="cute-icon-btn" id="btn-zoom-in" title="Aumentar Zoom (+)">
                    <span class="material-symbols-rounded">add</span>
                </button>
                <button class="cute-icon-btn" id="btn-fit-page" title="Ajustar Página Inteira na Tela">
                    <span class="material-symbols-rounded">fit_screen</span>
                </button>
                <button class="cute-icon-btn" id="btn-fit-width" title="Ajustar à Largura">
                    <span class="material-symbols-rounded">fit_width</span>
                </button>
                <button class="cute-icon-btn" id="btn-fullscreen" title="Tela Cheia (F)">
                    <span class="material-symbols-rounded">fullscreen</span>
                </button>
            </div>

            <div class="control-group reader-progress-slider-group">
                <input type="range" id="page-slider" class="page-slider" min="1" max="1" value="1" title="Navegar pelas páginas">
            </div>

            <div class="control-group pagination-controls">
                <button class="cute-icon-btn btn-page" id="btn-prev" title="Página Anterior (←)">
                    <span class="material-symbols-rounded">chevron_left</span>
                </button>
                
                <div class="page-indicator" title="Digite o número da página e pressione Enter">
                    <input type="number" id="page-num-input" class="page-num-input" value="1" min="1">
                    <span class="separator">de</span>
                    <span id="page-count" class="total-pages">...</span>
                </div>
                
                <button class="cute-icon-btn btn-page" id="btn-next" title="Próxima Página (→)">
                    <span class="material-symbols-rounded">chevron_right</span>
                </button>
            </div>
        </footer>
    `;
}

export default { ReaderHeader, ReaderFooter };
