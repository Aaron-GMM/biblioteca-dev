export default function CategoryList(categories = [], currentCategory = '', currentLevel = 'all') {
    const totalBooks = categories.reduce((acc, c) => acc + c.count, 0);

    const allButton = `
        <button class="category-btn ${currentCategory === 'Todas' ? 'active' : ''}" data-category="Todas">
            <span class="material-symbols-rounded">apps</span>
            <span>Todos os Livros</span>
            <span class="cat-count">${totalBooks}</span>
        </button>
    `;

    const categoryPills = categories.map(cat => `
        <button class="category-btn ${cat.name === currentCategory ? 'active' : ''}" data-category="${cat.name}">
            <span class="material-symbols-rounded" style="color: ${cat.name === currentCategory ? 'inherit' : cat.accent};">${cat.icon}</span>
            <span>${cat.name}</span>
            <span class="cat-count">${cat.count}</span>
        </button>
    `).join('');

    return `
        <div class="catalog-filters-bar">
            <div class="category-carousel-wrapper">
                <button class="carousel-btn" id="btn-scroll-left" title="Rolar categorias para a esquerda">
                    <span class="material-symbols-rounded">chevron_left</span>
                </button>
                <nav class="category-nav" id="category-nav">
                    ${allButton}
                    ${categoryPills}
                </nav>
                <button class="carousel-btn" id="btn-scroll-right" title="Rolar categorias para a direita">
                    <span class="material-symbols-rounded">chevron_right</span>
                </button>
            </div>

            <div class="level-filter-row">
                <span class="filter-label"><span class="material-symbols-rounded">tune</span> Filtrar por nível:</span>
                <div class="level-pills">
                    <button class="level-pill ${currentLevel === 'all' ? 'active' : ''}" data-level="all">Todos</button>
                    <button class="level-pill ${currentLevel === 'beginner' ? 'active' : ''}" data-level="beginner">Iniciante</button>
                    <button class="level-pill ${currentLevel === 'intermediary' ? 'active' : ''}" data-level="intermediary">Intermediário</button>
                    <button class="level-pill ${currentLevel === 'advanced' ? 'active' : ''}" data-level="advanced">Avançado</button>
                </div>
            </div>
        </div>
    `;
}
