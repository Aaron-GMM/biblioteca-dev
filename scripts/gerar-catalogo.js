// gerar-catalogo.js
const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos (certifique-se de que o README.md está na raiz ou ajuste o caminho)
const readmePath = path.join(__dirname, '..', './bibliotecadev-web/README(2).md'); // Ajuste se o README estiver em outro lugar
const outputPath = path.join(__dirname, 'catalog', 'books.json');

console.log('⏳ Iniciando a leitura do README.md...');

try {
    const markdown = fs.readFileSync(readmePath, 'utf-8');
    const lines = markdown.split('\n');

    const books = [];
    let currentCategory = 'Geral';

    // Regex para capturar o padrão Markdown: [Título do Livro](Url do PDF)
    const linkRegex = /\[(.*?)\]\((.+)\)/;

    lines.forEach(line => {
        // 1. Rastreador de Categoria: Atualiza a categoria sempre que passa por um header ###
        if (line.startsWith('### ')) {
            currentCategory = line.replace('### ', '').trim();
        }

        // 2. Filtro de Tabela: Pega apenas as linhas que começam com "|" e têm a capa do livro
        if (line.startsWith('|') && line.includes('capa do livro') && !line.includes('LIVRO | NOME')) {
            // Divide a linha pelas barras da tabela e limpa os espaços
            const cols = line.split('|').map(c => c.trim());

            // A coluna 2 é o Nome/Link, a coluna 3 é o Autor (índices consideram a string vazia antes do primeiro |)
            if (cols.length >= 4) {
                const nameCol = cols[2];
                const authorCol = cols[3];

                const match = nameCol.match(linkRegex);

                if (match) {
                    const title = match[1];
                    const rawUrl = match[2];

                    // 3. Classificação Automática: Define se é iniciante baseado no título
                    const isBeginner = /começando|primeiros passos|entendendo|guia prático|for beginners/i.test(title);
                    const level = isBeginner ? 'beginner' : 'advanced';

                    // 4. Verificação de Origem e Limpeza de Path
                    let source = 'external_url';
                    let bookPath = rawUrl;

                    // Se for do seu repositório, extrai apenas o caminho relativo para usarmos na CDN
                    if (rawUrl.includes('github.com/KAYOKG/BibliotecaDev/blob/main/')) {
                        source = 'github_repo';
                        bookPath = rawUrl.split('main/')[1];
                        bookPath = decodeURIComponent(bookPath); // Remove "%20" para deixar limpo
                    }

                    books.push({
                        title: title,
                        author: authorCol,
                        category: currentCategory,
                        path: bookPath,
                        level: level,
                        source: source
                    });
                }
            }
        }
    });

    // 5. Salva o resultado no arquivo JSON formatado
    fs.writeFileSync(outputPath, JSON.stringify(books, null, 2));
    console.log(`✅ Sucesso! Catálogo gerado em catalog/books.json com ${books.length} livros processados.`);

} catch (error) {
    console.error('❌ Erro ao processar o catálogo:', error.message);
    console.log('💡 Dica: Verifique se o arquivo README.md está no diretório correto.');
}