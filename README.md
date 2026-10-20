#  BibliotecaDev — Leitura e Estudo em Tecnologia

A **BibliotecaDev** é uma aplicação web de código aberto (*Open Source*) que funciona como uma biblioteca digital e ambiente completo de estudos para estudantes, desenvolvedores e entusiastas de tecnologia.

---

##  O que é a BibliotecaDev?

A **BibliotecaDev** não é apenas uma lista de links: ela é uma **plataforma interativa de leitura e gestão de estudos** que roda 100% no navegador (sem necessidade de cadastro ou backend). 

A aplicação reúne um acervo curado com **mais de 400 livros, apostilas e guias técnicos** em português e inglês — abrangendo desde lógica de programação e algoritmos até engenharia de software, arquitetura, ciência de dados e DevOps — e oferece um leitor de PDF integrado com ferramentas pensadas para quem estuda programação no dia a dia.

##  Por que esta iniciativa?

A principal motivação deste projeto é a **democratização do acesso ao conteúdo educacional**. Sabemos que muitos estudantes e profissionais enfrentam barreiras para adquirir materiais técnicos de qualidade.

Além disso, a plataforma resolve um problema crítico de segurança: **o perigo de vírus e softwares maliciosos**. Ao centralizar materiais em um ambiente controlado e de código aberto, eliminamos a necessidade de os usuários navegarem em sites de procedência duvidosa ou clicarem em links suspeitos para baixar PDFs. Aqui, o material está disponível para leitura direta no navegador, de forma limpa, rápida e protegida.

---

##  Funcionalidades da Plataforma

###  Descoberta e Organização do Acervo
* **Catálogo Categorizado (+400 obras):** Navegação dividida por áreas técnicas (*Algoritmos, Arquitetura de Software, Desenvolvimento Web, Linguagens & Backend, Banco de Dados, Data Science, DevOps, Mobile, Agilidade, Carreira*, entre outras).
* **Trilhas de Estudo Guiadas:** Seleção de livros recomendados na página inicial organizada por objetivo (*Primeiros Passos, Base & Algoritmos, Desenvolvimento Web, Código Limpo & Arquitetura, Python & Dados, Linux & DevOps*).
* **Filtro por Nível de Dificuldade:** Classificação dos materiais em **Iniciante**, **Intermediário** e **Avançado**, além de ordenação por título, autor ou nível.
* **Busca Inteligente em Tempo Real:** Pesquisa rápida com *debounce* e normalização de acentos que filtra por título, autor, categoria ou tecnologia (ex.: *Python, React, Java, SQL, Linux*).
* **Sorteio de Livro Iniciante:** Botão de ação rápida para quem está começando e quer uma recomendação imediata de leitura introdutória.

### Minha Estante e Progresso Pessoal
* **Continue de Onde Parou:** Histórico automático que salva a página exata e a porcentagem de progresso de cada livro lido.
* **Minha Estante de Estudos:** Organização pessoal dividida em três abas:
  * **Lendo Agora:** Livros com leitura em andamento e barra de progresso.
  * **Quero Ler:** Lista de livros favoritados/salvos para estudar depois.
  * **Concluídos:** Registro de obras finalizadas pelo estudante.
* **Persistência Local (`localStorage`):** Todos os seus dados de progresso, estante e anotações ficam salvos diretamente no seu navegador, com total privacidade.

###  Leitor de Estudos Integrado
* **Modos de Conforto Visual:** Alterne a renderização do PDF entre **Modo Original (Claro)**, **Modo Sépia (Leitura Quente)** e **Modo Noturno (Escuro)** para reduzir o cansaço visual.
* **Caderno de Anotações por Página:** Crie resumos, insights e lembretes vinculados à página exata que está lendo e **exporte todas as suas notas em formato Markdown (`.md`)**.
* **Marcadores de Página & Sumário:** Marque páginas importantes com um clique (ou atalho `B`) e navegue diretamente pelos capítulos do PDF quando disponíveis.
* **Timer Pomodoro Integrado:** Cronômetro de foco de 25 minutos embutido na barra superior do leitor para manter o ritmo de estudo.
* **Controles de Visualização e Atalhos:** Controle de zoom (`+` / `-`), ajuste à largura ou tela inteira, modo Tela Cheia (`F`) com ocultação automática de barras e navegação pelo teclado (`⬅` `➡`, `B`, `N`, `Esc`).

