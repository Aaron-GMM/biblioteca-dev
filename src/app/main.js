import Layout from '../components/Layout.js';
import HomePage from '../pages/HomePage.js';
import { CatalogPage, ShelfPage } from '../pages/CategoryPage.js';
import ReaderPage from '../pages/ReaderPage.js';
import NotFound from '../pages/NotFound.js';
import { router } from './router.js';
import { debounce } from '../utils/debounce.js';
import {
    loadCatalog,
    getAllBooks,
    getBookByPath,
    getCategoriesWithCount,
    getBeginnerBooks,
    getRecentReadingBooks,
    getSavedShelfBooks,
    getStudyTrailsWithBooks,
    filterBooks
} from '../services/catalogService.js';
import {
    getBookUrl,
    getBookCandidateUrls,
    isBookSaved,
    isBookCompleted,
    toggleBookSaved,
    getSavedBookPaths,
    getBookmarks,
    getReaderTheme
} from '../services/storageService.js';
import { clearProgress } from '../reader/progressTracker.js';
import { initPdfViewer, cleanupPdfViewer } from '../reader/pdfViewer.js';

let mainContent;
let currentCategory = '';
let currentLevel = 'all';
let currentSearchQuery = '';
let currentSortBy = 'title';
let catalogVisibleLimit = 24;
let activeTrailId = 'primeiros-passos';
let activeShelfTab = 'reading';

function showToast(message, icon = 'check_circle') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<span class="material-symbols-rounded">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 250);
    }, 2400);
}

function updateShelfBadge() {
    const badge = document.getElementById('shelf-count-badge');
    if (!badge) return;
    const count = getSavedBookPaths().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? '' : 'none';
}

function setActiveNavLink(routeHash) {
    document.querySelectorAll('.nav-item').forEach(link => {
        const target = link.getAttribute('data-route');
        link.classList.toggle('active', target === routeHash);
    });

    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.style.display = routeHash === '#reader' ? 'none' : '';
    }
    if (mainContent) {
        mainContent.classList.toggle('reader-mode-container', routeHash === '#reader');
    }
}

async function initApp() {
    const root = document.getElementById('app-root');
    root.innerHTML = Layout();
    mainContent = document.getElementById('main-content');

    setupModalListeners();
    window.addEventListener('shelf-updated', (e) => {
        updateShelfBadge();
        const msg = e.detail?.message;
        const saved = e.detail?.saved;
        if (msg) {
            showToast(msg, 'task_alt');
        } else {
            showToast(saved ? 'Livro salvo na Minha Estante!' : 'Removido da Minha Estante', saved ? 'bookmark_added' : 'bookmark_remove');
        }
    });

    try {
        await loadCatalog();

        const routes = {
            '#home': () => {
                cleanupPdfViewer();
                setActiveNavLink('#home');
                renderHome();
            },
            '#catalog': () => {
                cleanupPdfViewer();
                setActiveNavLink('#catalog');
                renderCatalog();
            },
            '#categories': () => {
                cleanupPdfViewer();
                setActiveNavLink('#catalog');
                renderCatalog();
            },
            '#shelf': () => {
                cleanupPdfViewer();
                setActiveNavLink('#shelf');
                renderShelfPage();
            },
            '#reader': (params) => {
                setActiveNavLink('#reader');
                renderReader(params.get('book'), params.get('source'), params.get('repo'));
            },
            '#404': () => {
                cleanupPdfViewer();
                setActiveNavLink('');
                mainContent.innerHTML = NotFound();
            }
        };

        router.init(routes);
        setupSearch();
    } catch (error) {
        mainContent.innerHTML = `
            <div class="empty-state-box">
                <span class="material-symbols-rounded">error</span>
                <h2>Erro ao carregar catálogo</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function setupModalListeners() {
    const modal = document.getElementById('pix-modal');
    const btnPix = document.getElementById('btn-pix');
    const spanClose = document.querySelector('.close-modal');
    const btnCopyPix = document.getElementById('btn-copy-pix');

    if (btnPix && modal) btnPix.onclick = () => { modal.style.display = 'flex'; };
    if (spanClose && modal) spanClose.onclick = () => { modal.style.display = 'none'; };
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });

    if (btnCopyPix) {
        btnCopyPix.addEventListener('click', () => {
            navigator.clipboard.writeText(
                '00020126450014br.gov.bcb.pix0123aarongibran13@gmail.com5204000053039865802BR5925Aaron Gibran Moreira Mont6009Sao Paulo62290525REC69D017C62AB626941837576304E729'
            );
            showToast('Código PIX copiado!', 'content_copy');
        });
    }

    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', () => {
            resetCatalogFilters();
        });
    }
}

function resetCatalogFilters() {
    currentCategory = '';
    currentLevel = 'all';
    currentSearchQuery = '';
    catalogVisibleLimit = 24;
    const searchInput = document.getElementById('search-input');
    const btnClear = document.getElementById('btn-clear-search');
    if (searchInput) searchInput.value = '';
    if (btnClear) btnClear.style.display = 'none';
}

function renderHome() {
    const allBooks = getAllBooks();
    const recentBooks = getRecentReadingBooks(4);
    const studyTrails = getStudyTrailsWithBooks();

    mainContent.innerHTML = HomePage({
        recentBooks,
        studyTrails,
        activeTrailId,
        totalCatalogCount: allBooks.length
    });

    setupCardAndShelfListeners(() => renderHome());

    const btnStart = document.getElementById('btn-start-beginner');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            const pool = getBeginnerBooks(16);
            if (pool.length > 0) {
                const randomBook = pool[Math.floor(Math.random() * pool.length)];
                router.navigate(`#reader?book=${encodeURIComponent(randomBook.path)}&source=${randomBook.source}&repo=${randomBook.repo}`);
            }
        });
    }

    document.querySelectorAll('.trail-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTrailId = btn.getAttribute('data-trail-id');
            renderHome();
        });
    });

    document.querySelectorAll('[data-remove-history]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const path = btn.getAttribute('data-remove-history');
            clearProgress(path);
            showToast('Removido do histórico', 'delete');
            renderHome();
        });
    });
}

