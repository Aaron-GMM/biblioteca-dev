export default function Layout() {
    return `
        <nav class="navbar">
            <div class="logo">BibliotecaDev</div>
            <div class="search-container">
                <input type="text" id="search-input" placeholder="Buscar título, autor ou categoria...">
            </div>
        </nav>
        
        <main id="main-content" class="container"></main>

        <footer class="site-footer">
            <div class="footer-content">
                <p>Curadoria e Desenvolvimento por <strong><a href="https://github.com/Aaron-GMM" target="_blank">Aaron GMM</a></strong></p>
                <div class="footer-links">
                    <a href="https://github.com/Aaron-GMM/biblioteca-dev" target="_blank"><span class="material-symbols-rounded">folder_open</span> Repositório Oficial</a>
                    <button id="btn-pix" class="btn-pix"><span class="material-symbols-rounded">local_cafe</span> Pague um café ao Dev</button>
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
                
                <button class="cute-btn" style="margin: 15px auto 0 auto; width: 100%; justify-content: center;" onclick="navigator.clipboard.writeText('00020126450014br.gov.bcb.pix0123aarongibran13@gmail.com5204000053039865802BR5925Aaron Gibran Moreira Mont6009Sao Paulo62290525REC69D017C62AB626941837576304E729'); alert('Código Copia e Cola copiado!');">
                    <span class="material-symbols-rounded">content_copy</span> Copiar Código PIX
                </button>
            </div>
        </div>
    `;
}