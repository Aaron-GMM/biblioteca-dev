import { getProgress, saveProgress } from './progressTracker.js';
import { renderPdfPageToCanvas, calculateFitWidthScale, calculateFitPageScale } from './pageRenderer.js';
import { getCachedPage, preloadAdjacentPages, clearPageCache } from './lazyLoader.js';
import {
    getBookmarks,
    toggleBookmark,
    getBookNotes,
    addBookNote,
    deleteBookNote,
    toggleBookSaved,
    toggleBookCompleted,
    setReaderTheme
} from '../services/storageService.js';

let pdfDoc = null;
let pageNum = 1;
let scale = 1.25;
let bookIdRef = '';
let bookTitleRef = '';
let canvas, ctx;
let isRendering = false;
let pageNumPending = null;

let controlsTimeout;
const HIDE_DELAY = 1800;

let activeKeydownHandler = null;
let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60;
let pomodoroRunning = false;

export function cleanupPdfViewer() {
    if (activeKeydownHandler) {
        window.removeEventListener('keydown', activeKeydownHandler);
        activeKeydownHandler = null;
    }
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
    pomodoroRunning = false;
    clearTimeout(controlsTimeout);
    clearPageCache();
    pdfDoc = null;
}

async function loadDocumentWithFallback(candidateUrls) {
    let lastError = null;
    for (const url of candidateUrls) {
        try {
            const doc = await pdfjsLib.getDocument(url).promise;
            return doc;
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError || new Error('Não foi possível carregar o PDF.');
}

export async function initPdfViewer(candidateUrls, bookId, bookTitle = 'Livro') {
    cleanupPdfViewer();

    const urls = Array.isArray(candidateUrls) ? candidateUrls : [candidateUrls];
    bookIdRef = bookId;
    bookTitleRef = bookTitle;

    const progress = getProgress(bookId);
    pageNum = progress.page || 1;
    scale = progress.zoom || 1.25;

    canvas = document.getElementById('pdf-render');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    setupReaderEvents();
    setupStudyDrawerEvents();
    setupPomodoroEvents();
    updateZoomIndicator();

    try {
        pdfDoc = await loadDocumentWithFallback(urls);
        const total = pdfDoc.numPages;

        if (pageNum > total) pageNum = 1;

        const pageCountEl = document.getElementById('page-count');
        const pageSlider = document.getElementById('page-slider');
        const pageInput = document.getElementById('page-num-input');
        const loader = document.getElementById('loading-indicator');

        if (pageCountEl) pageCountEl.textContent = total;
        if (pageSlider) {
            pageSlider.max = total;
            pageSlider.value = pageNum;
        }
        if (pageInput) {
            pageInput.max = total;
            pageInput.value = pageNum;
        }
        if (loader) loader.style.display = 'none';

        await renderPage(pageNum);
        renderDrawerContent();
        loadPdfOutline();
        resetControlsTimer();
    } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.innerHTML = `
                <span class="material-symbols-rounded" style="font-size: 3rem; color: #e57373;">error</span>
                <p style="color: #e0e0e0; font-weight: 600;">Não foi possível carregar este PDF agora.</p>
                <span class="loader-sub">Verifique sua conexão ou tente abrir o arquivo diretamente no repositório.</span>
                <a href="${urls[0]}" target="_blank" rel="noopener" class="cute-btn" style="margin-top: 10px; text-decoration: none;">
                    Abrir link direto do PDF
                </a>
            `;
        }
    }
}

async function loadPdfOutline() {
    if (!pdfDoc) return;
    try {
        const outline = await pdfDoc.getOutline();
        const section = document.getElementById('outline-section');
        const listEl = document.getElementById('outline-list');
        if (!outline || outline.length === 0 || !section || !listEl) return;

        section.style.display = 'block';
        const items = outline.slice(0, 40);

        listEl.innerHTML = items.map((item, idx) => `
            <button type="button" class="outline-item-btn" data-outline-idx="${idx}">
                <span class="material-symbols-rounded">chevron_right</span>
                <span>${(item.title || 'Capítulo').replace(/</g, '&lt;')}</span>
            </button>
        `).join('');

        listEl.querySelectorAll('[data-outline-idx]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.getAttribute('data-outline-idx'), 10);
                const item = items[idx];
                if (!item || !item.dest) return;
                try {
                    const dest = typeof item.dest === 'string'
                        ? await pdfDoc.getDestination(item.dest)
                        : item.dest;
                    if (dest && dest[0]) {
                        const pageIndex = await pdfDoc.getPageIndex(dest[0]);
                        pageNum = pageIndex + 1;
                        queueRenderPage(pageNum);
                    }
                } catch (e) {
                    // Ignora caso o destino não seja resolvível
                }
            });
        });
    } catch (e) {
        // Ignora caso o PDF não tenha sumário
    }
}

