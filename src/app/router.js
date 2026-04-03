export const router = {
    // Muda a URL no navegador
    navigate: (hashPath) => {
        window.location.hash = hashPath;
    },

    // Inicia o "escutador" de mudanças na URL
    init: (routes) => {
        const handleRouteChange = () => {
            // Pega o hash atual (ex: #reader?book=abc) ou vai para #home
            const hash = window.location.hash || '#home';
            
            // Separa a rota (path) dos parâmetros (queryString)
            const [path, queryString] = hash.split('?');
            
            // Facilita pegar parâmetros como ?book=...
            const params = new URLSearchParams(queryString);

            // Verifica se a rota existe no nosso dicionário de rotas
            const routeAction = routes[path];
            
            if (routeAction) {
                routeAction(params); // Executa a função da página
            } else {
                console.error('Rota não encontrada:', path);
                if (routes['#404']) routes['#404'](); // Página de erro
            }
        };

        // Ouve o evento nativo do navegador de "voltar/avançar" e mudança de hash
        window.addEventListener('hashchange', handleRouteChange);
        
        // Dispara a rota inicial logo que a página carrega
        handleRouteChange();
    }
};