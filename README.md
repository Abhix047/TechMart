# TechMart
# 🛒 TechMart

> A modern, full-stack e-commerce platform for tech products — built for speed, scalability, and a seamless shopping experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 About

**TechMart** is a full-stack e-commerce web application designed for tech enthusiasts. It delivers a smooth, responsive shopping experience — from browsing products to secure checkout — backed by a robust Node.js API and a modern React/Next.js frontend.

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog** — Browse tech products with rich details, images, and specs
- **Search & Filtering** — Filter by category, price range, brand, and customer ratings
- **Product Reviews** — Verified buyers can leave ratings and written reviews
- **Wishlist** — Save products for later with a personal wishlist

### 🛒 Cart & Checkout
- **Smart Cart** — Add, update, and remove items with real-time price totals
- **Secure Checkout** — Multi-step checkout with address and payment management
- **Payment Integration** — Supports Stripe / Razorpay for safe, fast transactions
- **Order Confirmation** — Instant email confirmation after every successful order

### 👤 User Accounts
- **Authentication** — Register, log in, and manage sessions with JWT-based auth
- **Order History** — View all past orders and their current statuses
- **Profile Management** — Update personal info, addresses, and preferences

### 🖥️ Admin Dashboard
- **Product Management** — Add, edit, and remove products and categories
- **Order Management** — View and update order statuses across all customers
- **User Management** — View and manage registered user accounts
- **Inventory Tracking** — Monitor stock levels with low-stock alerts

### 🎨 UI & Performance
- **Responsive Design** — Mobile-first layout that works on all screen sizes
- **Dark Mode** — Toggle between light and dark themes
- **Fast Page Loads** — Server-side rendering and static generation via Next.js
- **Optimized Images** — Automatic image optimization for fast delivery

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React.js, Next.js 14, Tailwind CSS      |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB (Mongoose) / PostgreSQL         |
| Auth       | JWT, bcrypt                             |                 |
| Deployment | Vercel (frontend), Render (backend)     |

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated! Please follow the steps below to get involved.

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/techmart.git
cd techmart
```

### 2. Create a Branch

Use a descriptive branch name following this convention:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/issue-you-are-fixing
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style and folder structure
- Add or update tests where applicable
- Keep commits small and focused

### 4. Commit with Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git commit -m "feat: add product comparison feature"
git commit -m "fix: resolve cart total rounding error"
git commit -m "docs: update API usage in README"
```

Common prefixes: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 5. Push & Open a Pull Request

```bash
git push origin feat/your-feature-name
```

Then open a Pull Request on GitHub. Fill in the PR template with:
- A clear description of what you changed and why
- Screenshots or recordings for UI changes
- Reference to any related issues (e.g. `Closes #42`)

### 6. Code Review

A maintainer will review your PR. Be ready to discuss your approach and make updates if requested. Once approved, it will be merged into `main`.

### Guidelines

- For significant changes, **open an issue first** to discuss the proposal
- Do not commit `.env` files or any secrets
- All tests must pass before a PR can be merged
- Be respectful and constructive in all discussions — see our [Code of Conduct](CODE_OF_CONDUCT.md)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by the TechMart Team</p>