function setupReaderEvents() {
    document.getElementById('btn-prev')?.addEventListener('click', onPrevPage);
    document.getElementById('btn-next')?.addEventListener('click', onNextPage);
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => changeZoom(0.2));
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => changeZoom(-0.2));
    document.getElementById('btn-fit-page')?.addEventListener('click', onFitPage);
    document.getElementById('btn-fit-width')?.addEventListener('click', onFitWidth);
    document.getElementById('btn-close')?.addEventListener('click', () => {
        cleanupPdfViewer();
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.hash = '#home';
        }
    });
    document.getElementById('btn-fullscreen')?.addEventListener('click', toggleFullscreen);

    const pageInput = document.getElementById('page-num-input');
    if (pageInput) {
        pageInput.addEventListener('change', (e) => {
            if (!pdfDoc) return;
            const target = Math.min(pdfDoc.numPages, Math.max(1, parseInt(e.target.value, 10) || 1));
            pageNum = target;
            queueRenderPage(pageNum);
        });
    }

    const pageSlider = document.getElementById('page-slider');
    if (pageSlider) {
        pageSlider.addEventListener('input', (e) => {
            if (pageInput) pageInput.value = e.target.value;
        });
        pageSlider.addEventListener('change', (e) => {
            if (!pdfDoc) return;
            const target = Math.min(pdfDoc.numPages, Math.max(1, parseInt(e.target.value, 10) || 1));
            pageNum = target;
            queueRenderPage(pageNum);
        });
    }

    const themeBtns = document.querySelectorAll('[data-pdf-theme]');
    themeBtns.forEach(btn => {
        if (btn.tagName !== 'BUTTON') return;
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-pdf-theme');
            const wrapper = document.getElementById('reader-container');
            if (wrapper) wrapper.setAttribute('data-pdf-theme', theme);
            setReaderTheme(theme);

            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const btnShelf = document.getElementById('btn-reader-shelf');
    if (btnShelf) {
        btnShelf.addEventListener('click', () => {
            const nowSaved = toggleBookSaved(bookIdRef);
            btnShelf.classList.toggle('active-accent', nowSaved);
            const icon = btnShelf.querySelector('.material-symbols-rounded');
            if (icon) icon.textContent = nowSaved ? 'library_add_check' : 'library_add';
            window.dispatchEvent(new CustomEvent('shelf-updated', { detail: { saved: nowSaved } }));
        });
    }

    const btnComplete = document.getElementById('btn-reader-complete');
    if (btnComplete) {
        btnComplete.addEventListener('click', () => {
            const nowCompleted = toggleBookCompleted(bookIdRef);
            btnComplete.classList.toggle('active-accent', nowCompleted);
            if (btnShelf) {
                btnShelf.classList.add('active-accent');
                const icon = btnShelf.querySelector('.material-symbols-rounded');
                if (icon) icon.textContent = 'library_add_check';
            }
            window.dispatchEvent(new CustomEvent('shelf-updated', {
                detail: {
                    saved: true,
                    message: nowCompleted ? 'Parabéns! Livro marcado como Concluído!' : 'Movido de volta para Quero Ler'
                }
            }));
        });
    }

    const btnBookmark = document.getElementById('btn-bookmark-page');
    if (btnBookmark) {
        btnBookmark.addEventListener('click', () => {
            handleToggleBookmarkCurrentPage();
        });
    }

    const readerWrapper = document.getElementById('reader-container');
    if (readerWrapper) {
        readerWrapper.addEventListener('mousemove', resetControlsTimer);
        readerWrapper.addEventListener('touchstart', resetControlsTimer);
    }

    activeKeydownHandler = (e) => {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onPrevPage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onNextPage();
        } else if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            changeZoom(0.2);
        } else if (e.key === '-') {
            e.preventDefault();
            changeZoom(-0.2);
        } else if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            toggleFullscreen();
        } else if (e.key.toLowerCase() === 'b') {
            e.preventDefault();
            handleToggleBookmarkCurrentPage();
        } else if (e.key.toLowerCase() === 'n') {
            e.preventDefault();
            toggleDrawer();
        }
    };
    window.addEventListener('keydown', activeKeydownHandler);
}

