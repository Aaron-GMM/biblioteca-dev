import BookCard from '../components/BookCard.js';

export default function HomePage(booksToRender, allCategories = [], currentCategory = '', isInitialState = false) {
    const cardsHtml = booksToRender.map(book => BookCard(book)).join('');

    const categoryPills = allCategories.map(cat => `
        <button class="category-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join('');

    let contentArea = '';
    
    if (isInitialState) {
        contentArea = `
            <div style="text-align: center; margin-top: 3rem; padding: 3rem 1rem; background: var(--bg-card); border: 1px dashed var(--border); border-radius: 8px;">
                <span class="material-symbols-rounded" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem; display: block;">library_books</span>
                <h3 style="color: var(--text-main);">Selecione uma categoria</h3>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">Escolha um dos temas acima para carregar os livros do acervo.</p>
            </div>
        `;
    } else if (booksToRender.length === 0) {
        contentArea = `<h3 style="text-align:center; margin-top: 3rem; color: var(--text-muted);">Nenhum resultado encontrado.</h3>`;
    } else {
        contentArea = `
            <section class="catalog-grid">
                ${cardsHtml}
            </section>
        `;
    }

    return `
        <section class="hero" style="margin-bottom: 2rem;">
            <h1>Sua biblioteca técnica.</h1>
            <p>Leia livros de programação online, sem baixar nada.</p>
        </section>
        
        <div class="category-carousel-wrapper">
            <button class="carousel-btn" id="btn-scroll-left" title="Rolar para a esquerda">
                <span class="material-symbols-rounded">chevron_left</span>
            </button>
            
            <nav class="category-nav" id="category-nav">
                ${categoryPills}
            </nav>
            
            <button class="carousel-btn" id="btn-scroll-right" title="Rolar para a direita">
                <span class="material-symbols-rounded">chevron_right</span>
            </button>
        </div>
        
        ${contentArea}
    `;
}