import { LEVEL_LABELS } from '../app/config.js';
import { isBookSaved } from '../services/storageService.js';
import { getProgress } from '../reader/progressTracker.js';
import { resolveBookVisualMeta } from '../services/catalogService.js';

function splitBookTitle(fullTitle) {
    const separators = [' - ', ': ', ' — '];
    for (const sep of separators) {
        if (fullTitle.includes(sep)) {
            const parts = fullTitle.split(sep);
            return {
                mainTitle: parts[0].trim(),
                subTitle: parts.slice(1).join(sep).trim()
            };
        }
    }
    return { mainTitle: fullTitle, subTitle: '' };
}

export default function BookCard(book) {
    const repo = book.repo || 'BibliotecaDev';
    const title = book.title || 'Livro sem título';
    const author = book.author || 'Acervo Comunitário';
    const category = book.category || 'Geral';
    const levelKey = book.level || 'intermediary';
    const levelInfo = LEVEL_LABELS[levelKey] || LEVEL_LABELS.intermediary;

    const visual = book.visual || resolveBookVisualMeta(book);
    const { mainTitle, subTitle } = splitBookTitle(title);

    const saved = isBookSaved(book.path);
    const progressData = book.progress || getProgress(book.path);
    const hasStartedReading = progressData && progressData.page > 1;
    const progressPercent = hasStartedReading
        ? (progressData.percent || (progressData.totalPages ? Math.round((progressData.page / progressData.totalPages) * 100) : 12))
        : 0;

    return `
        <article class="book-card" data-path="${book.path}" data-source="${book.source}" data-repo="${repo}">
            <button 
                type="button"
                class="card-shelf-btn ${saved ? 'is-saved' : ''}" 
                data-shelf-path="${book.path}" 
                title="${saved ? 'Remover da Minha Estante' : 'Salvar na Minha Estante'}"
                aria-label="Salvar na Minha Estante"
            >
                <span class="material-symbols-rounded">${saved ? 'bookmark_added' : 'bookmark_add'}</span>
            </button>

            <div class="editorial-cover" style="background-color: ${visual.bg || visual.gradient}; --book-accent: ${visual.accent}; --book-spine: ${visual.spine || '#2c353d'};">
                <div class="book-spine-effect"></div>
                <div class="editorial-cover-inner">
                    <div class="editorial-top-bar">
                        <span class="editorial-tech-tag">
                            <span class="material-symbols-rounded">${visual.icon}</span>
                            ${visual.techTag}
                        </span>
                    </div>

                    <div class="editorial-title-area">
                        <span class="editorial-main-title">${mainTitle}</span>
                        ${subTitle ? `<span class="editorial-sub-title">${subTitle}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="book-card-body">
                <h3 class="book-title" title="${title}">${title}</h3>
                <p class="book-author">${author}</p>

                ${hasStartedReading ? `
                    <div class="card-reading-progress" title="Você parou na página ${progressData.page}">
                        <div class="card-progress-meta">
                            <span>Pág. ${progressData.page}${progressData.totalPages ? ` de ${progressData.totalPages}` : ''}</span>
                            <span>${progressPercent}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                        </div>
                    </div>
                ` : ''}

                <div class="badge-container">
                    <span class="badge ${levelKey}">${levelInfo.label}</span>
                    <span class="badge badge-category" title="${category}">${category}</span>
                </div>
            </div>
        </article>
    `;
}