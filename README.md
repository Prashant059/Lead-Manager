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

<pre> src/ ├── components/ │ ├── layout/ # Layout with Navbar + Sidebar │ ├── leads/ # LeadForm + LeadTable │ └── followups/ # FollowUpForm + FollowUpTable ├── pages/ │ ├── Dashboard.jsx │ ├── Leads.jsx │ └── FollowUps.jsx ├── utils/ │ └── storage.js # load/save helpers for localStorage ├── App.jsx └── main.jsx </pre>


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
