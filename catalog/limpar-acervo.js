const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'books.json');

// Mapa de títulos abreviados ou com nomes de arquivos crus para nomes editoriais completos
const MAPA_TITULOS_ESPECIFICOS = {
    'algoritmos- portugue╠és- cormen': {
        title: 'Algoritmos: Teoria e Prática (Edição em Português)',
        author: 'Thomas H. Cormen',
        category: 'Algoritmos e Estruturas de Dados',
        level: 'advanced'
    },
    'caelum-algoritmos-estruturas-dados-java-cs14': {
        title: 'Algoritmos e Estruturas de Dados em Java (Curso CS-14)',
        author: 'Caelum',
        category: 'Algoritmos e Estruturas de Dados',
        level: 'beginner'
    },
    '324976285-Fundamentos-da-programacao-pascal-C-C-java-1-pdf': {
        title: 'Fundamentos da Programação de Computadores (Pascal, C, C++ e Java)',
        author: 'Ana Fernanda Gomes Ascencio',
        category: 'Algoritmos e Estruturas de Dados',
        level: 'beginner'
    },
    'CURSO_WD_43_-_DESENVOLVIMENTO_WEB_COM_HT': {
        title: 'Desenvolvimento Web com HTML, CSS e JavaScript (Curso WD-43)',
        author: 'Caelum',
        category: 'Desenvolvimento Web & Front-end',
        level: 'beginner'
    },
    'HTML5_e_CSS3_com_farinha_e_pimenta': {
        title: 'HTML5 e CSS3 com Farinha e Pimenta',
        author: 'Diego Eis & Elcio Ferreira',
        category: 'Desenvolvimento Web & Front-end',
        level: 'beginner'
    },
    'Html5_e_css3_domine_a_web_do_futuro_fran (1)': {
        title: 'HTML5 e CSS3: Domine a Web do Futuro',
        author: 'Lucas Mazza (Casa do Código)',
        category: 'Desenvolvimento Web & Front-end',
        level: 'beginner'
    },
    'html5 e css3 domine a web do futuro - Casa do Codigo': {
        title: 'HTML5 e CSS3: Domine a Web do Futuro',
        author: 'Lucas Mazza (Casa do Código)',
        category: 'Desenvolvimento Web & Front-end',
        level: 'beginner'
    },
    'kotlin-com-android-crie-aplicativos-de-maneira-facil-e-divertida': {
        title: 'Kotlin com Android: Crie Aplicativos de Maneira Fácil e Divertida',
        author: 'Kassiano Resende (Casa do Código)',
        category: 'Mobile & Jogos',
        level: 'beginner'
    },
    'introducao-a-programacao-livro': {
        title: 'Introdução à Programação de Computadores',
        author: 'Acervo Acadêmico',
        category: 'Algoritmos e Estruturas de Dados',
        level: 'beginner'
    },
    'guia-markdown': {
        title: 'Guia Prático de Markdown: Documentação Limpa para Devs',
        author: 'Comunidade Open Source',
        category: 'Carreira e Habilidades',
        level: 'beginner'
    },
    'jquery-fundamentals': {
        title: 'jQuery Fundamentals: Guia Completo de Manipulação DOM',
        author: 'Rebecca Murphey',
        category: 'Desenvolvimento Web & Front-end',
        level: 'beginner'
    },
    'Linux-a-biblia-pt-br': {
        title: 'Linux: A Bíblia (Edição em Português)',
        author: 'Christopher Negus',
        category: 'DevOps',
        level: 'intermediary'
    },
    'Livro de Linux - A Bíblia': {
        title: 'Linux: A Bíblia (Edição em Português)',
        author: 'Christopher Negus',
        category: 'DevOps',
        level: 'intermediary'
    },
    'arduino_básico_Michael_McRoberts': {
        title: 'Arduino Básico: Projetos Práticos de Eletrônica',
        author: 'Michael McRoberts',
        category: 'Sistemas, Hardware & Redes',
        level: 'beginner'
    },
    'pythonoo': {
        title: 'Python Orientado a Objetos: Fundamentos e Prática',
        author: 'Acervo Python Brasil',
        category: 'Linguagens & Backend',
        level: 'beginner'
    },
    'phptherightway': {
        title: 'PHP: The Right Way (Boas Práticas Modernas em PHP)',
        author: 'Josh Lockhart & Comunidade PHP',
        category: 'Linguagens & Backend',
        level: 'intermediary'
    },
    'php': {
        title: 'Programação Web com PHP: Guia de Estudo',
        author: 'Acervo Técnico',
        category: 'Linguagens & Backend',
        level: 'beginner'
    },
    'Java_Programming': {
        title: 'Java Programming: Guia Completo da Linguagem',
        author: 'Wikibooks Open Textbook',
        category: 'Linguagens & Backend',
        level: 'intermediary'
    },
    'Python_Programming': {
        title: 'Python Programming: Guia Completo da Linguagem',
        author: 'Wikibooks Open Textbook',
        category: 'Linguagens & Backend',
        level: 'beginner'
    },
    'PythonTheCompleteManualDigital': {
        title: 'Python: The Complete Manual (Edição Digital)',
        author: 'Future Publishing',
        category: 'Linguagens & Backend',
        level: 'beginner'
    },
    'Design_Patterns': {
        title: 'Design Patterns: Padrões de Projeto Orientados a Objetos',
        author: 'Acervo Engenharia de Software',
        category: 'Padrões e Design de Software',
        level: 'advanced'
    },
    'Crypto101': {
        title: 'Crypto 101: Introdução Prática à Criptografia para Devs',
        author: 'Laurens Van Houtven (lvh)',
        category: 'Arquitetura de Software',
        level: 'intermediary'
    },
    'Algorithms': {
        title: 'Algorithms: Estruturas de Dados e Algoritmos Clássicos',
        author: 'Robert Sedgewick & Kevin Wayne',
        category: 'Algoritmos e Estruturas de Dados',
        level: 'advanced'
    },
    'Eloquent javascript': {
        title: 'Eloquent JavaScript: Uma Introdução Moderna à Programação',
        author: 'Marijn Haverbeke',
        category: 'Desenvolvimento Web & Front-end',
        level: 'beginner'
    },
    'JavaScript O Guia Definitivo_v2 (1)': {
        title: 'JavaScript: O Guia Definitivo',
        author: 'David Flanagan (O\'Reilly)',
        category: 'Desenvolvimento Web & Front-end',
        level: 'intermediary'
    },
    'Javascript - Cangaceiro JavaScript - Uma Aventura no Sertão da Programacao (1)': {
        title: 'Cangaceiro JavaScript: Uma Aventura no Sertão da Programação',
        author: 'Flávio Almeida (Casa do Código)',
        category: 'Desenvolvimento Web & Front-end',
        level: 'intermediary'
    },
    'Data Science do zero_ Primeiras - Joel Grus': {
        title: 'Data Science do Zero: Primeiras Regras com o Python',
        author: 'Joel Grus (O\'Reilly)',
        category: 'Data Science',
        level: 'beginner'
    },
    'Organização estruturada de computadores - Tanenbaum': {
        title: 'Organização Estruturada de Computadores',
        author: 'Andrew S. Tanenbaum',
        category: 'Sistemas, Hardware & Redes',
        level: 'intermediary'
    },
    'Livro de Python (Automatize tarefas maçantes)': {
        title: 'Automatize Tarefas Maçantes com Python: Programação Prática para Iniciantes',
        author: 'Al Sweigart',
        category: 'Linguagens & Backend',
        level: 'beginner'
    },
    'Livro de Python (desenvolvedores)': {
        title: 'Python para Desenvolvedores',
        author: 'Luiz Eduardo Borges',
        category: 'Linguagens & Backend',
        level: 'beginner'
    },
    'Python para Todos': {
        title: 'Python para Todos: Explorando Dados com Python 3',
        author: 'Charles R. Severance (Dr. Chuck)',
        category: 'Linguagens & Backend',
        level: 'beginner'
    },
    '(Arduino Descomplicado) Claudio Luis Vieira Oliveira_ Humberto Augusto Piovesana Zanetti - Arduino Descomplicado_ Como Elaborar Projetos de Eletrônica-Érica': {
        title: 'Arduino Descomplicado: Como Elaborar Projetos de Eletrônica',
        author: 'Claudio Luis V. Oliveira & Humberto A. P. Zanetti',
        category: 'Sistemas, Hardware & Redes',
        level: 'beginner'
    },
    'Arduino Descomplicado: Como Elaborar Projetos de Eletrônica': {
        title: 'Arduino Descomplicado: Como Elaborar Projetos de Eletrônica',
        author: 'Claudio Luis V. Oliveira & Humberto A. P. Zanetti',
        category: 'Sistemas, Hardware & Redes',
        level: 'beginner'
    },
    'John H. Davies-MSP430 Microcontroller Basics-Newnes': {
        title: 'MSP430 Microcontroller Basics',
        author: 'John H. Davies',
        category: 'Sistemas, Hardware & Redes',
        level: 'intermediary'
    },
    'John Lovine-PIC Microcontroller Project Book-McGraw-Hill': {
        title: 'PIC Microcontroller Project Book',
        author: 'John Iovine',
        category: 'Sistemas, Hardware & Redes',
        level: 'intermediary'
    },
    'Ebook em games': {
        title: 'Desenvolvimento de Games: Guia Prático de Criação',
        author: 'Acervo Comunitário',
        category: 'Mobile & Jogos',
        level: 'beginner'
    },
    'Node.js - Aplicações web real-tome com Node.js': {
        title: 'Node.js: Aplicações Web Real-Time',
        author: 'Caio Ribeiro Pereira (Casa do Código)',
        category: 'Linguagens & Backend',
        level: 'intermediary'
    },
    'A Startup Enxuta - Eric Ries': {
        title: 'A Startup Enxuta (The Lean Startup)',
        author: 'Eric Ries',
        category: 'Empresa e Cultura Organizacional',
        level: 'beginner'
    },
    'EBook - eMotion Studios - Como transformar sua ideia em startup em 4 passos': {
        title: 'Como Transformar sua Ideia em Startup em 4 Passos',
        author: 'eMotion Studios',
        category: 'Empresa e Cultura Organizacional',
        level: 'beginner'
    }
};

