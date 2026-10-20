import { APP_CONFIG } from '../app/config.js';

const PREFIX = APP_CONFIG.storageKeys.progressPrefix;

export function getProgress(bookId) {
    try {
        const saved = localStorage.getItem(`${PREFIX}${bookId}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                page: parsed.page || 1,
                totalPages: parsed.totalPages || 0,
                zoom: parsed.zoom || 1.25,
                percent: parsed.percent || 0,
                timestamp: parsed.timestamp || Date.now()
            };
        }
    } catch (e) {
        // Retorna padrão em caso de JSON inválido
    }
    return { page: 1, totalPages: 0, zoom: 1.25, percent: 0, timestamp: Date.now() };
}

export function saveProgress(bookId, page, zoom, totalPages = 0) {
    const existing = getProgress(bookId);
    const finalTotal = totalPages || existing.totalPages || 0;
    const percent = finalTotal > 0 ? Math.min(100, Math.max(1, Math.round((page / finalTotal) * 100))) : 0;

    const progress = {
        page,
        totalPages: finalTotal,
        zoom,
        percent,
        timestamp: Date.now()
    };

    localStorage.setItem(`${PREFIX}${bookId}`, JSON.stringify(progress));
    return progress;
}

export function clearProgress(bookId) {
    localStorage.removeItem(`${PREFIX}${bookId}`);
}

/**
 * Retorna uma lista de todos os livros com progresso salvo no navegador,
 * removendo corretamente o prefixo `bibliotecadev_progress_` da chave.
 */
export function getAllSavedProgress() {
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(PREFIX)) continue;

        const bookPath = key.slice(PREFIX.length);
        try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data && data.page && data.timestamp) {
                entries.push({
                    bookPath,
                    progress: {
                        page: data.page,
                        totalPages: data.totalPages || 0,
                        zoom: data.zoom || 1.25,
                        percent: data.percent || (data.totalPages ? Math.round((data.page / data.totalPages) * 100) : 5),
                        timestamp: data.timestamp
                    }
                });
            }
        } catch (e) {
            // Ignora entradas corrompidas
        }
    }

    return entries.sort((a, b) => b.progress.timestamp - a.progress.timestamp);
}