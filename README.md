# Book-Web: Full-Stack E-Commerce Platform

A modern, full-featured e-commerce application for selling books and stationery. Built with a powerful backend using Node.js/Express and a responsive, type-safe frontend using React and TypeScript.

---

## ✨ Key Features

### For Customers:

- **Secure Authentication:** Local (email/password) & Google OAuth login.
- **Product Discovery:** Browse products, filter by category, search, and sort by price or date.
- **Shopping Cart:** A persistent and intuitive shopping cart experience.
- **Stripe Payments:** Secure and seamless checkout process powered by Stripe.
- **Order History:** View past orders and their current status.
- **User Profiles:** Manage personal information and avatar uploads.
- **Responsive Design:** A great user experience on any device, from mobile to desktop.
- **Light & Dark Mode:** A comfortable viewing experience in any lighting condition.

### For Administrators:

- **Admin Dashboard:** Overview of key store metrics like total revenue, orders, products, and users.
- **Product Management (CRUD):** Full control over the product catalog.
- **Category Management (CRUD):** Manage a hierarchical category system with parent-child relationships.
- **Order Management:** View all customer orders and update their status (shipped, delivered, cancelled).
- **User Management:** View all registered users and manage their roles.
- **Complete Inventory Audit Trail:** Every stock change (sale, cancellation, restock, manual adjustment) is recorded and auditable on the product page.

---

## 🛠️ Tech Stack

### Frontend

- Framework: React with Vite
- Language: TypeScript
- Styling: Tailwind CSS with shadcn/ui components
- State Management: React Context API
- Forms: React Hook Form
- API Client: Axios
- Payments: Stripe.js / React Stripe.js

### Backend

- Framework: Node.js with Express.js
- Language: JavaScript
- ORM: Sequelize with PostgreSQL (or MySQL)
- Authentication: Passport.js (JWT for local, Google OAuth)
- Validation: Zod
- File Uploads: Multer
- Payments: Stripe API

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn
- PostgreSQL or another SQL database supported by Sequelize

---