// Mapa para a série "NotesForProfessionals" (GoalKicker)
const MAPA_NOTES_PROFESSIONALS = {
    'Algorithms': { name: 'Algorithms', cat: 'Algoritmos e Estruturas de Dados' },
    'Android': { name: 'Android Development', cat: 'Mobile & Jogos' },
    'Angular2': { name: 'Angular 2+', cat: 'Desenvolvimento Web & Front-end' },
    'AngularJS': { name: 'AngularJS', cat: 'Desenvolvimento Web & Front-end' },
    'Bash': { name: 'Bash & Shell Scripting', cat: 'DevOps' },
    'C': { name: 'Linguagem C', cat: 'Linguagens & Backend' },
    'CPlusPlus': { name: 'C++', cat: 'Linguagens & Backend' },
    'CSharp': { name: 'C# (.NET)', cat: 'Linguagens & Backend' },
    'CSS': { name: 'CSS3 & Estilização Web', cat: 'Desenvolvimento Web & Front-end' },
    'DotNETFramework': { name: '.NET Framework', cat: 'Linguagens & Backend' },
    'EntityFramework': { name: 'Entity Framework ORM', cat: 'Banco de Dados & SQL' },
    'ExcelVBA': { name: 'Excel VBA & Automação', cat: 'Carreira e Habilidades' },
    'Git': { name: 'Git & Controle de Versão', cat: 'DevOps' },
    'Haskell': { name: 'Haskell & Programação Funcional', cat: 'Linguagens & Backend' },
    'Hibernate': { name: 'Hibernate & JPA', cat: 'Banco de Dados & SQL' },
    'HTML5Canvas': { name: 'HTML5 Canvas & Gráficos Web', cat: 'Desenvolvimento Web & Front-end' },
    'HTML5': { name: 'HTML5 Moderno', cat: 'Desenvolvimento Web & Front-end' },
    'iOS': { name: 'iOS & Swift/Objective-C', cat: 'Mobile & Jogos' },
    'Java': { name: 'Java', cat: 'Linguagens & Backend' },
    'JavaScript': { name: 'JavaScript', cat: 'Desenvolvimento Web & Front-end' },
    'jQuery': { name: 'jQuery', cat: 'Desenvolvimento Web & Front-end' },
    'Kotlin': { name: 'Kotlin', cat: 'Mobile & Jogos' },
    'LaTeX': { name: 'LaTeX & Escrita Científica', cat: 'Carreira e Habilidades' },
    'Linux': { name: 'Linux & Administração de Sistemas', cat: 'DevOps' },
    'MATLAB': { name: 'MATLAB & Computação Numérica', cat: 'Data Science' },
    'MicrosoftSQLServer': { name: 'Microsoft SQL Server (T-SQL)', cat: 'Banco de Dados & SQL' },
    'MongoDB': { name: 'MongoDB & NoSQL', cat: 'Banco de Dados & SQL' },
    'MySQL': { name: 'MySQL', cat: 'Banco de Dados & SQL' },
    'NodeJS': { name: 'Node.js', cat: 'Linguagens & Backend' },
    'ObjectiveC': { name: 'Objective-C', cat: 'Mobile & Jogos' },
    'OracleDatabase': { name: 'Oracle Database & PL/SQL', cat: 'Banco de Dados & SQL' },
    'Perl': { name: 'Perl', cat: 'Linguagens & Backend' },
    'PHP': { name: 'PHP', cat: 'Linguagens & Backend' },
    'PostgreSQL': { name: 'PostgreSQL', cat: 'Banco de Dados & SQL' },
    'PowerShell': { name: 'PowerShell', cat: 'DevOps' },
    'Python': { name: 'Python', cat: 'Linguagens & Backend' },
    'R': { name: 'Linguagem R & Estatística', cat: 'Data Science' },
    'ReactJS': { name: 'React.js', cat: 'Desenvolvimento Web & Front-end' },
    'ReactNative': { name: 'React Native', cat: 'Mobile & Jogos' }
};

