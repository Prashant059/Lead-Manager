# 📌 Lead Management System

A simple **Lead & Follow-up Management System** built with **React + Vite** and styled with **Tailwind CSS**.  
This project is designed for managers and sales teams to easily manage leads, track follow-ups, and view analytics on the dashboard.

---

## 🚀 Features

- **Dashboard Overview**
  - Total leads count
  - Pending follow-ups
  - Lead status breakdown
  - Recent activity
  - Upcoming follow-ups (7 days)

- **Leads Management**
  - Add new leads with name, email, phone, and status
  - Edit existing leads
  - Delete leads (removes from both list and dashboard)
  - Search leads by name or email
  - Persistent storage in **localStorage**

- **Follow-ups Management**
  - Add follow-up notes linked with leads
  - Edit follow-ups
  - Delete follow-ups
  - Search by notes/lead name
  - Upcoming follow-ups visible in dashboard
  - Persistent storage in **localStorage**

- **Responsive Layout**
  - Sidebar navigation
  - Navbar with global search and add lead button
  - Mobile friendly UI

---

## 🛠️ Tech Stack

- **React (Vite)**
- **Tailwind CSS**
- **React Router DOM**
- **LocalStorage** (for persistence)

---

## 📂 Project Structure
```bash
Lead-Manager/
├── public/                     # Static assets
│   └── index.html
├── src/                        # Source code
│   ├── components/             # Reusable UI components
│   │   ├── layout/             # Navbar + Sidebar
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── leads/              # Leads management
│   │   │   ├── LeadForm.jsx
│   │   │   └── LeadTable.jsx
│   │   └── followups/          # Follow-ups management
│   │       ├── FollowUpForm.jsx
│   │       └── FollowUpTable.jsx
│   │
│   ├── pages/                  # Pages for routing
│   │   ├── Dashboard.jsx
│   │   ├── Leads.jsx
│   │   └── FollowUps.jsx
│   │
│   ├── utils/                  # Utility functions
│   │   └── storage.js
│   │
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```


---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/lead-management.git
   cd lead-management
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   ```
4. **Build for Production**
   ```bash
   npm run build
   ```      
