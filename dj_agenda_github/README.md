# DJ Agenda Online

Este é um projeto de uma agenda online para DJs, desenvolvida com um backend em Flask (Python) e um frontend em React. A aplicação permite o agendamento de eventos, controle de horários, locais, faturamento e geração de relatórios.

## Funcionalidades

- Agendamento de eventos (Local, Horário, Dia)
- Salvamento online dos dados em banco de dados PostgreSQL
- Relatório mensal de eventos
- Interface amigável e responsiva
- Edição e exclusão de eventos
- Exclusão automática de eventos vencidos (após 30 dias)
- Dashboard com visão geral e estatísticas
- Calendário visual de eventos
- Controle financeiro (cachês e faturamento)
- Relatórios avançados (gráficos e análises)
- Sistema de busca e filtros
- Gestão de clientes por evento
- Campo para observações

## Tecnologias Utilizadas

### Backend
- **Flask**: Microframework web em Python.
- **SQLAlchemy**: ORM para interação com o banco de dados.
- **Psycopg2**: Adaptador PostgreSQL para Python.
- **python-dotenv**: Para carregar variáveis de ambiente.
- **Flask-CORS**: Para lidar com requisições Cross-Origin.

### Frontend
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta de build para projetos frontend.
- **Tailwind CSS**: Framework CSS para estilização rápida.

## Estrutura do Projeto

```
dj_agenda_github/
├── backend/             # Código do backend (Flask)
│   ├── src/
│   │   ├── main.py
│   │   ├── models/
│   │   │   └── evento.py
│   │   │   └── user.py
│   │   └── routes/
│   │       └── evento.py
│   ├── requirements.txt
│   └── venv/            # Ambiente virtual (ignorar no Git)
├── frontend/            # Código do frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/    # Dependências (ignorar no Git)
└── README.md
```

## Como Rodar o Projeto Localmente

### 1. Pré-requisitos

- Python 3.8+
- Node.js 14+
- npm ou yarn
- PostgreSQL (local ou em nuvem)

### 2. Configuração do Backend

1.  **Navegue até o diretório do backend:**
    ```bash
    cd dj_agenda_github/backend
    ```

2.  **Crie um ambiente virtual e ative-o:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis de ambiente:**
    ```
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    SECRET_KEY="sua_chave_secreta_aqui"
    ```
    *Substitua `user`, `password`, `host`, `port` e `database_name` pelos dados do seu banco de dados PostgreSQL.*

5.  **Execute as migrações do banco de dados (se houver) ou crie as tabelas:**
    (Dependendo da implementação, pode ser necessário um script de inicialização ou migração. No momento, as tabelas são criadas automaticamente na primeira execução se não existirem.)

6.  **Inicie o servidor Flask:**
    ```bash
    flask run
    ```
    O backend estará rodando em `http://127.0.0.1:5000` (ou outra porta, dependendo da configuração).

### 3. Configuração do Frontend

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd dj_agenda_github/frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install # ou yarn install
    ```

3.  **Crie um arquivo `.env` na raiz do diretório `frontend` com a seguinte variável de ambiente:**
    ```
    VITE_API_BASE_URL="http://127.0.0.1:5000"
    ```
    *Certifique-se de que a URL base da API aponte para o seu backend local.*

4.  **Inicie o servidor de desenvolvimento do React:**
    ```bash
    npm run dev # ou yarn dev
    ```
    O frontend estará acessível em `http://127.0.0.1:5173` (ou outra porta, dependendo da configuração).

## Deploy

### Deploy do Backend

Para o deploy do backend, você pode usar serviços como Heroku, Railway, Render, AWS Elastic Beanstalk, Google App Engine, ou um VPS com Gunicorn/Nginx. Certifique-se de configurar as variáveis de ambiente (`DATABASE_URL`, `SECRET_KEY`) no ambiente de produção.

### Deploy do Frontend

Para o deploy do frontend, você pode usar serviços de hospedagem estática como Netlify, Vercel, GitHub Pages, ou Firebase Hosting. Antes de fazer o deploy, você precisará construir a aplicação:

```bash
cd dj_agenda_github/frontend
npm run build # ou yarn build
```

Os arquivos de build estarão na pasta `dist/`. Você pode então fazer o upload do conteúdo dessa pasta para o seu serviço de hospedagem estática.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades. Por favor, siga as boas práticas de desenvolvimento e crie pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. (Se aplicável, crie um arquivo LICENSE no futuro.)