function handleToggleBookmarkCurrentPage() {
    const { isBookmarked } = toggleBookmark(bookIdRef, pageNum);
    updateBookmarkButtonUI(isBookmarked);
    renderDrawerContent();
}

function updateBookmarkButtonUI(isBookmarked) {
    const btn = document.getElementById('btn-bookmark-page');
    if (!btn) return;
    btn.classList.toggle('active-accent', isBookmarked);
    const icon = btn.querySelector('.material-symbols-rounded');
    if (icon) icon.textContent = isBookmarked ? 'bookmark_added' : 'bookmark';
}

function toggleDrawer() {
    const drawer = document.getElementById('reader-drawer');
    if (!drawer) return;
    const isOpen = drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', String(!isOpen));
}

function setupStudyDrawerEvents() {
    document.getElementById('btn-toggle-drawer')?.addEventListener('click', toggleDrawer);
    document.getElementById('btn-close-drawer')?.addEventListener('click', toggleDrawer);

    document.getElementById('btn-drawer-bookmark-current')?.addEventListener('click', () => {
        handleToggleBookmarkCurrentPage();
    });

    const noteForm = document.getElementById('note-form');
    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('note-input');
            if (!input || !input.value.trim()) return;
            addBookNote(bookIdRef, pageNum, input.value);
            input.value = '';
            renderDrawerContent();
        });
    }

    document.getElementById('btn-export-notes')?.addEventListener('click', exportNotesAsMarkdown);
}

function renderDrawerContent() {
    const bookmarksEl = document.getElementById('bookmarks-list');
    const notesEl = document.getElementById('notes-list');
    const bookmarks = getBookmarks(bookIdRef);
    const notes = getBookNotes(bookIdRef);

    updateBookmarkButtonUI(bookmarks.includes(pageNum));

    if (bookmarksEl) {
        if (bookmarks.length === 0) {
            bookmarksEl.innerHTML = `<p class="drawer-empty">Nenhuma página marcada ainda.</p>`;
        } else {
            bookmarksEl.innerHTML = bookmarks.map(p => `
                <button type="button" class="bookmark-chip ${p === pageNum ? 'current' : ''}" data-goto-page="${p}">
                    <span class="material-symbols-rounded">bookmark</span> Pág. ${p}
                </button>
            `).join('');

            bookmarksEl.querySelectorAll('[data-goto-page]').forEach(chip => {
                chip.addEventListener('click', () => {
                    const target = parseInt(chip.getAttribute('data-goto-page'), 10);
                    if (target) {
                        pageNum = target;
                        queueRenderPage(pageNum);
                    }
                });
            });
        }
    }

    if (notesEl) {
        if (notes.length === 0) {
            notesEl.innerHTML = `<p class="drawer-empty">Suas anotações deste livro aparecerão aqui.</p>`;
        } else {
            notesEl.innerHTML = notes.map(n => `
                <div class="note-card">
                    <div class="note-card-header">
                        <button type="button" class="note-page-badge" data-goto-page="${n.page}">
                            Ir para Pág. ${n.page}
                        </button>
                        <button type="button" class="note-delete-btn" data-delete-note="${n.id}" title="Excluir nota">
                            <span class="material-symbols-rounded">delete</span>
                        </button>
                    </div>
                    <p class="note-card-text">${n.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                </div>
            `).join('');

            notesEl.querySelectorAll('[data-goto-page]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const target = parseInt(btn.getAttribute('data-goto-page'), 10);
                    if (target) {
                        pageNum = target;
                        queueRenderPage(pageNum);
                    }
                });
            });

            notesEl.querySelectorAll('[data-delete-note]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-delete-note');
                    deleteBookNote(bookIdRef, id);
                    renderDrawerContent();
                });
            });
        }
    }
}

