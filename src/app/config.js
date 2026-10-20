export const APP_CONFIG = {
    name: 'BibliotecaDev',
    tagline: 'Biblioteca aberta para estudo em tecnologia',
    catalogUrl: '../catalog/books.json',
    defaultOwner: 'Aaron-GMM',
    fallbackOwners: ['KAYOKG', 'Juerda', 'orlandojsjunior'],
    defaultBranch: 'main',
    storageKeys: {
        progressPrefix: 'bibliotecadev_progress_',
        shelf: 'bibliotecadev_shelf_v1',
        notesPrefix: 'bibliotecadev_notes_',
        bookmarksPrefix: 'bibliotecadev_bookmarks_',
        readerTheme: 'bibliotecadev_reader_theme'
    }
};

export const LEVEL_LABELS = {
    beginner: { label: 'Iniciante', icon: 'seedling', desc: 'Ideal para primeiros passos' },
    intermediary: { label: 'Intermediário', icon: 'trending_up', desc: 'Prática e aprofundamento' },
    advanced: { label: 'Avançado', icon: 'psychology', desc: 'Domínio técnico e arquitetura' }
};

// Paleta Flat Design Sóbria e Fosca (Sem Neon e Sem Gradientes)
export const CATEGORY_THEMES = {
    'Algoritmos e Estruturas de Dados': {
        accent: '#8aa8bd',
        bg: '#21272d',
        gradient: '#21272d',
        spine: '#2c353d',
        icon: 'account_tree',
        collection: 'Ciência da Computação'
    },
    'Arquitetura de Software': {
        accent: '#a69ab8',
        bg: '#25232b',
        gradient: '#25232b',
        spine: '#322f3a',
        icon: 'architecture',
        collection: 'Arquitetura & Engenharia'
    },
    'Padrões e Design de Software': {
        accent: '#b59ca9',
        bg: '#272226',
        gradient: '#272226',
        spine: '#362f34',
        icon: 'category',
        collection: 'Design de Software'
    },
    'Desenvolvimento Web & Front-end': {
        accent: '#c7aa7e',
        bg: '#28251f',
        gradient: '#28251f',
        spine: '#38332a',
        icon: 'web',
        collection: 'Web & Front-end'
    },
    'Linguagens & Backend': {
        accent: '#86ae9e',
        bg: '#202825',
        gradient: '#202825',
        spine: '#2b3632',
        icon: 'terminal',
        collection: 'Linguagens & Back-end'
    },
    'Banco de Dados & SQL': {
        accent: '#8da3b8',
        bg: '#21262c',
        gradient: '#21262c',
        spine: '#2d343c',
        icon: 'database',
        collection: 'Bancos de Dados'
    },
    'Data Science': {
        accent: '#84ada9',
        bg: '#202828',
        gradient: '#202828',
        spine: '#2b3636',
        icon: 'monitoring',
        collection: 'Ciência de Dados'
    },
    'DevOps': {
        accent: '#c29880',
        bg: '#28231f',
        gradient: '#28231f',
        spine: '#38302b',
        icon: 'cloud_sync',
        collection: 'DevOps & Linux'
    },
    'Mobile & Jogos': {
        accent: '#bd939d',
        bg: '#282124',
        gradient: '#282124',
        spine: '#382e32',
        icon: 'smartphone',
        collection: 'Mobile & Games'
    },
    'Sistemas, Hardware & Redes': {
        accent: '#9ba4ae',
        bg: '#232629',
        gradient: '#232629',
        spine: '#303438',
        icon: 'memory',
        collection: 'Sistemas & Hardware'
    },
    'Desenvolvimento Ágil': {
        accent: '#92ad91',
        bg: '#212721',
        gradient: '#212721',
        spine: '#2d362d',
        icon: 'sprint',
        collection: 'Métodos Ágeis'
    },
    'Metodologias Ágeis Avançadas': {
        accent: '#92ad91',
        bg: '#212721',
        gradient: '#212721',
        spine: '#2d362d',
        icon: 'sync_saved_locally',
        collection: 'Agilidade em Escala'
    },
    'Carreira e Habilidades': {
        accent: '#c7ae85',
        bg: '#27241e',
        gradient: '#27241e',
        spine: '#363229',
        icon: 'auto_stories',
        collection: 'Carreira & Estudo'
    },
    'Liderança e Gestão de Equipe': {
        accent: '#bf9891',
        bg: '#282220',
        gradient: '#282220',
        spine: '#382f2c',
        icon: 'groups',
        collection: 'Liderança Técnica'
    },
    'Empresa e Cultura Organizacional': {
        accent: '#ba9a8e',
        bg: '#272220',
        gradient: '#272220',
        spine: '#362f2c',
        icon: 'domain',
        collection: 'Cultura & Produto'
    },
    'Entrevista e Preparação para Programação': {
        accent: '#9aa2bd',
        bg: '#22242a',
        gradient: '#22242a',
        spine: '#2f323a',
        icon: 'workspace_premium',
        collection: 'Preparação Técnica'
    }
};