function inferirCategoria(title, currentCat) {
    const t = title.toLowerCase();

    if (/\b(mysql|postgresql|oracle\s+database|plsql|pl\/sql|sql server|t-sql|mongodb|redis|banco de dados|hibernate|jpa|entity framework|elasticsearch)\b/i.test(t)) {
        if (!/data science|mineração|big data|machine learning|estatística/i.test(t)) {
            return 'Banco de Dados & SQL';
        }
    }

    if (currentCat === 'Outros' || currentCat === 'Padrões e Design de Software' || currentCat === 'Desenvolvimento Ágil' || currentCat === 'Banco de Dados & SQL') {
        if (/oracle certified associate|java se [78]/i.test(t)) {
            return 'Linguagens & Backend';
        }
        if (/\b(html5?|css3?|javascript|ecmascript|jquery|react\.?js|angular|front-?end|web mobile|meteor)\b/i.test(t) && !/react native|jogos/i.test(t)) {
            return 'Desenvolvimento Web & Front-end';
        }
        if (/\b(android|ios|iphone|ipad|windows phone|react native|kotlin com android|jogos|game|games)\b/i.test(t)) {
            return 'Mobile & Jogos';
        }
        if (/\b(python|java\b|javafx|jsf|cdi|grails|play framework|php|laravel|ruby|rspec|cucumber|c#|asp\.net|golang|programando em go|programação em c\b|linguagem c|c\+\+|haskell|perl|octave)\b/i.test(t) && !/design patterns|padrões de projeto|refatorando/i.test(t)) {
            return 'Linguagens & Backend';
        }
        if (/\b(arduino|msp430|pic microcontroller|microcontroller|sensors and transducers|analog and digital circuits|eletrônica|embedded|sistemas operacionais|windows|montagem|rede de computadores|arquitetura e organização de computadores|compiladores|compilladores|virtualbox)\b/i.test(t)) {
            return 'Sistemas, Hardware & Redes';
        }
        if (/\b(cálculo|calculo|computação quântica|computação gráfica)\b/i.test(t)) {
            return 'Algoritmos e Estruturas de Dados';
        }
        if (/\b(linux|shell script|bash|git|devops|node\.?js|google app engine)\b/i.test(t)) {
            return 'DevOps';
        }
        if (/\b(produtividade|mestre programador|direto ao ponto|excel|photoshop|lightroom|markdown)\b/i.test(t)) {
            return 'Carreira e Habilidades';
        }
        if (/orientação a objetos/i.test(t)) {
            return 'Padrões e Design de Software';
        }
    }

    if (/\b(msp430|analog and digital circuits|embedded systems)\b/i.test(t)) {
        return 'Sistemas, Hardware & Redes';
    }

    return currentCat === 'Outros' ? 'Carreira e Habilidades' : currentCat;
}

function inferirNivel(title, currentLevel) {
    const t = title.toLowerCase();
    if (/começando|primeiros passos|iniciante|introdução|introducao|básico|basico|do zero|for beginners|getting started|aprenda a programar|lógica de programação|logica de programacao|para todos|para leigos|descomplicado/i.test(t)) {
        return 'beginner';
    }
    if (/notes for professionals|guia prático|prático|na prática|eficaz|eficiente|domine|desenvolvimento web|orientação a objetos|aplicações|construa|criando|fundamentos/i.test(t)) {
        return 'intermediary';
    }
    return currentLevel || 'advanced';
}

function limparSufixosEditora(str) {
    return str
        .replace(/\s*-(?:Newnes|Apress|Make|Springer-Verlag New York|Addison-Wesley Professional|McGraw-Hill|Érica|O[_:]\s*Reilly Media)\s*(?:\(\d{4}\))?$/i, '')
        .replace(/\s*\(\d{4}\)\s*$/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function enriquecerLivro(book) {
    let rawTitle = (book.title || '').trim();
    let author = (book.author || 'Desconhecido').trim();
    let category = (book.category || 'Geral').trim();
    let level = book.level || 'intermediary';

    if (MAPA_TITULOS_ESPECIFICOS[rawTitle]) {
        const mapped = MAPA_TITULOS_ESPECIFICOS[rawTitle];
        return {
            ...book,
            title: mapped.title,
            author: mapped.author,
            category: mapped.category,
            level: mapped.level
        };
    }

    const notesMatch = rawTitle.match(/^([A-Za-z0-9]+)NotesForProfessionals$/i);
    if (notesMatch) {
        const key = notesMatch[1];
        const info = MAPA_NOTES_PROFESSIONALS[key] || { name: key, cat: category };
        return {
            ...book,
            title: `${info.name}: Notes for Professionals (Guia de Referência)`,
            author: 'GoalKicker.com',
            category: info.cat,
            level: 'intermediary'
        };
    }

    let cleanTitle = limparSufixosEditora(rawTitle)
        .replace(/\s*\(z-lib\.org\)\s*/gi, '')
        .replace(/\s*\(\d+\)\s*$/g, '')
        .replace(/_v\d+/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (MAPA_TITULOS_ESPECIFICOS[cleanTitle]) {
        const mapped = MAPA_TITULOS_ESPECIFICOS[cleanTitle];
        return {
            ...book,
            title: mapped.title,
            author: mapped.author,
            category: mapped.category,
            level: mapped.level
        };
    }

    if (/^Livro de /i.test(cleanTitle)) {
        cleanTitle = cleanTitle.replace(/^Livro de /i, 'Fundamentos de ');
        cleanTitle = cleanTitle.replace(/Compilladores/i, 'Compiladores');
        cleanTitle = cleanTitle.replace(/Montagtem/i, 'Montagem');
    }

    if (author === 'Desconhecido' || author === '???' || author === 'Acervo Comunitário') {
        if (/ - Casa do C[oó]digo$/i.test(cleanTitle)) {
            author = 'Casa do Código';
            cleanTitle = cleanTitle.replace(/ - Casa do C[oó]digo$/i, '').trim();
        } else if (/ - Caelum(?:,\s*(?:Curso\s*)?([A-Z0-9-]+))?$/i.test(cleanTitle)) {
            const m = cleanTitle.match(/ - Caelum(?:,\s*(?:Curso\s*)?([A-Z0-9-]+))?$/i);
            author = 'Caelum';
            cleanTitle = cleanTitle.replace(/ - Caelum(?:,\s*(?:Curso\s*)?[A-Z0-9-]+)?$/i, '').trim() + (m && m[1] ? ` — Curso ${m[1]}` : '');
        } else if (/\(([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Úa-zà-ú.]+)+)\)$/.test(cleanTitle)) {
            const m = cleanTitle.match(/\(([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Úa-zà-ú.]+)+)\)$/);
            if (m && !/Edição|Volume|Automatize|desenvolvedores/i.test(m[1])) {
                author = m[1].trim();
                cleanTitle = cleanTitle.replace(/\s*\([^)]+\)$/, '').trim();
            }
        } else if (/^(?:\([^)]+\)\s*)?([A-ZÀ-Ú][a-zà-úA-ZÀ-Ú.,_\s]+?)\s*(?:\(Auth\.\)|\(auth\.\))?\s*-\s*(.+)$/.test(cleanTitle)) {
            const parts = cleanTitle.split(' - ');
            const candidateAuthor = parts[0].replace(/^\([^)]+\)\s*/, '').replace(/\(auth\.\)/ig, '').replace(/_/g, ', ').trim();
            if (
                /^(Paul Deitel|Luiz Eduardo Borges|Diego Martins de Pinho|Guilherme Silveira|Aurélio Marinho Jargas|Everton Coimbra|John Walkenbach|Michael Barr|Michael J Pont|Michael McRoberts|Ian Sinclair|Adrian Fernandez|Albert Paul Malvino|Jerry Luecke|Kenneth Lewenhagen|Cody Lindey|Manuel Jiménez|Dan Harres|Massimo Banzi|Chris Nagy)/i.test(candidateAuthor)
            ) {
                author = candidateAuthor;
                cleanTitle = limparSufixosEditora(parts.slice(1).join(' - ').replace(/_/g, ': ').trim());
            }
        } else if (/^MundoJ/i.test(cleanTitle)) {
            author = 'Revista MundoJ';
            cleanTitle = cleanTitle.replace(/^MundoJ\s*-?\s*/i, '').trim();
        } else if (/^Apostila de /i.test(cleanTitle)) {
            author = 'Material Didático Aberto';
        }
    }

    cleanTitle = limparSufixosEditora(cleanTitle);

    if (author === 'Desconhecido') {
        if (/Casa do C[oó]digo/i.test(book.path)) {
            author = 'Casa do Código';
        } else {
            author = 'Acervo Comunitário';
        }
    }

    category = inferirCategoria(cleanTitle, category);
    level = inferirNivel(cleanTitle, level);

    return {
        ...book,
        title: cleanTitle,
        author,
        category,
        level
    };
}

