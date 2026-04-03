export default function BookCard(book) {
    const isBeginner = book.level === 'beginner';
    const badgeClass = isBeginner ? 'beginner' : 'advanced';
    const badgeText = isBeginner ? 'Iniciante' : 'Avançado';

    return `
        <article class="book-card" data-path="${book.path}" data-source="${book.source}">
            <div class="book-cover-placeholder">📖</div>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author || 'Autor Desconhecido'}</p>
            <span class="badge ${badgeClass}">${badgeText}</span>
            <span class="badge" style="background-color: #4a148c">${book.category}</span>
        </article>
    `;
}