export const TECH_BADGES = [
    { regex: /\b(python|django|flask)\b/i, tag: 'Python', icon: 'code', color: '#93b4c8' },
    { regex: /\b(javascript|ecmascript|js\b|jquery)\b/i, tag: 'JavaScript', icon: 'javascript', color: '#d4b483' },
    { regex: /\b(react\s*native)\b/i, tag: 'React Native', icon: 'phone_iphone', color: '#93b4c8' },
    { regex: /\b(react\.?js|react\b)\b/i, tag: 'React', icon: 'widgets', color: '#93b4c8' },
    { regex: /\b(angular\w*)\b/i, tag: 'Angular', icon: 'change_history', color: '#cca29b' },
    { regex: /\b(node\.?js|node\b|mean\b)\b/i, tag: 'Node.js', icon: 'dns', color: '#9ab899' },
    { regex: /\b(html5?|css3?)\b/i, tag: 'HTML & CSS', icon: 'palette', color: '#cfa388' },
    { regex: /\b(java\b|javafx|jsf|jpa|hibernate|spring|grails|play framework|cdi)\b/i, tag: 'Java', icon: 'coffee', color: '#cfa388' },
    { regex: /\b(kotlin)\b/i, tag: 'Kotlin', icon: 'android', color: '#b5a8c9' },
    { regex: /\b(c#|csharp|\.net|asp\.net|entity framework)\b/i, tag: 'C# & .NET', icon: 'terminal', color: '#b5a8c9' },
    { regex: /\b(php\w*|laravel)\b/i, tag: 'PHP', icon: 'php', color: '#a3acc9' },
    { regex: /\b(ruby|rails|rspec|cucumber)\b/i, tag: 'Ruby', icon: 'diamond', color: '#c99da8' },
    { regex: /\b(golang|programando em go)\b/i, tag: 'Go', icon: 'speed', color: '#8cb8b4' },
    { regex: /\b(c\+\+|cplusplus|linguagem c\b|programação em c\b|embedded c\b)\b/i, tag: 'C / C++', icon: 'memory', color: '#94adc4' },
    { regex: /\b(linux|ubuntu|bash|shell script)\b/i, tag: 'Linux & Shell', icon: 'terminal', color: '#d4b88c' },
    { regex: /\b(git|github)\b/i, tag: 'Git', icon: 'commit', color: '#cfa388' },
    { regex: /\b(docker|kubernetes|devops|aws|cloud)\b/i, tag: 'DevOps', icon: 'cloud_done', color: '#94adc4' },
    { regex: /\b(sql|mysql|postgresql|oracle|plsql|mongodb|redis)\b/i, tag: 'Banco de Dados', icon: 'database', color: '#94adc4' },
    { regex: /\b(android)\b/i, tag: 'Android', icon: 'android', color: '#9ab899' },
    { regex: /\b(ios|iphone|ipad|objective-c|swift)\b/i, tag: 'iOS', icon: 'phone_iphone', color: '#a3adb8' },
    { regex: /\b(arduino|msp430|pic\b|eletrônica)\b/i, tag: 'Eletrônica', icon: 'developer_board', color: '#8cb8b4' },
    { regex: /\b(scrum|agile|ágil|kanban|lean|xp|extreme programming|tdd|bdd)\b/i, tag: 'Agilidade', icon: 'sprint', color: '#9ab899' },
    { regex: /\b(clean|limpo|arquitetura|solid|refatoração|refatorando|design patterns|padrões de projeto)\b/i, tag: 'Engenharia', icon: 'auto_awesome', color: '#b5a8c9' },
    { regex: /\b(algoritmos|algorithms|estruturas de dados|cálculo|calculo)\b/i, tag: 'Algoritmos', icon: 'hub', color: '#93b4c8' }
];

// Trilhas de estudo com "Primeiros Passos" integrado como a primeira aba
export const STUDY_TRAILS = [
    {
        id: 'primeiros-passos',
        title: 'Primeiros Passos',
        icon: 'rocket_launch',
        color: '#d4a373',
        keywords: ['Entendendo Algoritmos', 'Lógica de programação', 'HTML5 e CSS3: Domine a Web', 'Python - Escreva seus primeiros programas', 'Começando com o Linux', 'Introdução à Programação']
    },
    {
        id: 'fundamentos',
        title: 'Base & Algoritmos',
        icon: 'school',
        color: '#93b4c8',
        keywords: ['Algoritmos - Teoria e Prática', 'But How Do it Know', 'Fundamentos da Programação', 'Organização Estruturada de Computadores', 'Estruturas de dados e algoritmos com JavaScript']
    },
    {
        id: 'web-fullstack',
        title: 'Desenvolvimento Web',
        icon: 'code_blocks',
        color: '#d4b483',
        keywords: ['Eloquent JavaScript', 'JavaScript: O Guia Definitivo', 'Primeiros passos com React', 'Cangaceiro JavaScript', 'Node.js: Aplicações Web Real-Time']
    },
    {
        id: 'engenharia-clean',
        title: 'Código Limpo & Arquitetura',
        icon: 'architecture',
        color: '#b5a8c9',
        keywords: ['Código limpo', 'Arquitetura Limpa', 'O Programador Pragmático', 'Refatoração - Aperfeiçoando', 'Trabalho Eficaz com Código Legado']
    },
    {
        id: 'python-dados',
        title: 'Python & Dados',
        icon: 'query_stats',
        color: '#8fb9a8',
        keywords: ['Automatize Tarefas Maçantes com Python', 'Python para Todos', 'Data Science do Zero', 'Estatística - O que é', 'PostgreSQL - Banco de dados']
    },
    {
        id: 'devops-linux',
        title: 'Linux, Git & DevOps',
        icon: 'terminal',
        color: '#cfa388',
        keywords: ['Controlando versões com Git', 'Shell Script Profissional', 'DevOps na prática', 'Caixa de Ferramentas DevOps', 'Linux: A Bíblia']
    }
];
