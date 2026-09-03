<div align="center">

<img src="./banner.svg" alt="EYFI — Student Earnings & Leaderboard Platform" width="100%" />

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#tech-stack)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#tech-stack)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](#tech-stack)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](#tech-stack)

<sub>A modern, full-stack platform for tracking, verifying, and visualizing student earnings through a competitive leaderboard.</sub>

</div>

---

## 📌 Overview

**EYFI** is a full-stack student earnings and leaderboard platform built to make achievement tracking transparent, engaging, and measurable.

Students can view their leaderboard position, explore participant performance, submit earnings for verification, and track progress across different time periods — all through a clean, glass-inspired interface backed by a REST API and a database-driven verification workflow.

---

## ✨ Key Features

<table>
<tr>
<td width="50%" valign="top">

### 🏆 Dynamic Leaderboard
- Overall student rankings
- College-based leaderboard views
- Search participants by name or college
- Ranking based on approved earnings only
- Podium-style display for top performers

### 💰 Earnings Submission
Students submit earnings with:
- Participant
- Earnings amount
- Source
- Description
- Supporting information

Submissions start as **Pending** until reviewed.

</td>
<td width="50%" valign="top">

### ✅ Earnings Verification
Admin review workflow supports:
- Approve
- Reject
- Review via a dedicated panel

Only **approved** earnings count toward rankings.

### 📊 Performance Tracking
Multiple leaderboard views:
- Overall
- Weekly
- Monthly
- By College

</td>
</tr>
</table>

### 👤 Participant Profiles
View rank, total earnings, college, location, milestones, and performance details for any participant.

### 🔎 Search & Filtering
Fast discovery via name search, college filters, time-period filters, and leaderboard view switching.

### 🎨 Modern UI
A distinctive dark, glassmorphism-inspired interface — translucent cards, responsive layouts, podium visualization, modal dialogs, Lucide icons, and responsive tables.

---

## 🛠️ Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| React | User interface |
| JavaScript | Application logic |
| Axios | API communication |
| Lucide React | Icons |
| Tailwind CSS | Utility styling |
| CRACO | React configuration |
| CSS | Custom UI styling |

**Backend**

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | REST API |
| Pydantic | Data validation |
| Motor | MongoDB async driver |
| MongoDB | Data persistence |
| Uvicorn | ASGI server |

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│           React UI           │
│                               │
│   Leaderboard • Profiles     │
│   Earnings • Admin Review    │
└──────────────┬────────────────┘
               │
               │  REST API
               ▼
┌──────────────────────────────┐
│           FastAPI            │
│                               │
│   Leaderboard API            │
│   Earnings API                │
│   Verification API           │
└──────────────┬────────────────┘
               │
               ▼
┌──────────────────────────────┐
│           MongoDB             │
│                               │
│   Earnings • Status • Records │
└──────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) and npm/yarn
- Python 3.10+
- MongoDB instance (local or Atlas)

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

```env
# backend/.env
MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=eyfi

# frontend/.env
REACT_APP_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```text
eyfi/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── backend/
│   ├── routes/
│   ├── models/
│   ├── main.py
│   └── requirements.txt
└── README.md
```

---

## 🗺️ Roadmap

- [ ] Email/OTP-based participant verification
- [ ] Exportable leaderboard reports (CSV/PDF)
- [ ] Role-based admin permissions
- [ ] Public API for read-only leaderboard access

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

<div align="center">
<sub>Built with 💜 for transparent, measurable student achievement.</sub>
</div>
