# 🎶 Zimdancehall Music Awards — Voting Dashboard (React + Tailwind)

This project is a **modern, elegant, and fully responsive admin dashboard** built in **React + Tailwind CSS**, customized specifically for managing the **Zimdancehall Music Awards voting system**.

It is based on the open-source TailAdmin template, but heavily modified and extended to fit the needs of an online music awards platform, including:

* Secure vote management
* Artist & category administration
* Fraud detection tools
* Analytics dashboards
* Moderation features
* User activity tracking

---

## 🌍 Project Purpose

The **Zimdancehall Music Awards Voting Dashboard** provides a backend interface used by:

* **Admins** — manage artists, categories, nominees, and voting windows
* **Moderators** — track suspicious votes, manage users
* **Super Admins** — access full analytics, export result data
* **System Owners** — configure event-wide settings

The platform ensures **fair, transparent, and tamper-proof** public voting.

---

## ⚡ Features (Custom to This Project)

### 🎤 Artist & Category Management

* Create/edit/remove artists
* Manage award categories
* Upload artist images
* Assign nominees to categories

### 🗳️ Voting System Controls

* Start/stop voting periods
* Limit votes per user/device
* IP-based spam prevention
* JWT authentication for dashboard users

### 📊 Advanced Analytics

* Real-time vote counts
* Per-category analytics
* Suspicious activity alerts
* Export results to CSV / PDF

### 👤 User & Role Management

* Admin / Moderator / Viewer roles
* Permission-based route protection
* Profile management

### 🎨 Modern UI

* Glassmorphism & modern animations
* Light/Dark mode
* Fully responsive mobile-friendly layout
* Beautiful charts and tables

---

## 🚀 Tech Stack

This dashboard is built using:

* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **ApexCharts** for graphs
* **React Router**
* **Vite**
* **JWT Auth (Backend Required)**
* **REST API (Java/Spring Boot or Node.js)**

---

## 📦 Installation & Setup

### 1️⃣ Prerequisites

Make sure you have:

* **Node 18+** (Node 20 recommended)
* A backend API (your own voting system backend)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/nyashahama/music-awards.git
cd music-awards
```

---

### 3️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

If you encounter peer dependency issues:

```bash
npm install --legacy-peer-deps
```

---

### 4️⃣ Start Development Server

```bash
npm run dev
# or
yarn dev
```

Your project will run on:

```
http://localhost:5173
```

---

## 🧱 Project Structure

```
src/
 ├── components/    # Shared UI components (buttons, cards, modals)
 ├── pages/         # Dashboard pages
 ├── hooks/         # Custom React hooks
 ├── layouts/       # App layout (sidebar, header)
 ├── services/      # API calls (axios)
 ├── context/       # Auth & app context
 └── assets/        # Images & icons
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
VITE_API_URL=https://your-backend-url/api
```

---

## 📅 Roadmap

* Add SMS/email verification for voters
* Add exportable final results PDFs
* Add detailed fraud detection dashboard
* Add mobile app version

---

## 🧑‍💼 Credits

This project uses components and the base layout from **TailAdmin (MIT License)**:

* [https://tailadmin.com](https://tailadmin.com)
* [https://github.com/TailAdmin/free-react-tailwind-admin-dashboard](https://github.com/TailAdmin/free-react-tailwind-admin-dashboard)

All UI/UX enhancements and voting system logic have been customized for the **Zimdancehall Music Awards**.

---

## 📄 License

This project is licensed under the **MIT License**, including original TailAdmin components where applicable.

---


Just tell me!
