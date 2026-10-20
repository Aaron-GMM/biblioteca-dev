import BookCard from '../components/BookCard.js';
import CategoryList from '../components/CategoryList.js';

export function CatalogPage({
    booksToRender = [],
    categories = [],
    currentCategory = '',
    currentLevel = 'all',
    searchQuery = '',
    sortBy = 'title',
    visibleLimit = 24,
    totalBooks = 0
}) {
    const isShowingOverview = currentCategory === '' && currentLevel === 'all' && searchQuery === '';
    const slicedBooks = booksToRender.slice(0, visibleLimit);
    const remainingCount = Math.max(0, booksToRender.length - slicedBooks.length);
    const cardsHtml = slicedBooks.map(book => BookCard(book)).join('');

    const categoryCardsHtml = categories.map(cat => `
        <div class="category-directory-card" data-category="${cat.name}" style="--cat-accent: ${cat.accent};">
            <div class="cat-dir-header">
                <div class="cat-overview-icon">
                    <span class="material-symbols-rounded">${cat.icon}</span>
                </div>
                <span class="cat-dir-badge">${cat.count} livros</span>
            </div>
            <h3>${cat.name}</h3>
            <p>Obras, apostilas e guias de referência de ${cat.name}.</p>
            <span class="cat-dir-link">
                Abrir categoria <span class="material-symbols-rounded">arrow_forward</span>
            </span>
        </div>
    `).join('');

    let mainCatalogArea = '';

    if (isShowingOverview) {
        mainCatalogArea = `
            <div class="special-section">
                <div class="section-header-row">
                    <div>
                        <h2 class="section-title"><span class="material-symbols-rounded">grid_view</span> Estantes por Categoria</h2>
                        <p class="section-subtitle">Escolha uma área abaixo ou use a barra superior para listar e filtrar os livros.</p>
                    </div>
                    <button class="cute-btn" data-category="Todas">
                        <span class="material-symbols-rounded">apps</span> Listar todos os ${totalBooks} livros
                    </button>
                </div>
                <div class="category-directory-grid">
                    ${categoryCardsHtml}
                </div>
            </div>
        `;
    } else if (booksToRender.length === 0) {
        mainCatalogArea = `
            <div class="empty-state-box">
                <span class="material-symbols-rounded">search_off</span>
                <h3>Nenhum livro encontrado para este filtro</h3>
                <p style="color: var(--text-muted); margin-top: 4px;">Tente outro termo de busca ou limpe os filtros ativos.</p>
                <button class="cute-btn" id="btn-reset-catalog-filters" style="margin: 1rem auto 0;">
                    <span class="material-symbols-rounded">restart_alt</span> Limpar Filtros
                </button>
            </div>
        `;
    } else {
        const filterTitle = searchQuery
            ? `Busca por "${searchQuery}"`
            : (currentCategory === 'Todas' || currentCategory === '' ? 'Todos os Livros' : currentCategory);

        mainCatalogArea = `
            <section class="results-section">
                <div class="results-header">
                    <div>
                        <h2 class="section-title">
                            <span class="material-symbols-rounded">menu_book</span>
                            ${filterTitle}
                        </h2>
                        <p class="section-subtitle">Exibindo <strong>${slicedBooks.length}</strong> de <strong>${booksToRender.length}</strong> ${booksToRender.length === 1 ? 'livro encontrado' : 'livros encontrados'}</p>
                    </div>
                    <div class="catalog-results-actions">
                        <label class="sort-select-wrapper">
                            <span>Ordenar:</span>
                            <select id="catalog-sort-select" class="sort-select">
                                <option value="title" ${sortBy === 'title' ? 'selected' : ''}>Título (A-Z)</option>
                                <option value="level" ${sortBy === 'level' ? 'selected' : ''}>Iniciantes primeiro</option>
                                <option value="author" ${sortBy === 'author' ? 'selected' : ''}>Autor (A-Z)</option>
                            </select>
                        </label>
                        <button class="cute-btn" id="btn-reset-catalog-filters">
                            <span class="material-symbols-rounded">grid_view</span> Ver Categorias
                        </button>
                    </div>
                </div>
                <div class="catalog-grid">${cardsHtml}</div>
                ${remainingCount > 0 ? `
                    <div class="load-more-container">
                        <button class="cute-btn btn-load-more" id="btn-load-more-books">
                            Carregar mais livros (+${remainingCount} restantes)
                        </button>
                    </div>
                ` : ''}
            </section>
        `;
    }

    return `
        <section class="page-section">
            <div class="results-header" style="margin-bottom: 1.25rem;">
                <div>
                    <h1 class="section-title" style="font-size: 1.5rem;">
                        <span class="material-symbols-rounded">menu_book</span>
                        Catálogo de Livros
                    </h1>
                    <p class="section-subtitle">Filtre os ${totalBooks} livros do acervo por área técnica, nível de dificuldade ou busca.</p>
                </div>
            </div>

            ${CategoryList(categories, currentCategory, currentLevel)}

            ${mainCatalogArea}
        </section>
    `;
}

