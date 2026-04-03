export default function BookCard(book) {
    const repo = book.repo || 'BibliotecaDev';
    const title = book.title || 'Livro sem título';
    const author = book.author || 'Autor desconhecido';
    const category = book.category || 'Geral';
    const level = book.level || 'intermediary';
    
    const coverText = title.substring(0, 2).toUpperCase();

    return `
        <div class="book-card" data-path="${book.path}" data-source="${book.source}" data-repo="${repo}">
            <div class="book-cover-placeholder">
                ${coverText}
            </div>
            <h3 class="book-title" title="${title}">${title}</h3>
            <p class="book-author">${author}</p>
            <div class="badge-container">
                <span class="badge ${level}">${level}</span>
                <span class="badge" style="background: #333; color: #fff;">${category}</span>
            </div>
        </div>
    `;
}