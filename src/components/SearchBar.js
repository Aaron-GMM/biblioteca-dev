export default function SearchBar() {
    return `
        <div class="search-container">
            <span class="material-symbols-rounded search-icon">search</span>
            <input 
                type="text" 
                id="search-input" 
                placeholder="Buscar livro, autor ou tecnologia..." 
                autocomplete="off"
            >
            <button type="button" id="btn-clear-search" class="search-clear-btn" title="Limpar busca" style="display: none;">
                <span class="material-symbols-rounded">close</span>
            </button>
        </div>
    `;
}