# Instruções de Deploy do Frontend (React) no Netlify

Este guia detalha como você pode fazer o deploy do frontend da sua aplicação de Agenda DJ (desenvolvida em React com Vite) no Netlify. O Netlify é uma plataforma excelente para hospedar aplicações frontend estáticas e Single Page Applications (SPAs) como a sua.

## Pré-requisitos

*   Sua conta no GitHub com o projeto `dj_agenda_github` (que contém as pastas `frontend` e `backend`) já enviado.
*   Uma conta no Netlify (você pode criar uma gratuitamente em [netlify.com](https://www.netlify.com/)).

## Passo a Passo para o Deploy no Netlify

1.  **Faça Login no Netlify:**
    *   Acesse [netlify.com](https://www.netlify.com/) e faça login na sua conta. Você pode usar sua conta do GitHub para um login rápido e fácil.

2.  **Importar um Novo Projeto do Git:**
    *   No painel de controle do Netlify, clique em "Add new site" (Adicionar novo site) e selecione "Import an existing project" (Importar um projeto existente).

3.  **Conectar ao seu Provedor Git:**
    *   Escolha "GitHub" (ou o provedor Git onde seu código está hospedado).
    *   O Netlify pedirá permissão para acessar seus repositórios. Autorize o Netlify a acessar o repositório `dj_agenda_github`.

4.  **Escolher o Repositório:**
    *   Na lista de repositórios, selecione `dj_agenda_github`.

5.  **Configurar as Opções de Build:**
    *   O Netlify tentará detectar automaticamente as configurações do seu projeto React/Vite. Verifique se as seguintes configurações estão corretas:
        *   **Owner:** Seu nome de usuário do GitHub.
        *   **Repository:** `dj_agenda_github`.
        *   **Branch to deploy:** `main` (ou `master`, dependendo do nome do seu branch principal no GitHub).
        *   **Base directory:** `frontend/` (Isso é **muito importante**! Você precisa informar ao Netlify que o código do frontend está dentro da pasta `frontend` do seu repositório).
        *   **Build command:** `npm run build` (ou `yarn build` se você usa yarn).
        *   **Publish directory:** `dist` (Esta é a pasta onde o Vite coloca os arquivos de build).

6.  **Adicionar Variáveis de Ambiente (Opcional, mas Recomendado):**
    *   Se o seu frontend precisar se comunicar com o backend (e ele precisa!), você precisará informar a URL do seu backend ao frontend.
    *   No Netlify, antes de clicar em "Deploy site", clique em "Show advanced" (Mostrar avançado) e depois em "New variable" (Nova variável).
    *   **Key:** `VITE_API_BASE_URL` (Este é o nome da variável de ambiente que o seu frontend espera, conforme configurado no `vite.config.js` e no `README.md` do projeto).
    *   **Value:** A URL do seu backend deployado (ex: `https://seu-backend-deployado.herokuapp.com`). **Atenção:** Você só terá essa URL depois de deployar o backend. Por enquanto, se você não tiver o backend deployado, pode deixar em branco ou usar uma URL de teste, mas lembre-se de atualizar depois.

7.  **Deployar o Site:**
    *   Clique no botão "Deploy site" (Deployar site).
    *   O Netlify vai clonar seu repositório, instalar as dependências, executar o comando de build e publicar seu site.
    *   Você verá o progresso do deploy. Uma vez concluído, o Netlify fornecerá uma URL pública para sua aplicação frontend (ex: `https://nome-aleatorio.netlify.app`).

## O que fazer se o Deploy Falhar?

*   **Verifique os Logs de Build:** No painel do Netlify, clique no deploy que falhou para ver os logs. Eles geralmente indicam o motivo da falha (erros de instalação, erros de build, etc.).
*   **Verifique a Base Directory:** O erro mais comum é esquecer de definir a "Base directory" como `frontend/`.
*   **Verifique o Build Command e Publish Directory:** Certifique-se de que `npm run build` e `dist` estão corretos.
*   **Variáveis de Ambiente:** Se o problema for na comunicação com o backend, verifique se `VITE_API_BASE_URL` está configurada corretamente com a URL do seu backend.

Lembre-se que o Netlify hospeda apenas o frontend. O backend precisará ser deployado separadamente em um serviço que suporte Python e bancos de dados (como Heroku, Railway, Render, etc.).

