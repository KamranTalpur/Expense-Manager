# Expense Manager App 💸  

A full-stack **MERN (MongoDB, Express.js, React, Node.js)** web application to track, manage, and analyze personal expenses. Users can register, log in securely, add expenses, categorize them, view summaries, and visualize spending trends in a neat dashboard.  

---

## 🚀 Features  

- **User Authentication**  
  - JWT-based login & registration  
  - Passwords hashed with bcrypt for security  

- **Expense Management (CRUD)**  
  - Add, edit, delete, and view expenses  
  - Each user only sees their own expenses  

- **Expense Fields**  
  - Amount, description, category, date  

- **Dashboard**  
  - Spending summary  
  - Category-wise chart visualization  

- **Tech Stack Goodies**  
  - Frontend: React + Context API + Tailwind CSS  
  - Backend: Node.js + Express.js  
  - Database: MongoDB + Mongoose ODM  
  - Auth: JWT + bcrypt  

---

## 🛠️ Installation  

### Prerequisites  
- Node.js (>= 18.x recommended)  
- MongoDB (local or Atlas)  
- Git  

### Clone the repo  
```bash
git clone https://github.com/your-username/expense-manager.git
cd expense-manager
```

### Backend Setup  
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following:  
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:  
```bash
npm start
```

### Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure  

```
expense-manager/
│
├── backend/              # Express + MongoDB server
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route handlers
│   ├── middleware/       # Auth middleware
│   ├── server.js         # App entry point
│   └── .env              # Environment variables
│
├── frontend/             # React client
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Global state management
│   │   ├── pages/        # App pages (Dashboard, Login, Register, etc.)
│   │   └── App.jsx       # Main React app
│   └── tailwind.config.js
│
└── README.md
```

---

## 📊 API Endpoints  

### Auth  
- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Login and get token  

### Expenses  
- `GET /api/expenses` → Fetch all expenses of logged-in user  
- `POST /api/expenses` → Add a new expense  
- `PUT /api/expenses/:id` → Update an expense  
- `DELETE /api/expenses/:id` → Delete an expense  

---

## 🖼️ Screenshots (optional)  

- **Login Page**  
- **Dashboard with chart**  
- **Expense list with CRUD actions**  

---

## 🤝 Contributing  

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.  

---

## 📜 License  

This project is licensed under the MIT License.  # Expense Manager App 💸  

