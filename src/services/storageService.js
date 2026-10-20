import { APP_CONFIG } from '../app/config.js';
import { buildRawGithubUrl, buildCandidatePdfUrls } from './githubService.js';

export function getBookUrl(bookPath, source, repo = 'BibliotecaDev') {
    if (source === 'external_url' && !bookPath.includes('github.com')) {
        return bookPath;
    }
    return buildRawGithubUrl(bookPath, repo);
}

export function getBookCandidateUrls(bookPath, source, repo = 'BibliotecaDev') {
    return buildCandidatePdfUrls(bookPath, source, repo);
}

// =========================================================
// 📚 MINHA ESTANTE (Quero Ler / Lendo / Concluído)
// =========================================================

export function getShelf() {
    try {
        const raw = localStorage.getItem(APP_CONFIG.storageKeys.shelf);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

export function isBookSaved(bookPath) {
    const shelf = getShelf();
    return Boolean(shelf[bookPath]);
}

export function getBookShelfStatus(bookPath) {
    const shelf = getShelf();
    return shelf[bookPath]?.status || null;
}

export function isBookCompleted(bookPath) {
    const shelf = getShelf();
    return shelf[bookPath]?.status === 'completed';
}

export function toggleBookSaved(bookPath) {
    const shelf = getShelf();
    if (shelf[bookPath]) {
        delete shelf[bookPath];
        localStorage.setItem(APP_CONFIG.storageKeys.shelf, JSON.stringify(shelf));
        return false;
    } else {
        shelf[bookPath] = {
            addedAt: Date.now(),
            status: 'saved'
        };
        localStorage.setItem(APP_CONFIG.storageKeys.shelf, JSON.stringify(shelf));
        return true;
    }
}

export function toggleBookCompleted(bookPath) {
    const shelf = getShelf();
    const current = shelf[bookPath];
    if (current && current.status === 'completed') {
        shelf[bookPath] = {
            ...current,
            status: 'saved',
            updatedAt: Date.now()
        };
        localStorage.setItem(APP_CONFIG.storageKeys.shelf, JSON.stringify(shelf));
        return false;
    } else {
        shelf[bookPath] = {
            addedAt: current?.addedAt || Date.now(),
            updatedAt: Date.now(),
            status: 'completed'
        };
        localStorage.setItem(APP_CONFIG.storageKeys.shelf, JSON.stringify(shelf));
        return true;
    }
}

export function getSavedBookPaths(statusFilter = null) {
    const shelf = getShelf();
    return Object.keys(shelf)
        .filter(path => !statusFilter || shelf[path]?.status === statusFilter)
        .sort((a, b) => (shelf[b].updatedAt || shelf[b].addedAt || 0) - (shelf[a].updatedAt || shelf[a].addedAt || 0));
}

// =========================================================
// 🔖 MARCADORES DE PÁGINA E CADERNO DE ESTUDOS (Por Livro)
// =========================================================

export function getBookmarks(bookId) {
    try {
        const raw = localStorage.getItem(`${APP_CONFIG.storageKeys.bookmarksPrefix}${bookId}`);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

export function toggleBookmark(bookId, pageNum) {
    const current = getBookmarks(bookId);
    const exists = current.includes(pageNum);
    const updated = exists
        ? current.filter(p => p !== pageNum)
        : [...current, pageNum].sort((a, b) => a - b);

    localStorage.setItem(`${APP_CONFIG.storageKeys.bookmarksPrefix}${bookId}`, JSON.stringify(updated));
    return { isBookmarked: !exists, bookmarks: updated };
}

export function getBookNotes(bookId) {
    try {
        const raw = localStorage.getItem(`${APP_CONFIG.storageKeys.notesPrefix}${bookId}`);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

export function addBookNote(bookId, pageNum, content) {
    const text = (content || '').trim();
    if (!text) return getBookNotes(bookId);

    const notes = getBookNotes(bookId);
    const newNote = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        page: pageNum,
        text,
        createdAt: Date.now()
    };
    const updated = [newNote, ...notes];
    localStorage.setItem(`${APP_CONFIG.storageKeys.notesPrefix}${bookId}`, JSON.stringify(updated));
    return updated;
}

export function deleteBookNote(bookId, noteId) {
    const notes = getBookNotes(bookId).filter(n => n.id !== noteId);
    localStorage.setItem(`${APP_CONFIG.storageKeys.notesPrefix}${bookId}`, JSON.stringify(notes));
    return notes;
}

// =========================================================
// 🎨 TEMA DE CONFORTO VISUAL DO LEITOR PDF
// =========================================================

export function getReaderTheme() {
    return localStorage.getItem(APP_CONFIG.storageKeys.readerTheme) || 'original';
}

export function setReaderTheme(theme) {
    localStorage.setItem(APP_CONFIG.storageKeys.readerTheme, theme);
}