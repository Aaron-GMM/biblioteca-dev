const pageCache = new Map();
const MAX_CACHED_PAGES = 6;

export function clearPageCache() {
    pageCache.clear();
}

export async function getCachedPage(pdfDoc, pageNum) {
    if (!pdfDoc) return null;
    if (pageCache.has(pageNum)) {
        return pageCache.get(pageNum);
    }

    const page = await pdfDoc.getPage(pageNum);
    if (pageCache.size >= MAX_CACHED_PAGES) {
        const firstKey = pageCache.keys().next().value;
        pageCache.delete(firstKey);
    }
    pageCache.set(pageNum, page);
    return page;
}

/**
 * Pré-carrega silenciosamente a próxima página e a página anterior em segundo plano
 * para que a transição de páginas seja instantânea.
 */
export function preloadAdjacentPages(pdfDoc, currentPageNum) {
    if (!pdfDoc) return;
    const total = pdfDoc.numPages;
    const candidates = [currentPageNum + 1, currentPageNum - 1].filter(
        p => p >= 1 && p <= total && !pageCache.has(p)
    );

    candidates.forEach(num => {
        setTimeout(() => {
            if (pdfDoc && !pageCache.has(num)) {
                pdfDoc.getPage(num).then(page => {
                    if (pageCache.size < MAX_CACHED_PAGES) {
                        pageCache.set(num, page);
                    }
                }).catch(() => {});
            }
        }, 120);
    });
}