---

##  Nota de Atualização da Interface (Flat Design & Tipografia Poppins)

A interface da **BibliotecaDev** passou por uma reformulação visual focada em **simplicidade, legibilidade e conforto para longas sessões de leitura**:

* **Nova Tipografia (`Poppins`):** Toda a interface agora utiliza a fonte geométrica **Poppins** (combinada à `JetBrains Mono` para indicadores numéricos e cronômetro), proporcionando títulos mais nítidos, melhor hierarquia visual e leitura agradável em qualquer resolução.
* **Estética Flat Design & Clean:**
  * **Sem Cores Neon:** A paleta foi desenhada com tons foscos, sóbrios e de baixa saturação, evitando contrastes agressivos ou cores neon que causam fadiga ocular.
  * **Superfícies Planas e Limpas:** Remoção de gradientes 3D, sombras pesadas (*drop shadows*) e efeitos de vidro (*glassmorphism*), adotando blocos sólidos bem delimitados por bordas sutis de `1px`.
  * **Capas Editoriais Minimalistas:** Os cards de livros agora exibem capas planas categorizadas por cor e tag de tecnologia, mantendo a identidade visual limpa e rápida de escanear.
* **Desenvolvimento com Auxílio de Agente de IA:** A evolução e o redesign da interface do projeto foram desenvolvidos com a ajuda do agente de IA **Antigravity** (Google DeepMind), utilizando o modelo **Gemini 4 Argon**.

---

##  Repositórios de Conteúdo

Nosso acervo é alimentado por curadorias colaborativas de confiança. Você pode encontrar a base dos nossos livros nos seguintes repositórios:
* **KAYOKG/BibliotecaDev**: [https://github.com/KAYOKG/BibliotecaDev](https://github.com/KAYOKG/BibliotecaDev)
* **Juerda/Engenharia-de-Software-Livros-em-PDF**: [https://github.com/Juerda/Engenharia-de-Software-Livros-em-PDF](https://github.com/Juerda/Engenharia-de-Software-Livros-em-PDF)

## Como Colaborar 

Este é um projeto **Open Source** e aceitamos colaborações! Para evitar que o projeto seja quebrado ou que scripts maliciosos sejam injetados, seguimos um processo rígido de padronização:

1. **Fork e Branch**: Crie um fork do projeto e trabalhe em uma branch específica para sua alteração.
2. **Padronização do JSON**: Todas as novas entradas de livros devem seguir rigorosamente a estrutura definida no arquivo `catalog/books.json`.
3. **Verificação de Links**: Não são aceitos links para executáveis ou sites externos que exijam cadastro. Apenas links diretos para repositórios GitHub ou fontes educacionais oficiais.
4. **Revisão de Código (Code Review)**: Todo *Pull Request* passará por uma análise manual dos mantenedores para garantir que nenhuma lógica de script prejudicial foi adicionada aos arquivos `src/`.

##  Arquitetura do Código

O projeto foi construído de forma modular em **Vanilla JavaScript (ES Modules)** para ser leve, seguro e sem dependências desnecessárias:

* `public/index.html`: Ponto de entrada da aplicação e carregamento da tipografia **Poppins**, ícones e `pdf.js`.
* `src/app/main.js` & `src/app/router.js`: Gerenciamento de rotas SPA (*Single Page Application*), estado global e eventos da interface.
* `src/app/config.js`: Configurações gerais, trilhas de estudo e paleta de cores Flat Design por categoria.
* `src/services/`: Serviços de catálogo (`catalogService.js`), resolução de URLs do GitHub (`githubService.js`) e persistência local de estante, notas e temas (`storageService.js`).
* `src/pages/` & `src/components/`: Componentes visuais reutilizáveis (`Layout`, `BookCard`, `CategoryList`, `SearchBar`, `ReaderControls`) e páginas (`HomePage`, `CategoryPage`, `ReaderPage`).
* `src/reader/`: Motor de visualização de PDF (`pdfViewer.js`) e rastreamento automático de páginas lidas (`progressTracker.js`).
* `src/styles/`: Folhas de estilo baseadas em **Flat Design** (`global.css` e `reader.css`).
