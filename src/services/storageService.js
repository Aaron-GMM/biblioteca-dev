export function getBookUrl(bookPath, source, repo = 'BibliotecaDev') {
    // 1. Se for um link de um site de vendas/externo (ex: Amazon), devolve direto
    if (source === 'external_url' && !bookPath.includes('github.com')) {
        return bookPath;
    }

    let finalOwner = 'Aaron-GMM';
    let finalRepo = repo;
    let finalBranch = 'main'; // Seu fork usa main
    let finalPath = bookPath;

    // 2. Se o caminho salvo no JSON for uma URL completa do GitHub...
    if (bookPath.includes('github.com')) {
        // ...nós recortamos tudo o que vem depois da pasta "main" ou "master"
        const parts = bookPath.split(/main\/|master\//);
        if (parts.length > 1) {
            finalPath = parts[1]; // Aqui sobra só: "Data Science do zero.pdf"
        }
        
        // E também garantimos que pegamos o nome do repositório certo da URL
        const urlMatch = bookPath.match(/github\.com\/[^\/]+\/([^\/]+)/);
        if (urlMatch) {
            finalRepo = urlMatch[1];
        }
    }

    // 3. Prevenção contra o Bug da Dupla Codificação ("%2520")
    try {
        // Primeiro, traduzimos qualquer código estranho de volta para texto normal (espaços, acentos)
        finalPath = decodeURIComponent(finalPath);
    } catch(e) {
        // Ignora se já estiver normal
    }
    
    // Tira possíveis barras ("/") do começo do texto
    finalPath = finalPath.replace(/^\//, '');
    
    // Agora sim, codificamos para o formato de URL do jeito certo, UMA ÚNICA VEZ
    const encodedPath = encodeURI(finalPath);

    // 4. Montamos a URL direta para o PDF bruto
    return `https://raw.githubusercontent.com/${finalOwner}/${finalRepo}/${finalBranch}/${encodedPath}`;
}