
# 📚 BibliotecaDev — Leitura Online Segura

A **BibliotecaDev** é uma plataforma de código aberto projetada para facilitar o acesso gratuito e seguro a conteúdos educacionais de alta qualidade na área de tecnologia.

## 🎯 Por que esta iniciativa?

A principal motivação deste projeto é a **democratização do acesso ao conteúdo educacional**. Sabemos que muitos estudantes e profissionais enfrentam barreiras para adquirir materiais técnicos de qualidade. 

Além disso, a plataforma resolve um problema crítico de segurança: **o perigo de vírus e softwares maliciosos**. Ao centralizar materiais em um ambiente controlado e de código aberto, eliminamos a necessidade de os usuários navegarem em sites de procedência duvidosa ou clicarem em links suspeitos para baixar PDFs. Aqui, o material está disponível para leitura direta, de forma limpa e protegida.

## 🌐 Repositórios de Conteúdo

Nosso acervo é alimentado por curadorias colaborativas de confiança. Você pode encontrar a base dos nossos livros nos seguintes repositórios:
* **KAYOKG/BibliotecaDev**: [https://github.com/KAYOKG/BibliotecaDev](https://github.com/KAYOKG/BibliotecaDev)
* **Juerda/Engenharia-de-Software-Livros-em-PDF**: [https://github.com/Juerda/Engenharia-de-Software-Livros-em-PDF](https://github.com/Juerda/Engenharia-de-Software-Livros-em-PDF)

## 🤝 Como Colaborar (Padrão de Segurança)

Este é um projeto **Open Source** e aceitamos colaborações! No entanto, para evitar que o projeto seja quebrado ou que scripts maliciosos sejam injetados, seguimos um processo rígido de padronização:

1.  **Fork e Branch**: Crie um fork do projeto e trabalhe em uma branch específica para sua alteração.
2.  **Padronização do JSON**: Todas as novas entradas de livros devem seguir rigorosamente a estrutura definida no arquivo `catalog/books.json`.
3.  **Verificação de Links**: Não são aceitos links para executáveis ou sites externos que exijam cadastro. Apenas links diretos para repositórios GitHub ou fontes educacionais oficiais.
4.  **Revisão de Código (Code Review)**: Todo *Pull Request* passará por uma análise manual dos mantenedores para garantir que nenhuma lógica de script prejudicial foi adicionada aos arquivos `src/app/`.

## 💻 Explicação Simples do Código

O projeto foi construído de forma modular para ser leve e rápido:

* **SPA (Single Page Application)**: O site funciona em uma única página. O arquivo `router.js` é o responsável por trocar o que você vê na tela (Home ou Leitor) sem precisar recarregar o navegador.
* **Catálogo Dinâmico**: A lista de livros não está "travada" no HTML. O arquivo `main.js` busca as informações de um arquivo `books.json`, organiza-as por categoria e renderiza os cards automaticamente.
* **Visualizador de PDF**: Utilizamos a biblioteca `pdf.js` integrada ao `pdfViewer.js` para renderizar os livros diretamente no navegador, garantindo que o usuário não precise baixar arquivos para ler.
* **Busca Inteligente**: Existe um sistema de busca com `debounce` (um temporizador) que filtra títulos, autores ou categorias enquanto você digita, sem travar a interface.

---

### Estrutura de Arquivos Principal:
* `index.html`: Ponto de entrada e carregamento de fontes e scripts base.
* `src/app/main.js`: Lógica principal, carregamento do catálogo e gerenciamento de estados.
* `src/app/router.js`: Gerencia a navegação entre a Home e o Leitor.
* `src/components/`: Contém as partes visuais reaproveitáveis (Cards, Layout, SearchBar).