function renderCatalog() {
    const allBooks = getAllBooks();
    const categories = getCategoriesWithCount();

    const isShowingOverview = currentCategory === '' && currentLevel === 'all' && currentSearchQuery === '';
    const booksToRender = isShowingOverview
        ? []
        : filterBooks({
            category: currentCategory,
            level: currentLevel,
            searchQuery: currentSearchQuery,
            sortBy: currentSortBy
        });

    mainContent.innerHTML = CatalogPage({
        booksToRender,
        categories,
        currentCategory,
        currentLevel,
        searchQuery: currentSearchQuery,
        sortBy: currentSortBy,
        visibleLimit: catalogVisibleLimit,
        totalBooks: allBooks.length
    });

    setupCardAndShelfListeners(() => renderCatalog());
    setupCatalogFilterListeners();
    setupCarouselListeners();
}

function setupCatalogFilterListeners() {
    mainContent.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.getAttribute('data-category');
            currentCategory = (currentCategory === selected && selected !== 'Todas') ? '' : selected;
            catalogVisibleLimit = 24;
            renderCatalog();
        });
    });

    mainContent.querySelectorAll('.level-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const level = pill.getAttribute('data-level');
            currentLevel = level;
            catalogVisibleLimit = 24;
            if (currentCategory === '' && level !== 'all') {
                currentCategory = 'Todas';
            }
            renderCatalog();
        });
    });

    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortBy = e.target.value;
            renderCatalog();
        });
    }

    document.getElementById('btn-load-more-books')?.addEventListener('click', () => {
        catalogVisibleLimit += 24;
        renderCatalog();
    });

    document.getElementById('btn-reset-catalog-filters')?.addEventListener('click', () => {
        resetCatalogFilters();
        renderCatalog();
    });
}

function renderShelfPage() {
    const readingBooks = getRecentReadingBooks(20);
    const savedBooks = getSavedShelfBooks('saved');
    const completedBooks = getSavedShelfBooks('completed');

    // Se o usuário não tem livros em "Lendo Agora", mas tem em "Quero Ler", foca automaticamente em "Quero Ler" na primeira vez
    if (activeShelfTab === 'reading' && readingBooks.length === 0 && savedBooks.length > 0) {
        activeShelfTab = 'saved';
    }

    mainContent.innerHTML = ShelfPage({
        readingBooks,
        savedBooks,
        completedBooks,
        activeShelfTab
    });

    setupCardAndShelfListeners(() => renderShelfPage());

    mainContent.querySelectorAll('[data-shelf-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            activeShelfTab = btn.getAttribute('data-shelf-tab');
            renderShelfPage();
        });
    });
}

