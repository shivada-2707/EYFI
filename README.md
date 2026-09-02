
# EYFI — Student Earnings & Leaderboard Platform

> A modern web application designed to track, review, and visualize student earnings through a competitive leaderboard experience.

---

## 📌 Overview

**EYFI** is a full-stack student earnings and leaderboard platform built to make achievement tracking more transparent, engaging, and measurable.

The platform allows students to view their position on the leaderboard, explore participant performance, submit earnings for verification, and track progress across different time periods.

It combines a clean, modern interface with a backend API and database-driven earning verification workflow.

---

## ✨ Key Features

### 🏆 Dynamic Leaderboard
- Overall student rankings
- College-based leaderboard views
- Search participants by name or college
- Ranking based on approved earnings
- Podium-style display for top performers

### 💰 Earnings Submission
Students can submit their earnings through the platform.

Each submission contains:
- Participant
- Earnings amount
- Source
- Description
- Supporting information

Submissions are initially marked as **Pending** and require verification.

### ✅ Earnings Verification
The platform provides an admin review workflow where submitted earnings can be:

- Approved
- Rejected
- Reviewed through a dedicated panel

Only approved earnings contribute to leaderboard rankings.

### 📊 Performance Tracking
The leaderboard supports different views for analyzing performance:

- Overall
- Weekly
- Monthly
- By College

### 👤 Participant Profiles
Users can open participant details to view:

- Current rank
- Total earnings
- College
- Location
- Milestones
- Performance information

### 🔎 Search & Filtering
Participants can be quickly discovered using:

- Name search
- College filtering
- Time-period filtering
- Leaderboard view switching

### 🎨 Modern UI
The frontend features a distinctive dark interface with:

- EYFI-inspired visual identity
- Responsive layouts
- Interactive cards
- Podium visualization
- Modal dialogs
- Clean typography
- Lucide icons
- Responsive tables

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| JavaScript | Application logic |
| Axios | API communication |
| Lucide React | Icons |
| Tailwind CSS | Utility styling |
| CRACO | React configuration |
| CSS | Custom UI styling |

### Backend

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | REST API |
| Pydantic | Data validation |
| Motor | MongoDB driver |
| MongoDB | Data persistence |
| Uvicorn | ASGI server |

---

## 🏗️ Architecture

The application follows a simple full-stack architecture:

```text
┌──────────────────────────────┐
│          React UI            │
│                              │
│  Leaderboard • Profiles      │
│  Earnings • Admin Review     │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│          FastAPI             │
│                              │
│  Leaderboard API             │
│  Earnings API                │
│  Verification API            │
└──────────────┬───────────────┘
               │
               │
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│                              │
│  Earnings • Status • Records │
└──────────────────────────────┘
