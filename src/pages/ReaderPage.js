import { ReaderHeader, ReaderFooter } from '../components/ReaderControls.js';

export default function ReaderPage({
    bookTitle,
    bookAuthor = '',
    bookCategory = '',
    isSaved = false,
    isCompleted = false,
    isBookmarked = false,
    currentTheme = 'original'
}) {
    return `
        <div class="modern-reader-wrapper" id="reader-container" data-pdf-theme="${currentTheme}">
            ${ReaderHeader({ bookTitle, bookAuthor, bookCategory, isSaved, isCompleted, isBookmarked, currentTheme })}

            <div class="reader-workspace">
                <main class="reader-main" id="reader-scroll-container">
                    <div id="loading-indicator" class="modern-loader">
                        <div class="spinner"></div>
                        <p>Preparando seu livro para leitura...</p>
                        <span class="loader-sub">Dica: Use as setas ⬅ ➡ do teclado para virar páginas</span>
                    </div>
                    <div class="canvas-container">
                        <canvas id="pdf-render"></canvas>
                    </div>
                </main>

                <!-- Painel Lateral Retrátil: Sumário, Marcadores & Caderno de Notas -->
                <aside class="reader-drawer" id="reader-drawer" aria-hidden="true">
                    <div class="drawer-header">
                        <h3><span class="material-symbols-rounded">menu_book</span> Apoio de Estudo</h3>
                        <button class="cute-icon-btn" id="btn-close-drawer" title="Fechar Painel">
                            <span class="material-symbols-rounded">close</span>
                        </button>
                    </div>

                    <div class="drawer-body">
                        <!-- Sumário do PDF (aparece automaticamente se o PDF tiver índice) -->
                        <section class="drawer-section" id="outline-section" style="display: none;">
                            <div class="drawer-section-header">
                                <h4><span class="material-symbols-rounded">toc</span> Capítulos do Livro</h4>
                            </div>
                            <div id="outline-list" class="outline-list"></div>
                            <hr class="drawer-divider" style="margin-top: 14px;">
                        </section>

                        <section class="drawer-section">
                            <div class="drawer-section-header">
                                <h4><span class="material-symbols-rounded">bookmarks</span> Páginas Marcadas</h4>
                                <button class="cute-btn btn-xs" id="btn-drawer-bookmark-current">
                                    + Marcar pág. atual
                                </button>
                            </div>
                            <div id="bookmarks-list" class="bookmarks-chip-list"></div>
                        </section>

                        <hr class="drawer-divider">

                        <section class="drawer-section">
                            <div class="drawer-section-header">
                                <h4><span class="material-symbols-rounded">edit_note</span> Anotações deste Livro</h4>
                                <button class="cute-btn btn-xs" id="btn-export-notes" title="Baixar anotações em arquivo Markdown (.md)">
                                    <span class="material-symbols-rounded">download</span> Exportar .md
                                </button>
                            </div>

                            <form id="note-form" class="note-form">
                                <textarea 
                                    id="note-input" 
                                    rows="3" 
                                    placeholder="Escreva um resumo, insight ou dúvida sobre esta página..."
                                ></textarea>
                                <button type="submit" class="cute-btn btn-save-note">
                                    <span class="material-symbols-rounded">add_comment</span>
                                    Salvar Nota na Página Atual
                                </button>
                            </form>

                            <div id="notes-list" class="notes-list"></div>
                        </section>
                    </div>
                </aside>
            </div>

            ${ReaderFooter()}
        </div>
    `;
}