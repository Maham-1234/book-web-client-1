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

### Frontend (Client)

- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** React Context API
- **Forms:** React Hook Form
- **API Client:** Axios
- **Payments:** Stripe.js / React Stripe.js

### Backend (Server)

- **Framework:** Node.js with Express.js
- **Language:** JavaScript
- **ORM:** Sequelize with PostgreSQL
- **Authentication:** Passport.js (local, Google OAuth)
- **Validation:** Zod
- **File Uploads:** Multer
- **Payments:** Stripe API

---

## 🚀 Getting Started

This project is split into two separate repositories: one for the backend server and one for the frontend client. You will need to clone and run both to use the application locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/) or another SQL database supported by Sequelize.
- [Git](https://git-scm.com/)

---

### 1. Backend Setup (Server)

First, set up the server which will run your API.

```bash
# 1. Clone the backend repository into a folder named 'book-web-server'
git clone https://github.com/Maham-1234/book-web.git book-web-server
cd book-web-server

# 2. Install dependencies
npm install

# 3. Create the environment file and fill it out
#    (See "Backend Environment Variables" section below for details)
cp .env.example .env

# 4. Set up the database
#    - Make sure your database server (PostgreSQL) is running.
#    - Create a new database with the name you specified in your .env file.
#    - Run the Sequelize migrations to create all the tables.
npx sequelize-cli db:migrate

# 5. Start the backend server
npm run dev
```

The backend server should now be running, typically on **`http://localhost:3000`**.

### 2. Frontend Setup (Client)

Next, in a **separate terminal window**, set up the React client application.

```bash
# 1. Clone the frontend repository into a folder named 'book-web-client'
git clone https://github.com/Maham-1234/book-web-client-1.git book-web-client
cd book-web-client

# 2. Install dependencies
npm install

# 3. Create the environment file and fill it out
#    (See "Frontend Environment Variables" section below for details)
cp .env.example .env

# 4. Start the frontend development server
npm run dev

```

The frontend application should now be running, typically on **`http://localhost:5173`**. You can now access the application in your browser.

---

# 🔑 Environment Variables

You must create `.env` files in both the `book-web-server` and `book-web-client` directories.

## Backend (`book-web-server/.env`)

### Server Configuration

PORT=3000
NODE_ENV=development

### Database Configuration (PostgreSQL)

DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_web_db
DB_USER=postgres
DB_PASSWORD=your_db_password

### JWT Authentication

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=another_super_secret_key
JWT_REFRESH_EXPIRES_IN=7d

### File Upload Path

UPLOAD_PATH=uploads

### CORS Origin (The URL of your frontend app)

CORS_ORIGIN=http://localhost:5173

### Email Service (for password resets, etc.)

EMAIL_SERVICE_HOST=smtp.gmail.com
EMAIL_SERVICE_PORT=587
EMAIL_SERVICE_USER=your-email@gmail.com
EMAIL_SERVICE_PASS=your-google-app-password

### Google OAuth

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

### Express Session

SESSION_SECRET=my-super-secret-session-secret

### Redis (Optional, for session storage or caching)

REDIS_URL=redis://localhost:6379

### Stripe API Keys

STRIPE_SECRET_KEY=sk_test*...
STRIPE_WEBHOOK_SECRET=whsec*...

### Frontend URL (for redirects)

FRONTEND_URL=http://localhost:5173

## Frontend (`book-web-client/.env`)

### The URL where your backend server is running

VITE_API_BASE_URL=http://localhost:3000

### Your Stripe Publishable Key (this is safe to expose)

VITE*STRIPE_PUBLISHABLE_KEY=pk_test*...

---

## 📂 Project Structure

Each repository has its own clear and logical structure.

### Backend (`book-web`)

```

/
├── config/ # Database, Passport, etc.
├── controllers/ # Request handling logic
├── middleware/ # Express middleware (auth, validation, uploads)
├── migrations/ # Sequelize database migrations
├── models/ # Sequelize models and associations
├── routes/ # API routes
├── utils/ # Helper functions
└── app.js # Main Express app

```

### Frontend (`book-web-client-1`)

```

/
├── public/
└── src/
├── api/ # API client and modules
├── assets/ # Static assets like images
├── components/ # Reusable UI components (shadcn/ui)
├── contexts/ # React Context for state management
├── hooks/ # Custom hooks
├── pages/ # Page components for routes
├── types/ # TypeScript type definitions
├── App.tsx # Main app component with router
└── main.tsx # Application entry point

```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork** the Project
2.  Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  **Push** to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a **Pull Request**

---