function exportNotesAsMarkdown() {
    const notes = getBookNotes(bookIdRef);
    const bookmarks = getBookmarks(bookIdRef);

    let md = `# 📚 Caderno de Estudos: ${bookTitleRef}\n\n`;
    md += `- **Gerado em:** ${new Date().toLocaleDateString('pt-BR')}\n`;
    md += `- **Páginas Marcadas:** ${bookmarks.length > 0 ? bookmarks.map(p => `Pág. ${p}`).join(', ') : 'Nenhuma'}\n\n`;
    md += `## 📝 Anotações\n\n`;

    if (notes.length === 0) {
        md += `_Nenhuma anotação registrada._\n`;
    } else {
        notes.slice().reverse().forEach(n => {
            md += `### Página ${n.page}\n${n.text}\n\n---\n\n`;
        });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notas-${bookTitleRef.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
}

function setupPomodoroEvents() {
    pomodoroSeconds = 25 * 60;
    pomodoroRunning = false;

    const display = document.getElementById('pomodoro-display');
    const btnToggle = document.getElementById('btn-pomodoro-toggle');
    const btnReset = document.getElementById('btn-pomodoro-reset');

    const renderTime = () => {
        if (!display) return;
        const mins = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0');
        const secs = String(pomodoroSeconds % 60).padStart(2, '0');
        display.textContent = `${mins}:${secs}`;
    };

    btnToggle?.addEventListener('click', () => {
        pomodoroRunning = !pomodoroRunning;
        const icon = btnToggle.querySelector('.material-symbols-rounded');
        if (icon) icon.textContent = pomodoroRunning ? 'pause' : 'play_arrow';

        if (pomodoroRunning) {
            pomodoroInterval = setInterval(() => {
                if (pomodoroSeconds > 0) {
                    pomodoroSeconds--;
                    renderTime();
                } else {
                    clearInterval(pomodoroInterval);
                    pomodoroRunning = false;
                    if (icon) icon.textContent = 'play_arrow';
                    pomodoroSeconds = 25 * 60;
                    renderTime();
                }
            }, 1000);
        } else {
            clearInterval(pomodoroInterval);
        }
    });

    btnReset?.addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        pomodoroRunning = false;
        pomodoroSeconds = 25 * 60;
        renderTime();
        const icon = btnToggle?.querySelector('.material-symbols-rounded');
        if (icon) icon.textContent = 'play_arrow';
    });
}

function toggleFullscreen() {
    const elem = document.getElementById('reader-container');
    if (!elem) return;
    const icon = document.getElementById('btn-fullscreen')?.querySelector('span');

    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(() => {});
        if (icon) icon.textContent = 'fullscreen_exit';
    } else {
        document.exitFullscreen();
        if (icon) icon.textContent = 'fullscreen';
    }
}

function resetControlsTimer() {
    const wrapper = document.getElementById('reader-container');
    if (!wrapper) return;

    wrapper.classList.remove('hide-controls');
    clearTimeout(controlsTimeout);

    if (document.fullscreenElement) {
        controlsTimeout = setTimeout(() => {
            wrapper.classList.add('hide-controls');
        }, HIDE_DELAY);
    }
}

function updateZoomIndicator() {
    const el = document.getElementById('zoom-level-indicator');
    if (el) {
        el.textContent = `${Math.round(scale * 100)}%`;
    }
}

async function renderPage(num) {
    if (!pdfDoc) return;
    isRendering = true;

    try {
        const page = await getCachedPage(pdfDoc, num);
        await renderPdfPageToCanvas(page, scale, canvas, ctx);

        const scrollContainer = document.getElementById('reader-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }

        const pageInput = document.getElementById('page-num-input');
        const pageSlider = document.getElementById('page-slider');
        if (pageInput) pageInput.value = num;
        if (pageSlider) pageSlider.value = num;

        saveProgress(bookIdRef, num, scale, pdfDoc.numPages);
        renderDrawerContent();
        preloadAdjacentPages(pdfDoc, num);
    } catch (e) {
        // Ignora cancelamento
    } finally {
        isRendering = false;
        if (pageNumPending !== null) {
            const next = pageNumPending;
            pageNumPending = null;
            renderPage(next);
        }
    }
}

function queueRenderPage(num) {
    if (isRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (!pdfDoc || pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

function changeZoom(delta) {
    const newScale = Number((scale + delta).toFixed(2));
    if (newScale < 0.45 || newScale > 3.0) return;
    scale = newScale;
    updateZoomIndicator();
    queueRenderPage(pageNum);
}

async function onFitWidth() {
    const container = document.getElementById('reader-scroll-container');
    if (!pdfDoc || !container) return;
    scale = await calculateFitWidthScale(pdfDoc, pageNum, container);
    updateZoomIndicator();
    queueRenderPage(pageNum);
}

async function onFitPage() {
    const container = document.getElementById('reader-scroll-container');
    if (!pdfDoc || !container) return;
    scale = await calculateFitPageScale(pdfDoc, pageNum, container);
    updateZoomIndicator();
    queueRenderPage(pageNum);
}