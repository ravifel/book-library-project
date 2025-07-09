# 📚 Book Library – Front-End Study Project

This is a front-end study project built with **React.js**, **JavaScript**, and **Bootstrap**, using a fake API with **JSON Server**.  
The system simulates a virtual book library with a focus on:

---

## 🚀 Technologies Used

- [React](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Axios](https://axios-http.com/)
- [JSON Server](https://github.com/typicode/json-server)

---

## 📁 Project Structure

```
book-library/
├── public/
├── src/
│   ├── components/         # Reusable components (Navbar, ProtectedRoute, Layout)
│   ├── pages/              # Main pages (Login, Home, Register, etc.)
│   ├── services/           # Axios services (e.g., usersService.js)
│   ├── styles/             # Custom styles (custom.css)
│   ├── App.js              # Main application component
│   ├── routes.jsx          # Application route definitions
│   └── index.js            # React entry point
├── db.json                 # Fake API with users and books
├── package.json
└── README.md
```

---

## 🛠️ How to Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/book-library.git
cd book-library
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the fake API server

```bash
npm run server
```

> This starts the JSON Server on port `5000` using the `db.json` file.

### 4. Start the React app

```bash
npm start
```

> The app will automatically open at `http://localhost:3000`

---

## 👤 Test User

Use the following credentials to log in:

```
Email: ravi@email.com
Password: 123456
```

---

## 🔒 Route Protection

The system uses a custom component called `ProtectedRoute` that:

- Checks if a user is stored in `localStorage`
- Redirects to the login page if not authenticated
- Ensures pages like `/home`, `/favorites`, `/category/:name`, `/profile`, etc., are only accessible after login

---

## 🎯 Project Goals

This project is focused on **practicing and improving front-end development skills**, especially in:

- Mastering React.js with routing, navigation, and reusable components
- Structuring real-world projects with clear separation of concerns
- Consuming RESTful APIs
- Managing basic state with `useState` and `localStorage`
- Implementing user authentication and protected routes
- Building responsive UI with Bootstrap 5

---

## 💬 Contact

Created with dedication by **Ravi Silva** for study and continuous improvement as a front-end developer.
