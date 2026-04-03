const fs = require('fs');
const path = require('path');

console.log('🧹 Iniciando a faxina no acervo...\n');

try {
    // 1. Lendo o catálogo atual
    const rawData = fs.readFileSync('books.json', 'utf-8');
    const books = JSON.parse(rawData);

    // 2. Filtro Anti-Lojas (Mantém apenas PDFs locais ou links 100% gratuitos)
    const dominiosPagos = ['amazon.', 'amazon.com', 'casadocodigo.com.br'];
    
    const isLinkPago = (book) => {
        if (book.source !== 'external_url') return false;
        const url = book.path.toLowerCase();
        return dominiosPagos.some(dominio => url.includes(dominio));
    };

    const livrosGratuitos = books.filter(book => !isLinkPago(book));

    // 3. Lógica de Deduplicação (Encontrar a melhor cópia física)
    const normalizarTitulo = (titulo) => {
        return titulo.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/ - casa do codigo/g, '')               // Remove tag da editora
            .replace(/ - autor.*/g, '')                      // Remove tag de autor
            .replace(/\(1\)/g, '')                           // Remove marca de cópia do windows
            .replace(/\.pdf/g, '')
            .replace(/[^a-z0-9]/g, '');                      // Remove espaços e pontuações para comparar
    };

    const livrosUnicos = new Map();
    const arquivosDescartados = [];

    livrosGratuitos.forEach(book => {
        const chaveTitulo = normalizarTitulo(book.title);

        if (!livrosUnicos.has(chaveTitulo)) {
            livrosUnicos.set(chaveTitulo, book);
        } else {
            // Opa, achamos uma duplicata! Vamos decidir qual é a melhor.
            const livroExistente = livrosUnicos.get(chaveTitulo);
            
            let pontuacaoNovo = 0;
            let pontuacaoExistente = 0;

            // Prioridade 1: Arquivos no repositório vencem links externos
            if (book.source === 'github_repo') pontuacaoNovo += 100;
            if (livroExistente.source === 'github_repo') pontuacaoExistente += 100;

            // Prioridade 2: A pasta LivrosDev/ é muito mais organizada
            if (book.path.includes('LivrosDev/')) pontuacaoNovo += 50;
            if (livroExistente.path.includes('LivrosDev/')) pontuacaoExistente += 50;

            // Prioridade 3: Caminhos mais curtos tendem a ter nomes mais limpos (sem "- Casa do Codigo")
            if (book.path.length < livroExistente.path.length) pontuacaoNovo += 10;
            if (livroExistente.path.length < book.path.length) pontuacaoExistente += 10;

            // Substitui se o novo for melhor
            if (pontuacaoNovo > pontuacaoExistente) {
                if (livroExistente.source === 'github_repo') arquivosDescartados.push(livroExistente.path);
                livrosUnicos.set(chaveTitulo, book);
            } else {
                if (book.source === 'github_repo') arquivosDescartados.push(book.path);
            }
        }
    });

    const acervoFinal = Array.from(livrosUnicos.values());

    // 4. Salvar o novo JSON limpo
    fs.writeFileSync('books-limpo.json', JSON.stringify(acervoFinal, null, 2));

    // 5. Exibir os resultados
    const qtdRemovidosLojas = books.length - livrosGratuitos.length;
    const qtdDuplicadas = livrosGratuitos.length - acervoFinal.length;

    console.log(`✅ Sucesso! Foi gerado o arquivo 'books-limpo.json'.`);
    console.log(`🤑 Links de lojas removidos: ${qtdRemovidosLojas}`);
    console.log(`👯‍♂️ Clones/Duplicatas removidas: ${qtdDuplicadas}`);
    console.log(`📚 Tamanho do acervo final: ${acervoFinal.length} livros únicos.\n`);

    if (arquivosDescartados.length > 0) {
        console.log('🗑️  Você pode deletar os seguintes PDFs do seu computador/repositório pois já possui uma versão melhor:');
        console.log('--------------------------------------------------');
        arquivosDescartados.forEach(arquivo => {
            // Arruma o path do arquivo de volta para usar barras corretas no Windows se necessário
            const caminhoFisico = path.normalize(arquivo);
            console.log(`Remove-Item "${caminhoFisico}"`);
        });
        console.log('--------------------------------------------------');
        console.log('💡 Dica: No PowerShell, você pode copiar e colar essas linhas de "Remove-Item" para apagar tudo de uma vez!');
    }

} catch (error) {
    console.error('❌ Ocorreu um erro ao limpar o catálogo:', error.message);
}