export function ShelfPage({
    readingBooks = [],
    savedBooks = [],
    completedBooks = [],
    activeShelfTab = 'reading'
}) {
    let currentList = [];
    let emptyIcon = 'menu_book';
    let emptyTitle = '';
    let emptyDesc = '';

    if (activeShelfTab === 'reading') {
        currentList = readingBooks;
        emptyIcon = 'auto_stories';
        emptyTitle = 'Nenhuma leitura em andamento';
        emptyDesc = 'Quando você abrir um livro e avançar nas páginas, ele aparecerá automaticamente aqui.';
    } else if (activeShelfTab === 'saved') {
        currentList = savedBooks;
        emptyIcon = 'bookmark_add';
        emptyTitle = 'Nenhum livro na lista "Quero Ler"';
        emptyDesc = 'Salve os livros que você planeja estudar clicando no ícone de marcador no canto superior de qualquer card.';
    } else {
        currentList = completedBooks;
        emptyIcon = 'task_alt';
        emptyTitle = 'Nenhum livro concluído ainda';
        emptyDesc = 'Ao finalizar um livro, clique no botão de concluído dentro do leitor para registrá-lo aqui.';
    }

    const cardsHtml = currentList.map(b => BookCard(b)).join('');

    return `
        <section class="page-section">
            <div class="results-header">
                <div>
                    <h1 class="section-title" style="font-size: 1.5rem;">
                        <span class="material-symbols-rounded">bookmarks</span>
                        Minha Estante de Estudos
                    </h1>
                    <p class="section-subtitle">Acompanhe suas leituras atuais, livros salvos para depois e obras concluídas.</p>
                </div>
                <a href="#catalog" class="cute-btn" style="text-decoration: none;">
                    <span class="material-symbols-rounded">menu_book</span> Ir para o Catálogo
                </a>
            </div>

            <div class="trail-tabs-bar" style="margin-bottom: 1.5rem;">
                <button class="trail-tab-btn ${activeShelfTab === 'reading' ? 'active' : ''}" data-shelf-tab="reading">
                    <span class="material-symbols-rounded">auto_stories</span>
                    <span>Lendo Agora (${readingBooks.length})</span>
                </button>
                <button class="trail-tab-btn ${activeShelfTab === 'saved' ? 'active' : ''}" data-shelf-tab="saved">
                    <span class="material-symbols-rounded">bookmark</span>
                    <span>Quero Ler (${savedBooks.length})</span>
                </button>
                <button class="trail-tab-btn ${activeShelfTab === 'completed' ? 'active' : ''}" data-shelf-tab="completed">
                    <span class="material-symbols-rounded">task_alt</span>
                    <span>Concluídos (${completedBooks.length})</span>
                </button>
            </div>

            <div class="special-section">
                ${currentList.length > 0 ? `
                    <div class="catalog-grid">${cardsHtml}</div>
                ` : `
                    <div class="empty-state-box">
                        <span class="material-symbols-rounded">${emptyIcon}</span>
                        <h3>${emptyTitle}</h3>
                        <p style="color: var(--text-muted); margin-top: 4px;">${emptyDesc}</p>
                        <a href="#catalog" class="cute-btn" style="margin: 1rem auto 0; text-decoration: none; display: inline-flex;">
                            Explorar o Catálogo
                        </a>
                    </div>
                `}
            </div>
        </section>
    `;
}

export default CatalogPage;
