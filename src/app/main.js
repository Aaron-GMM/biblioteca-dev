import Layout from '../components/Layout.js';
import HomePage from '../pages/HomePage.js';
import { router } from './router.js';
import { getBookUrl } from '../services/storageService.js';
import { normalizeText } from '../utils/normalizeText.js';
import { debounce } from '../utils/debounce.js';
import ReaderPage from '../pages/ReaderPage.js';
import { initPdfViewer } from '../reader/pdfViewer.js';

let globalBooks = [];
let mainContent;
let currentCategory = '';

async function initApp() {
    const root = document.getElementById('app-root');
    root.innerHTML = Layout();
    mainContent = document.getElementById('main-content');
    const modal = document.getElementById('pix-modal');
    const btnPix = document.getElementById('btn-pix');
    const spanClose = document.querySelector('.close-modal');

    if (btnPix) btnPix.onclick = () => modal.style.display = "flex";
    if (spanClose) spanClose.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

        try {
        const response = await fetch('../catalog/books.json?nocache=' + new Date().getTime());
        if (!response.ok) throw new Error('Falha ao carregar o catálogo');

        const rawData = await response.json();
        
        
        // ========================================================
        // 🔥 NOVA LÓGICA: Achatar o JSON organizado por repositórios
        // ========================================================
       globalBooks = [];
        
        rawData.forEach(repoObj => {
            let repoName = repoObj["Repositoy-Name"] || repoObj["Repository-Name"] || "BibliotecaDev";
            
            // 🔥 CORREÇÃO CRÍTICA AQUI:
            // "LivrosDev" é o nome da pasta. O repositório real é "BibliotecaDev".
            // Isso impede o Erro 404 de "Missing PDF".
            if (repoName === "LivrosDev") {
                repoName = "BibliotecaDev";
            }
            
            if (repoObj.livros && Array.isArray(repoObj.livros)) {
                repoObj.livros.forEach(book => {
                    book.repo = repoName;
                    
                    // Garante que o sistema saiba que é do GitHub, impedindo a tela de "Aviso Externo"
                    if (book.path && !book.path.startsWith('http')) {
                        book.source = 'github_repo';
                    }

                    globalBooks.push(book);
                });
            }
        });
        // ========================================================

        const routes = {
            '#home': () => {
                currentCategory = '';
                document.getElementById('search-input').value = '';
                renderHome();
            },
            '#reader': (params) => renderReader(params.get('book'), params.get('source'), params.get('repo')),
            '#404': () => { mainContent.innerHTML = '<h2>Página não encontrada</h2>'; }
        };

        router.init(routes);
        setupSearch();

    } catch (error) {
        mainContent.innerHTML = `<div style="text-align:center; padding: 50px;"><h2>Erro ao carregar catálogo</h2><p>${error.message}</p></div>`;
        console.error("Erro no initApp:", error);
    }
}

// Substitua APENAS a função renderHome inteira por esta:
function renderHome(filteredSearchBooks = null) {
    const categoriasValidas = globalBooks.map(b => b.category).filter(c => c);
    const categories = [...new Set(categoriasValidas)].sort();

    // Filtra livros para a trilha de iniciantes
    const beginnerBooks = globalBooks.filter(b => b.level === 'beginner').slice(0, 4); // Pega os 4 primeiros

    let booksToRender = [];
    let isInitialState = false;

    if (filteredSearchBooks !== null) {
        booksToRender = filteredSearchBooks;
        currentCategory = 'Busca';
    } else if (currentCategory === '') {
        isInitialState = true;
        booksToRender = [];
    } else {
        booksToRender = globalBooks.filter(b => b.category === currentCategory);
    }

    const recentBooks = getRecentHistory();

    // Altere a chamada do HomePage para enviar o histórico:
    mainContent.innerHTML = HomePage(booksToRender, categories, currentCategory, isInitialState, beginnerBooks, recentBooks);

    setupCardListeners();
    setupCategoryListeners();
    setupCarouselListeners();

    // Listener do botão gigante "Começar"
    const btnStart = document.getElementById('btn-start-beginner');
    if (btnStart && beginnerBooks.length > 0) {
        btnStart.addEventListener('click', () => {
            // Sorteia um livro iniciante e abre o leitor!
            const randomBook = beginnerBooks[Math.floor(Math.random() * beginnerBooks.length)];
            router.navigate(`#reader?book=${encodeURIComponent(randomBook.path)}&source=${randomBook.source}&repo=${randomBook.repo}`);
        });
    }
}

function setupCategoryListeners() {
    const btns = document.querySelectorAll('.category-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            document.getElementById('search-input').value = '';
            renderHome();
        });
    });
}
// Nova função: Vasculha o navegador procurando livros com progresso salvo
function getRecentHistory() {
    const history = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data && data.page && data.timestamp) {
                // Procura as informações visuais deste livro no JSON global
                const bookInfo = globalBooks.find(b => b.path === key);
                if (bookInfo) {
                    history.push({ ...bookInfo, progress: data });
                }
            }
        } catch (e) { } // Ignora chaves do localStorage que não sejam do nosso leitor
    }
    // Ordena do mais recente para o mais antigo e pega só os últimos 4
    return history.sort((a, b) => b.progress.timestamp - a.progress.timestamp).slice(0, 4);
}
function setupCarouselListeners() {
    const nav = document.getElementById('category-nav');
    const btnLeft = document.getElementById('btn-scroll-left');
    const btnRight = document.getElementById('btn-scroll-right');

    if (!nav || !btnLeft || !btnRight) return;

    btnLeft.addEventListener('click', () => nav.scrollBy({ left: -250, behavior: 'smooth' }));
    btnRight.addEventListener('click', () => nav.scrollBy({ left: 250, behavior: 'smooth' }));
}

function renderReader(bookPath, source, repo) {
    const finalUrl = getBookUrl(bookPath, source, repo);

    if (source === 'external_url') {
        mainContent.innerHTML = `
            <div style="text-align: center; margin-top: 4rem;">
                <h2>Aviso de Link Externo</h2>
                <p>Este material está hospedado fora da biblioteca.</p>
                <a href="${finalUrl}" target="_blank" style="display:inline-block; margin-top:1rem; padding: 0.5rem 1rem; background: var(--accent); color: #000; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar Material Externo</a>
                <br><br>
                <button class="cute-btn" style="margin: 2rem auto;" onclick="window.history.back()">Voltar ao Acervo</button>
            </div>
        `;
        return;
    }

    const bookTitleDisplay = decodeURIComponent(bookPath.split('/').pop().replace('.pdf', ''));
    mainContent.innerHTML = ReaderPage(bookTitleDisplay);
    initPdfViewer(finalUrl, bookPath);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const handleSearch = () => {
        const query = normalizeText(searchInput.value);

        if (query === '') {
            currentCategory = '';
            renderHome();
            return;
        }

        const filteredBooks = globalBooks.filter(b => {
            return normalizeText(b.title || '').includes(query) ||
                normalizeText(b.author || '').includes(query) ||
                normalizeText(b.category || '').includes(query);
        });

        if (window.location.hash !== '#home' && window.location.hash !== '') {
            router.navigate('#home');
        }

        renderHome(filteredBooks);
    };

    searchInput.addEventListener('input', debounce(handleSearch, 300));
}

function setupCardListeners() {
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const path = card.getAttribute('data-path');
            const source = card.getAttribute('data-source');
            const repo = card.getAttribute('data-repo') || 'BibliotecaDev';

            router.navigate(`#reader?book=${encodeURIComponent(path)}&source=${source}&repo=${repo}`);
        });
    });
}

document.addEventListener('DOMContentLoaded', initApp);