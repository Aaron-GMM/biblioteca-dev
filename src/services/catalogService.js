import { APP_CONFIG, CATEGORY_THEMES, TECH_BADGES, STUDY_TRAILS } from '../app/config.js';
import { normalizeText } from '../utils/normalizeText.js';
import { getAllSavedProgress } from '../reader/progressTracker.js';
import { getSavedBookPaths } from './storageService.js';

let catalogBooks = [];

const LEVEL_WEIGHT = {
    beginner: 1,
    intermediary: 2,
    advanced: 3
};

export function resolveBookVisualMeta(book) {
    const catTheme = CATEGORY_THEMES[book.category] || {
        accent: '#8aa8bd',
        bg: '#21272d',
        gradient: '#21272d',
        spine: '#2c353d',
        icon: 'menu_book',
        collection: (book.category || 'Acervo Técnico')
    };

    const matchedTech = TECH_BADGES.find(tb => tb.regex.test(book.title) || tb.regex.test(book.category));

    return {
        accent: matchedTech ? matchedTech.color : catTheme.accent,
        bg: catTheme.bg || '#21272d',
        gradient: catTheme.gradient,
        spine: catTheme.spine,
        icon: matchedTech ? matchedTech.icon : catTheme.icon,
        techTag: matchedTech ? matchedTech.tag : catTheme.collection,
        collection: catTheme.collection
    };
}

export async function loadCatalog() {
    const response = await fetch(`${APP_CONFIG.catalogUrl}?nocache=${Date.now()}`);
    if (!response.ok) {
        throw new Error('Falha ao carregar o catálogo de livros.');
    }

    const rawData = await response.json();
    const flattened = [];

    rawData.forEach(repoObj => {
        let repoName = repoObj['Repositoy-Name'] || repoObj['Repository-Name'] || 'BibliotecaDev';
        if (repoName === 'LivrosDev') {
            repoName = 'BibliotecaDev';
        }

        if (Array.isArray(repoObj.livros)) {
            repoObj.livros.forEach((book, idx) => {
                const normalizedBook = {
                    ...book,
                    id: `${repoName}_${idx}`,
                    repo: repoName,
                    title: (book.title || 'Livro Técnico').trim(),
                    author: (book.author && book.author !== 'Desconhecido') ? book.author.trim() : 'Acervo Comunitário',
                    category: (book.category || 'Geral').trim(),
                    level: book.level || 'intermediary',
                    source: (book.path && !book.path.startsWith('http')) ? 'github_repo' : (book.source || 'github_repo')
                };

                normalizedBook.visual = resolveBookVisualMeta(normalizedBook);
                flattened.push(normalizedBook);
            });
        }
    });

    catalogBooks = flattened;
    return catalogBooks;
}

export function getAllBooks() {
    return catalogBooks;
}

export function getBookByPath(bookPath) {
    if (!bookPath) return null;
    const decoded = (() => {
        try { return decodeURIComponent(bookPath); } catch (e) { return bookPath; }
    })();

    return catalogBooks.find(b => b.path === bookPath || b.path === decoded) || null;
}

export function getCategoriesWithCount() {
    const counts = {};
    catalogBooks.forEach(b => {
        if (!b.category) return;
        counts[b.category] = (counts[b.category] || 0) + 1;
    });

    return Object.keys(counts)
        .sort((a, b) => a.localeCompare(b, 'pt-BR'))
        .map(cat => {
            const theme = CATEGORY_THEMES[cat] || { icon: 'folder', accent: '#93b4c8' };
            return {
                name: cat,
                count: counts[cat],
                icon: theme.icon,
                accent: theme.accent
            };
        });
}

export function getBeginnerBooks(limit = 8) {
    const beginnerPool = catalogBooks.filter(b => b.level === 'beginner');
    const seenCategories = new Set();
    const diversePick = [];

    for (const book of beginnerPool) {
        if (!seenCategories.has(book.category)) {
            seenCategories.add(book.category);
            diversePick.push(book);
        }
        if (diversePick.length >= limit) break;
    }

    if (diversePick.length < limit) {
        for (const book of beginnerPool) {
            if (!diversePick.includes(book)) {
                diversePick.push(book);
            }
            if (diversePick.length >= limit) break;
        }
    }

    return diversePick;
}

export function getRecentReadingBooks(limit = 8) {
    const progressEntries = getAllSavedProgress();
    const recent = [];

    for (const entry of progressEntries) {
        const bookInfo = getBookByPath(entry.bookPath);
        if (bookInfo) {
            recent.push({
                ...bookInfo,
                progress: entry.progress
            });
        }
        if (recent.length >= limit) break;
    }

    return recent;
}

export function getSavedShelfBooks(statusFilter = null) {
    const savedPaths = getSavedBookPaths(statusFilter);
    return savedPaths
        .map(p => getBookByPath(p))
        .filter(Boolean);
}

export function getStudyTrailsWithBooks() {
    return STUDY_TRAILS.map(trail => {
        const matchedBooks = [];
        for (const kw of trail.keywords) {
            const kwNorm = normalizeText(kw);
            const found = catalogBooks.find(
                b => normalizeText(b.title).includes(kwNorm) && !matchedBooks.includes(b)
            );
            if (found) matchedBooks.push(found);
        }
        return {
            ...trail,
            books: matchedBooks.slice(0, 4)
        };
    });
}

export function filterBooks({
    category = '',
    level = '',
    searchQuery = '',
    sortBy = 'title',
    onlySaved = false
} = {}) {
    let list = onlySaved ? getSavedShelfBooks() : [...catalogBooks];

    if (category && category !== 'Todas' && category !== 'Busca') {
        list = list.filter(b => b.category === category);
    }

    if (level && level !== 'all') {
        list = list.filter(b => b.level === level);
    }

    if (searchQuery && searchQuery.trim() !== '') {
        const q = normalizeText(searchQuery.trim());
        list = list.filter(b =>
            normalizeText(b.title).includes(q) ||
            normalizeText(b.author).includes(q) ||
            normalizeText(b.category).includes(q) ||
            normalizeText(b.visual?.techTag || '').includes(q)
        );
    }

    if (sortBy === 'title') {
        list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    } else if (sortBy === 'level') {
        list.sort((a, b) => (LEVEL_WEIGHT[a.level] || 2) - (LEVEL_WEIGHT[b.level] || 2) || a.title.localeCompare(b.title, 'pt-BR'));
    } else if (sortBy === 'author') {
        list.sort((a, b) => a.author.localeCompare(b.author, 'pt-BR') || a.title.localeCompare(b.title, 'pt-BR'));
    }

    return list;
}
