import { getProgress, saveProgress } from './progressTracker.js';

let pdfDoc = null;
let pageNum = 1;
let scale = 1.25;
let bookIdRef = '';
let canvas, ctx;
let isRendering = false;
let pageNumPending = null;

let controlsTimeout;
const HIDE_DELAY = 1500; // 1.5 segundos definido

export async function initPdfViewer(url, bookId) {
    bookIdRef = bookId;
    const progress = getProgress(bookId);
    pageNum = progress.page;
    scale = progress.zoom;

    canvas = document.getElementById('pdf-render');
    ctx = canvas.getContext('2d');

    document.getElementById('btn-prev').addEventListener('click', onPrevPage);
    document.getElementById('btn-next').addEventListener('click', onNextPage);
    document.getElementById('btn-zoom-in').addEventListener('click', () => changeZoom(0.25));
    document.getElementById('btn-zoom-out').addEventListener('click', () => changeZoom(-0.25));
    document.getElementById('btn-close').addEventListener('click', () => window.history.back());
    
    document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

    const readerWrapper = document.getElementById('reader-container');
    readerWrapper.addEventListener('mousemove', resetControlsTimer);
    readerWrapper.addEventListener('touchstart', resetControlsTimer);

    try {
        pdfDoc = await pdfjsLib.getDocument(url).promise;
        document.getElementById('page-count').textContent = pdfDoc.numPages;
        document.getElementById('loading-indicator').style.display = 'none';
        renderPage(pageNum);
        
        // Inicia o timer assim que carrega
        resetControlsTimer();
    } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
        document.getElementById('loading-indicator').textContent = 'Erro ao carregar o arquivo PDF.';
    }
}

// --- FUNÇÕES DE MODO IMERSIVO ---

function toggleFullscreen() {
    const elem = document.getElementById('reader-container');
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            alert(`Erro ao tentar entrar em tela cheia: ${err.message}`);
        });
        document.getElementById('btn-fullscreen').querySelector('span').textContent = 'fullscreen_exit';
    } else {
        document.exitFullscreen();
        document.getElementById('btn-fullscreen').querySelector('span').textContent = 'fullscreen';
    }
}

function resetControlsTimer() {
    const wrapper = document.getElementById('reader-container');
    
    // Faz os controles aparecerem
    wrapper.classList.remove('hide-controls');
    
    // Cancela o timer anterior
    clearTimeout(controlsTimeout);
    
    // Inicia um novo timer de 1.5s
    // Opcional: só esconder se estiver em modo de tela cheia
    // Se quiser esconder sempre, remova o "if (document.fullscreenElement)"
    if (document.fullscreenElement) {
        controlsTimeout = setTimeout(() => {
            wrapper.classList.add('hide-controls');
        }, HIDE_DELAY);
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