try {
    const rawData = fs.readFileSync(catalogPath, 'utf-8');
    const data = JSON.parse(rawData);

    const dominiosExternos = ['amazon.', 'casadocodigo.com.br', 'refactoring.guru', 'frontendinterviewhandbook.com', 'techinterviewhandbook.org'];
    const titulosProcessados = new Set();

    let totalInicial = 0;
    let removidosLink = 0;
    let removidosDuplicata = 0;

    const normalizar = (t) => t.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/casa do codigo/g, '')
        .replace(/[^a-z0-9]/g, '');

    const resultado = data.map(repo => {
        const livrosNoRepo = repo.livros.length;
        totalInicial += livrosNoRepo;

        const livrosLimpos = [];

        for (const rawBook of repo.livros) {
            const pathLower = (rawBook.path || '').toLowerCase();

            if (dominiosExternos.some(d => pathLower.includes(d)) || pathLower === '???') {
                removidosLink++;
                continue;
            }

            const book = enriquecerLivro(rawBook);
            const tituloNorm = normalizar(book.title);

            if (titulosProcessados.has(tituloNorm)) {
                removidosDuplicata++;
                continue;
            }

            titulosProcessados.add(tituloNorm);
            livrosLimpos.push(book);
        }

        return {
            'Repositoy-Name': repo['Repositoy-Name'] || repo['Repository-Name'],
            'livros': livrosLimpos
        };
    });

    fs.writeFileSync(catalogPath, JSON.stringify(resultado, null, 2));

    console.log('--- 📊 RELATÓRIO DE HIGIENIZAÇÃO DO ACERVO ---');
    console.log(`📚 Total de livros analisados: ${totalInicial}`);
    console.log(`❌ Removidos por links externos/quebrados: ${removidosLink}`);
    console.log(`👯 Removidos por duplicatas exatas: ${removidosDuplicata}`);
    console.log(`✅ Total de livros limpos e categorizados no catálogo: ${totalInicial - (removidosLink + removidosDuplicata)}`);
} catch (e) {
    console.error('❌ Erro crítico no processamento:', e.message);
}