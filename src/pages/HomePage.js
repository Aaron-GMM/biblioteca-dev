import BookCard from '../components/BookCard.js';

export default function HomePage({
    recentBooks = [],
    studyTrails = [],
    activeTrailId = 'primeiros-passos',
    totalCatalogCount = 0
}) {
    const activeTrail = studyTrails.find(t => t.id === activeTrailId) || studyTrails[0];
    const trailTabsHtml = studyTrails.map(trail => `
        <button class="trail-tab-btn ${trail.id === (activeTrail?.id) ? 'active' : ''}" data-trail-id="${trail.id}" style="--trail-color: ${trail.color};">
            <span class="material-symbols-rounded">${trail.icon}</span>
            <span>${trail.title}</span>
        </button>
    `).join('');

    const trailBooksHtml = activeTrail ? activeTrail.books.map(book => BookCard(book)).join('') : '';

    // Seção "Continue de onde parou"
    const historyHtml = recentBooks.map(book => {
        const page = book.progress?.page || 1;
        const total = book.progress?.totalPages || 0;
        const percent = book.progress?.percent || (total ? Math.round((page / total) * 100) : 10);
        const accent = book.visual?.accent || 'var(--accent)';

        return `
            <div class="book-card history-card" data-path="${book.path}" data-source="${book.source}" data-repo="${book.repo}" style="--history-accent: ${accent};">
                <button type="button" class="history-remove-btn" data-remove-history="${book.path}" title="Remover do histórico">
                    <span class="material-symbols-rounded">close</span>
                </button>
                <div class="history-card-top">
                    <span class="history-cat-tag">${book.category}</span>
                    <h3 class="book-title" title="${book.title}">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                </div>
                <div class="history-card-bottom">
                    <div class="history-progress-row">
                        <span>Página ${page}${total ? ` de ${total}` : ''}</span>
                        <strong>${percent}%</strong>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                    </div>
                    <span class="resume-badge">
                        <span class="material-symbols-rounded">play_arrow</span> Continuar Lendo
                    </span>
                </div>
            </div>
        `;
    }).join('');

    const historySection = recentBooks.length > 0 ? `
        <section class="special-section history-section">
            <div class="section-header-row">
                <div>
                    <h2 class="section-title"><span class="material-symbols-rounded">history</span> Continue de onde parou</h2>
                    <p class="section-subtitle">Retome suas leituras recentes exatamente da página onde parou.</p>
                </div>
            </div>
            <div class="history-grid">
                ${historyHtml}
            </div>
        </section>
    ` : '';

    return `
        <section class="hero">
            <h1>BibliotecaDev</h1>
            <p>A <strong>BibliotecaDev</strong> reúne ${totalCatalogCount} livros e apostilas de tecnologia em um ambiente limpo e livre de links maliciosos, pensado para você estudar com conforto.</p>
            <div class="hero-actions">
                <a href="#catalog" class="cute-btn btn-start-huge" style="text-decoration: none;">
                    <span class="material-symbols-rounded">menu_book</span>
                    Explorar o Catálogo (${totalCatalogCount} livros)
                </a>
                <button class="cute-btn btn-secondary-hero" id="btn-start-beginner">
                    <span class="material-symbols-rounded">play_circle</span>
                    Sortear Livro Iniciante
                </button>
            </div>
               <br>
            <section class="about-features-grid">
            <div class="about-feature-card">
                <span class="material-symbols-rounded about-feature-icon">shield_lock</span>
                <div>
                    <h3>Leitura Direta & Confortável</h3>
                    <p>Leia os PDFs sem baixar arquivos suspeitos, com suporte a <strong>Modo Sépia</strong> e <strong>Modo Noturno</strong> para não cansar a vista.</p>
                </div>
            </div>

            <div class="about-feature-card">
                <span class="material-symbols-rounded about-feature-icon">edit_note</span>
                <div>
                    <h3>Caderno de Notas & Pomodoro</h3>
                    <p>Marque páginas importantes, escreva resumos enquanto lê, use o timer de foco e exporte suas notas em Markdown (<code>.md</code>).</p>
                </div>
            </div>

            <div class="about-feature-card">
                <span class="material-symbols-rounded about-feature-icon">bookmarks</span>
                <div>
                    <h3>Minha Estante & Progresso</h3>
                    <p>Monte sua lista pessoal de estudos e continue qualquer livro exatamente da página onde parou, salvo no seu navegador.</p>
                </div>
            </div>
        </section>
        </section>

        <!-- Explicação simples sobre a BibliotecaDev e os recursos disponíveis -->
       

        ${historySection}

        <!-- Trilhas de Estudo com Primeiros Passos integrado na 1ª aba (sem banner extra e sem filtros na Home) -->
        ${studyTrails.length > 0 ? `
            <section class="special-section trails-section" id="study-trails-section">
                <div class="section-header-row">
                    <div>
                        <h2 class="section-title"><span class="material-symbols-rounded">route</span> Por onde começar a estudar</h2>
                    </div>
                </div>
                <div class="trail-tabs-bar">
                    ${trailTabsHtml}
                </div>
                <div class="catalog-grid">${trailBooksHtml}</div>
            </section>
        ` : ''}
    `;
}