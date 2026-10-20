let currentRenderTask = null;

/**
 * Renderiza uma página do PDF no Canvas com suporte a telas de alta densidade (Retina / HiDPI)
 */
export async function renderPdfPageToCanvas(page, scale, canvas, ctx) {
    if (currentRenderTask) {
        try {
            currentRenderTask.cancel();
        } catch (e) {
            // Ignora cancelamento
        }
        currentRenderTask = null;
    }

    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale });

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null;

    const renderContext = {
        canvasContext: ctx,
        transform,
        viewport
    };

    currentRenderTask = page.render(renderContext);
    await currentRenderTask.promise;
    currentRenderTask = null;
}

/**
 * Calcula a escala ideal para ajustar a página à largura útil da área de leitura
 */
export async function calculateFitWidthScale(pdfDoc, pageNum, containerElement) {
    if (!pdfDoc || !containerElement) return 1.25;
    const page = await pdfDoc.getPage(pageNum);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(320, containerElement.clientWidth - 48);
    const idealScale = availableWidth / unscaledViewport.width;
    return Math.min(2.5, Math.max(0.5, Number(idealScale.toFixed(2))));
}

/**
 * Calcula a escala ideal para caber a página inteira na altura da tela (ideal para notebooks)
 */
export async function calculateFitPageScale(pdfDoc, pageNum, containerElement) {
    if (!pdfDoc || !containerElement) return 1.0;
    const page = await pdfDoc.getPage(pageNum);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const availableHeight = Math.max(300, containerElement.clientHeight - 36);
    const availableWidth = Math.max(320, containerElement.clientWidth - 48);
    const scaleH = availableHeight / unscaledViewport.height;
    const scaleW = availableWidth / unscaledViewport.width;
    const idealScale = Math.min(scaleH, scaleW);
    return Math.min(2.5, Math.max(0.45, Number(idealScale.toFixed(2))));
}
