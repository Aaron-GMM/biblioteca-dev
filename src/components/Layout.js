import SearchBar from './SearchBar.js';
import { getSavedBookPaths } from '../services/storageService.js';

export default function Layout() {
    const savedCount = getSavedBookPaths().length;

    return `
        <nav class="navbar" id="main-navbar">
            <div class="navbar-brand-group">
                <a href="#home" class="logo" id="logo-link">
                    <span class="logo-icon material-symbols-rounded">local_library</span>
                    <span>Biblioteca<span class="logo-highlight">Dev</span></span>
                </a>

                <div class="nav-links">
                    <a href="#home" class="nav-item active" data-route="#home">
                        <span class="material-symbols-rounded">home</span>
                        <span>Início</span>
                    </a>
                    <a href="#catalog" class="nav-item" data-route="#catalog">
                        <span class="material-symbols-rounded">menu_book</span>
                        <span>Catálogo</span>
                    </a>
                    <a href="#shelf" class="nav-item" data-route="#shelf">
                        <span class="material-symbols-rounded">bookmarks</span>
                        <span>Minha Estante</span>
                        <span id="shelf-count-badge" class="shelf-badge" style="${savedCount > 0 ? '' : 'display:none;'}">${savedCount}</span>
                    </a>
                </div>
            </div>

            ${SearchBar()}
        </nav>
        
        <main id="main-content" class="container"></main>

        <div id="toast-container" class="toast-container"></div>

        <footer class="site-footer" id="site-footer">
            <div class="footer-content">
                <p>Desenvolvido com dedicação por <strong><a href="https://github.com/Aaron-GMM" target="_blank" rel="noopener">Aaron GMM</a></strong></p>
                <div class="footer-links">
                    <a href="https://github.com/Aaron-GMM/biblioteca-dev" target="_blank" rel="noopener">
                        <span class="material-symbols-rounded">folder_open</span> Repositório Oficial
                    </a>
                    <button id="btn-pix" class="btn-pix">
                        <span class="material-symbols-rounded">local_cafe</span> Pague um café ao Dev
                    </button>
                </div>
            </div>
        </footer>

        <div id="pix-modal" class="pix-modal">
            <div class="pix-modal-content">
                <span class="close-modal">&times;</span>
                <h2 style="color: var(--accent);">☕ Contribua com a Biblioteca</h2>
                <p style="color: var(--text-muted); margin: 10px 0;">Este projeto é open-source. Sua contribuição ajuda a manter o código vivo e sem anúncios!</p>
                
                <div class="qrcode-placeholder" style="margin: 20px auto; width: 180px; height: 180px; background: #fff; display:flex; align-items:center; justify-content:center; border-radius: 8px; padding: 10px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=00020126450014br.gov.bcb.pix0123aarongibran13@gmail.com5204000053039865802BR5925Aaron%20Gibran%20Moreira%20Mont6009Sao%20Paulo62290525REC69D017C62AB626941837576304E729" alt="QR Code PIX Aaron" style="width: 100%; height: 100%;">
                </div>
                
                <p style="text-align:center;"><strong>Chave PIX:</strong> aarongibran13@gmail.com</p>
                
                <button id="btn-copy-pix" class="cute-btn" style="margin: 15px auto 0 auto; width: 100%; justify-content: center;">
                    <span class="material-symbols-rounded">content_copy</span> Copiar Código PIX
                </button>
            </div>
        </div>
    `;
}