function setupCarouselListeners() {
    const nav = document.getElementById('category-nav');
    const btnLeft = document.getElementById('btn-scroll-left');
    const btnRight = document.getElementById('btn-scroll-right');

    if (!nav || !btnLeft || !btnRight) return;

    btnLeft.addEventListener('click', () => nav.scrollBy({ left: -280, behavior: 'smooth' }));
    btnRight.addEventListener('click', () => nav.scrollBy({ left: 280, behavior: 'smooth' }));
}

function renderReader(bookPath, source, repo) {
    if (!bookPath) {
        router.navigate('#home');
        return;
    }

    const finalUrl = getBookUrl(bookPath, source, repo);

    if (source === 'external_url' && !bookPath.includes('github.com')) {
        mainContent.innerHTML = `
            <div class="empty-state-box" style="margin-top: 4rem;">
                <span class="material-symbols-rounded">open_in_new</span>
                <h2>Aviso de Material Externo</h2>
                <p>Este material está hospedado fora do repositório da biblioteca.</p>
                <a href="${finalUrl}" target="_blank" rel="noopener" class="cute-btn" style="display:inline-flex; margin-top:1rem; text-decoration: none;">
                    Acessar Material Externo
                </a>
                <br>
                <button class="cute-btn" style="margin: 1rem auto 0;" onclick="window.history.back()">Voltar ao Acervo</button>
            </div>
        `;
        return;
    }

    const catalogBook = getBookByPath(bookPath);
    const bookTitleDisplay = catalogBook
        ? catalogBook.title
        : decodeURIComponent(bookPath.split('/').pop().replace('.pdf', ''));
    const bookAuthorDisplay = catalogBook ? catalogBook.author : '';
    const bookCategoryDisplay = catalogBook ? catalogBook.category : '';

    const saved = isBookSaved(bookPath);
    const completed = isBookCompleted(bookPath);
    const bookmarks = getBookmarks(bookPath);
    const currentTheme = getReaderTheme();

    mainContent.innerHTML = ReaderPage({
        bookTitle: bookTitleDisplay,
        bookAuthor: bookAuthorDisplay,
        bookCategory: bookCategoryDisplay,
        isSaved: saved,
        isCompleted: completed,
        isBookmarked: bookmarks.includes(1),
        currentTheme
    });

    const candidateUrls = getBookCandidateUrls(bookPath, source, repo);
    initPdfViewer(candidateUrls, bookPath, bookTitleDisplay);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const btnClear = document.getElementById('btn-clear-search');
    if (!searchInput) return;

    const handleSearch = () => {
        currentSearchQuery = searchInput.value.trim();
        catalogVisibleLimit = 24;
        if (btnClear) {
            btnClear.style.display = currentSearchQuery ? 'flex' : 'none';
        }

        if (currentSearchQuery !== '') {
            if (window.location.hash !== '#catalog') {
                router.navigate('#catalog');
            } else {
                renderCatalog();
            }
        } else if (window.location.hash === '#catalog') {
            renderCatalog();
        }
    };

    searchInput.addEventListener('input', debounce(handleSearch, 250));

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchQuery = '';
            btnClear.style.display = 'none';
            if (window.location.hash === '#catalog') {
                renderCatalog();
            }
            searchInput.focus();
        });
    }
}

function setupCardAndShelfListeners(onShelfChangeCallback) {
    document.querySelectorAll('[data-shelf-path]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const path = btn.getAttribute('data-shelf-path');
            const nowSaved = toggleBookSaved(path);
            btn.classList.toggle('is-saved', nowSaved);
            const icon = btn.querySelector('.material-symbols-rounded');
            if (icon) icon.textContent = nowSaved ? 'bookmark_added' : 'bookmark_add';
            updateShelfBadge();
            showToast(nowSaved ? 'Salvo na Minha Estante!' : 'Removido da Minha Estante', nowSaved ? 'bookmark_added' : 'bookmark_remove');

            if (window.location.hash === '#shelf' && onShelfChangeCallback) {
                onShelfChangeCallback();
            }
        });
    });

    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const path = card.getAttribute('data-path');
            const source = card.getAttribute('data-source');
            const repo = card.getAttribute('data-repo') || 'BibliotecaDev';

            router.navigate(`#reader?book=${encodeURIComponent(path)}&source=${source}&repo=${repo}`);
        });
    });
}

document.addEventListener('DOMContentLoaded', initApp);