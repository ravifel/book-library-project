# 📚 Book Library – Projeto de Estudo Front-End

Este é um projeto de estudo front-end criado com **React.js**, **JavaScript** e **Bootstrap**, com uma fake API utilizando **JSON Server**.  
O sistema simula uma biblioteca de livros, com foco em autenticação, rotas protegidas e boas práticas de estrutura e organização de código.

---

## 🚀 Tecnologias utilizadas

- [React](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Axios](https://axios-http.com/)
- [JSON Server](https://github.com/typicode/json-server)

---

## 📁 Estrutura de pastas

```
book-library/
├── public/
├── src/
│   ├── components/         # Componentes reutilizáveis (ex: Navbar, ProtectedRoute)
│   ├── pages/              # Páginas principais (Login, Home, Register, etc)
│   ├── services/           # Requisições com axios (ex: usersService.js)
│   ├── styles/             # Estilos personalizados (custom.css)
│   ├── App.js              # Arquivo principal da aplicação
│   ├── routes.jsx          # Definição das rotas da aplicação
│   └── index.js            # Ponto de entrada do React
├── db.json                 # Fake API para simular usuários e livros
├── package.json
└── README.md
```

---

## ✅ Funcionalidades implementadas até agora

- [x] Página de Login com validação e integração com JSON Server
- [x] Página Home com acesso somente após login
- [x] Roteamento com React Router DOM
- [x] Rotas protegidas (Protected Routes)
- [x] Armazenamento do usuário autenticado no `localStorage`
- [x] Estrutura clara e organizada do projeto
- [x] Uso de `axios` para chamadas à fake API

---

## 🛠️ Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/book-library.git
cd book-library
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor da fake API

```bash
npm run server
```

> Isso iniciará o JSON Server na porta `5000` com o arquivo `db.json`.

### 4. Inicie o projeto React

```bash
npm start
```

> A aplicação será aberta automaticamente em `http://localhost:3000`

---

## 👤 Usuário para testes

Use as credenciais abaixo para testar o login:

```
Email: ravi@email.com
Senha: 123456
```

---

## 🔒 Proteção de rotas

Usuários que não estiverem logados **não conseguem acessar nenhuma página interna** como `/home`, `/favorites`, `/book/:id`, etc.  
As rotas são protegidas com um componente chamado `ProtectedRoute`, que verifica se o usuário está salvo no `localStorage`.

---

## 🧩 Próximos passos do projeto

- [ ] Criar página de registro (Register)
- [ ] Listar livros na página Home
- [ ] Adicionar carrossel de categorias
- [ ] Página de detalhes de livros
- [ ] Salvar livros favoritos
- [ ] Página “meus favoritos”
- [ ] Página de perfil do usuário
- [ ] Integração futura com um backend real (Node.js + PostgreSQL)
- [ ] Criação de testes automatizados

---

## 🧠 Objetivo do projeto

Este projeto é voltado para **prática e aprendizado de desenvolvimento front-end**, com foco no domínio de:

- React.js com rotas e navegação
- Organização e estrutura de projetos reais
- Consumo de APIs REST (mesmo que fake)
- Lógica de autenticação e proteção de rotas
- Estilização prática com Bootstrap 5

---

## 💬 Contato

Feito com dedicação por **Ravi Silva** para estudo e evolução como desenvolvedor front-end.

---
