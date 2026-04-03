import BookCard from '../components/BookCard.js';

export default function HomePage(booksToRender, allCategories = [], currentCategory = '', isInitialState = false, beginnerBooks = [], recentBooks = []) {
    const cardsHtml = booksToRender.map(book => BookCard(book)).join('');
    const beginnerCardsHtml = beginnerBooks.map(book => BookCard(book)).join('');

    const categoryPills = allCategories.map(cat => `
        <button class="category-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join('');

    // ✅ NOVO AVISO: Amigável, simples e com cara de sistema corporativo
    const friendlyNotice = `
        <div class="friendly-notice">
            <span class="material-symbols-rounded">info</span>
            <div>
                <strong>Aviso do Sistema</strong><br>
                Esta biblioteca é um projeto de código aberto =).<br> A leitura ocorre diretamente no seu navegador, sem intermediários.
                <strong>Boa leitura! ☕</strong>
            </div>
        </div>
    `;

    const historyHtml = recentBooks.map(book => `
        <div class="book-card history-card" data-path="${book.path}" data-source="${book.source}" data-repo="${book.repo}">
            <h3 class="book-title" style="font-size: 0.95rem;">${book.title}</h3>
            <p class="book-author" style="font-size: 0.75rem; margin-bottom: 8px;">Página ${book.progress.page}</p>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: 100%;"></div>
            </div>
            <span class="resume-badge">Continuar Lendo</span>
        </div>
    `).join('');

    const historySection = recentBooks.length > 0 ? `
        <div class="special-section history-section">
            <h2 class="section-title"><span class="material-symbols-rounded">history</span> Continue Lendo</h2>
            <div class="catalog-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                ${historyHtml}
            </div>
        </div>
    ` : '';

    let contentArea = '';
    
    if (isInitialState) {
        contentArea = `
            ${beginnerBooks.length > 0 ? `
                <div class="special-section">
                    <h2 class="section-title"><span class="material-symbols-rounded">rocket_launch</span> Primeiros Passos</h2>
                    <p class="section-subtitle">Livros fundamentais selecionados para quem está começando agora.</p>
                    <section class="catalog-grid">${beginnerCardsHtml}</section>
                </div>
                <hr class="section-divider">
            ` : ''}
            <div class="select-category-prompt">
                <span class="material-symbols-rounded">library_books</span>
                <h3>Explore o Acervo</h3>
                <p>Escolha um dos temas acima para carregar mais livros.</p>
            </div>
        `;
    } else if (booksToRender.length === 0) {
        contentArea = `<h3 style="text-align:center; margin-top: 3rem; color: var(--text-muted);">Nenhum resultado encontrado.</h3>`;
    } else {
        contentArea = `<section class="catalog-grid">${cardsHtml}</section>`;
    }

    // Trocamos o ${hackerBanner} pelo ${friendlyNotice}
    return `
        ${friendlyNotice}
        ${historySection}
        <section class="hero" style="margin-bottom: 2rem;">
            <h1>Sua biblioteca técnica.</h1>
            <p>Leia livros de programação online, sem baixar nada.</p>
            <button class="cute-btn btn-start-huge" id="btn-start-beginner">
                <span class="material-symbols-rounded">play_circle</span>
                Começar a Estudar
            </button>
        </section>
        
        <div class="category-carousel-wrapper">
            <button class="carousel-btn" id="btn-scroll-left"><span class="material-symbols-rounded">chevron_left</span></button>
            <nav class="category-nav" id="category-nav">${categoryPills}</nav>
            <button class="carousel-btn" id="btn-scroll-right"><span class="material-symbols-rounded">chevron_right</span></button>
        </div>
        
        ${contentArea}
    `;
}