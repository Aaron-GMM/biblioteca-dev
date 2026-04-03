const fs = require('fs');

try {
    const rawData = fs.readFileSync('books.json', 'utf-8');
    const data = JSON.parse(rawData);

    const dominiosExternos = ['amazon.', 'casadocodigo.com.br', 'refactoring.guru', 'frontendinterviewhandbook.com', 'techinterviewhandbook.org'];
    const titulosProcessados = new Set();
    
    // Contadores para o relatório
    let totalInicial = 0;
    let removidosLink = 0;
    let removidosDuplicata = 0;

    const normalizar = (t) => t.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '');

    console.log('--- 📋 LOG DE LIMPEZA ---');

    const resultado = data.map(repo => {
        const livrosNoRepo = repo.livros.length;
        totalInicial += livrosNoRepo;

        const livrosLimpos = repo.livros.filter(book => {
            const pathLower = book.path.toLowerCase();
            const tituloNorm = normalizar(book.title);

            // Validação 1: Links Externos/Lojas
            const ehExterno = dominiosExternos.some(d => pathLower.includes(d));
            if (ehExterno) {
                console.log(`[LINK EXTERNO] Removido: ${book.title}`);
                removidosLink++;
                return false;
            }

            // Validação 2: Duplicatas (Global)
            if (titulosProcessados.has(tituloNorm)) {
                console.log(`[DUPLICATA] Removido: ${book.title} (Já existe em outro repositório ou pasta)`);
                removidosDuplicata++;
                return false;
            }

            titulosProcessados.add(tituloNorm);
            return true;
        });

        return {
            "Repositoy-Name": repo["Repositoy-Name"],
            "livros": livrosLimpos
        };
    });

    // Gravação do arquivo
    fs.writeFileSync('books-limpo.json', JSON.stringify(resultado, null, 2));

    // Exibição do Relatório Final
    console.log('\n--- 📊 RELATÓRIO FINAL ---');
    console.log(`📚 Total de livros analisados: ${totalInicial}`);
    console.log(`❌ Removidos por serem links de lojas/externos: ${removidosLink}`);
    console.log(`👯 Removidos por serem duplicatas: ${removidosDuplicata}`);
    console.log(`✅ Total de livros restantes: ${totalInicial - (removidosLink + removidosDuplicata)}`);
    console.log('--------------------------');
    console.log('💾 Arquivo "books-limpo.json" salvo com sucesso.');

} catch (e) {
    console.error('❌ Erro crítico no processamento:', e.message);
}