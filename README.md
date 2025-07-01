
# 📚 Book Library – Projeto de Estudo Front-End

Este é um projeto de estudo front-end criado com **React.js**, **JavaScript** e **Bootstrap**, utilizando uma fake API com **JSON Server**.  
O sistema simula uma biblioteca virtual de livros com foco em:

- Autenticação de usuário
- Rotas protegidas
- Estrutura organizada
- Navegação entre categorias
- Salvamento de favoritos

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
│   ├── components/         # Componentes reutilizáveis (Navbar, ProtectedRoute, Layout)
│   ├── pages/              # Páginas principais (Login, Home, Register, etc)
│   ├── services/           # Requisições com axios (ex: usersService.js)
│   ├── styles/             # Estilos personalizados (custom.css)
│   ├── App.js              # Arquivo principal da aplicação
│   ├── routes.jsx          # Definição das rotas da aplicação
│   └── index.js            # Ponto de entrada do React
├── db.json                 # Fake API com usuários e livros
├── package.json
└── README.md
```

---

## ✅ Funcionalidades implementadas

- [x] Página de **Login** com validação e autenticação via JSON Server
- [x] Página **Home** acessível apenas após login
- [x] Página de **Perfil**, exibindo nome e e-mail do usuário logado
- [x] Página **Favorites** protegida
- [x] **Navbar** com menu, nome do usuário e botão de logout
- [x] **Dropdown de categorias** dinâmico no menu (Aventura, Ficção, etc)
- [x] Roteamento completo com React Router DOM
- [x] **Rotas protegidas** (usuário não autenticado é redirecionado)
- [x] Salvamento de usuário autenticado no `localStorage`
- [x] Organização modular com separação de componentes, páginas, estilos e serviços

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

> Isso iniciará o JSON Server na porta `5000` usando o arquivo `db.json`.

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

O sistema utiliza um componente chamado `ProtectedRoute`, que:

- Verifica se o usuário está salvo no `localStorage`
- Redireciona para o login caso tente acessar rotas protegidas
- Garante que páginas como `/home`, `/favorites`, `/category/:name`, `/profile`, etc., só sejam acessadas após login

---

## 🎯 Objetivo do projeto

Este projeto é voltado para **prática e aprendizado de desenvolvimento front-end**, com foco em:

- Domínio do React.js com rotas, navegação e componentes
- Organização e estruturação de projetos reais
- Consumo de APIs REST
- Gerenciamento de estado inicial com `useState` e `localStorage`
- Autenticação e proteção de rotas
- Estilização prática com Bootstrap