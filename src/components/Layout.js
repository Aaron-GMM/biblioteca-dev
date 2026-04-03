import SearchBar from './SearchBar.js';

export default function Layout() {
    return `
        <header class="navbar">
            <div class="logo">📚 BibliotecaDev</div>
            ${SearchBar()}
        </header>
        <main id="main-content" class="container">
            </main>
    `;
}