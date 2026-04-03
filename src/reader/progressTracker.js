
export function getProgress(bookId) {
    const saved = localStorage.getItem(`bibliotecadev_progress_${bookId}`);
    if (saved) {
        return JSON.parse(saved);
    }
    return { page: 1, zoom: 1.25, timestamp: Date.now() }; // Valores padrão
}

// Salva o progresso atual
export function saveProgress(bookId, page, zoom) {
    const progress = {
        page: page,
        zoom: zoom,
        timestamp: Date.now()
    };
    localStorage.setItem(`bibliotecadev_progress_${bookId}`, JSON.stringify(progress));
}