export default function SearchBar() {
    return `
        <div class="search-container" style="display: flex; gap: 10px; width: 100%; max-width: 400px;">
            <input 
                type="text" 
                id="search-input" 
                placeholder="Buscar livro, autor ou categoria..." 
                style="width: 100%; padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-main); outline: none;"
            >
        </div>
    `;
}