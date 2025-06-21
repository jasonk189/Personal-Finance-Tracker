# 💰 Finance Tracker

A full-stack personal finance tracker web app for recording income and expenses, visualizing trends, and exporting data. Built with **Flask**, **SQLite**, **JavaScript**, and **Chart.js**.

---

## 📸 Demo

![Finance Tracker Screenshot - Light Theme](screenshots/light-theme.png)
![Finance Tracker Screenshot - Dark Theme](screenshots/dark-theme.png)

> 🎥 Coming soon: short demo video/gif of features in action.

---

## ✨ Features

- ✅ Add, edit, and delete transactions (Income/Expense)
- 📅 Filter transactions by date, type, and category
- 📊 Interactive charts:
  - **Pie Chart** for expense breakdown by category
  - **Line Chart** for monthly income/expense trends
- 🌗 Theme toggle (light & dark mode)
- 📁 Export transactions to CSV
- ⚡ Live client-side sorting by date or amount

---

## 🧰 Tech Stack

**Frontend**

- HTML, CSS, JavaScript
- Chart.js for visualizations
- Responsive layout with dynamic DOM updates

**Backend**

- Flask (Python)
- SQLite (via SQLAlchemy ORM)
- RESTful API (CRUD endpoints)
- CORS enabled for frontend-backend communication

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Python 3.x
- Node.js (optional if using Tailwind/PostCSS)
- Git

---

### 🐍 Backend Setup (Flask + SQLite)

1. Clone the repo:

````bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker

2. Create and activate virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies:

```bash
pip install -r requirements.txt

4. Run the server:

```bash
python app.py

Open index.html in a browser:

📦 API Endpoints
| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/api/transactions`      | Fetch all transactions     |
| POST   | `/api/transactions`      | Add a new transaction      |
| PUT    | `/api/transactions/<id>` | Update a transaction       |
| DELETE | `/api/transactions/<id>` | Delete a transaction       |
| GET    | `/export`                | Export transactions as CSV |
````
