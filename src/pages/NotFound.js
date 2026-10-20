export default function NotFound() {
    return `
        <div class="empty-state-box" style="margin-top: 4rem;">
            <span class="material-symbols-rounded" style="font-size: 3.5rem; color: var(--accent);">explore_off</span>
            <h2>Página não encontrada (404)</h2>
            <p>O endereço que você tentou acessar não existe na BibliotecaDev.</p>
            <a href="#home" class="cute-btn" style="margin: 1.5rem auto 0; display: inline-flex; text-decoration: none;">
                <span class="material-symbols-rounded">arrow_back</span> Voltar ao Acervo Principal
            </a>
        </div>
    `;
}
