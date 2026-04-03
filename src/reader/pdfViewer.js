import { getProgress, saveProgress } from './progressTracker.js';

let pdfDoc = null;
let pageNum = 1;
let scale = 1.25;
let bookIdRef = '';
let canvas, ctx;
let isRendering = false;
let pageNumPending = null;


export async function initPdfViewer(url, bookId) {
    bookIdRef = bookId;

    // Recupera o progresso salvo
    const progress = getProgress(bookId);
    pageNum = progress.page;
    scale = progress.zoom;

    canvas = document.getElementById('pdf-render');
    ctx = canvas.getContext('2d');

    // Ativa os botões
    document.getElementById('btn-prev').addEventListener('click', onPrevPage);
    document.getElementById('btn-next').addEventListener('click', onNextPage);
    document.getElementById('btn-zoom-in').addEventListener('click', () => changeZoom(0.25));
    document.getElementById('btn-zoom-out').addEventListener('click', () => changeZoom(-0.25));
    document.getElementById('btn-close').addEventListener('click', () => window.history.back());


    try {
        // Carrega o documento usando a variável global do PDF.js importada no HTML
        pdfDoc = await pdfjsLib.getDocument(url).promise;

        document.getElementById('page-count').textContent = pdfDoc.numPages;
        document.getElementById('loading-indicator').style.display = 'none';
        // Os controles agora estão sempre visíveis na estrutura kindle-footer

        // Renderiza a página em que o usuário parou
        renderPage(pageNum);
    } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
        document.getElementById('loading-indicator').textContent = 'Erro ao carregar o arquivo PDF.';
    }
}

// Renderiza a página no Canvas
function renderPage(num) {
    isRendering = true;
    
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderCtx).promise.then(() => {
            isRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });

        // Atualiza UI e salva progresso
        document.getElementById('page-num').textContent = num;
        saveProgress(bookIdRef, pageNum, scale);
    });
}

// Fila de renderização (evita conflitos se o usuário clicar rápido demais)
function queueRenderPage(num) {
    if (isRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

function changeZoom(delta) {
    let newScale = scale + delta;
    if (newScale < 0.5 || newScale > 3.0) return; // Limites de zoom
    scale = newScale;
    queueRenderPage(pageNum);
}