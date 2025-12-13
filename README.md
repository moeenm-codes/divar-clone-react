# Divar-clone-react

A modern, feature-rich classified ads marketplace application built with React and Vite. This project replicates the core functionality of Divar, a popular Iranian classified ads platform.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Status](#project-status)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)

## 🎯 Project Overview

This is a full-featured classified ads marketplace where users can:

- Browse and search for classified ads across different cities
- Post new ads with detailed information and categories
- Manage their own listings and profile
- Mark favorite listings
- Communicate through the platform
- Access an admin panel for platform management

## ✨ Features

### User Features

- **Authentication System**

  - Phone number-based OTP verification
  - Secure user authentication
  - Protected routes and user sessions

- **Post Management**

  - Create new classified ads (posts)
  - Edit and delete existing posts
  - Browse posts by category
  - Search functionality with filters
  - Post details page with full information

- **City Selection**

  - Multi-city support with dynamic selection
  - City-specific ad browsing
  - Persistent city preference

- **Favorites System**

  - Save favorite ads
  - Dedicated favorites dashboard page
  - Quick access to saved items

- **Dashboard**

  - My Posts: Manage all user's listings
  - Favorites: View saved ads
  - Settings: User profile and preferences
  - Support & FAQ: Help and common questions

- **Categories**

  - Browse ads by categories
  - Category-based filtering
  - Dynamic category management

- **Search & Discovery**
  - Advanced search functionality
  - Popular searches suggestions
  - Filter by location and categories

### Admin Features

- **Admin Panel**
  - Manage users and posts
  - Content moderation
  - Category management
  - Platform oversight

### UI/UX Features

- **Theme Support**

  - Light and Dark mode toggle
  - Persistent theme preference
  - Smooth theme transitions

- **Responsive Design**

  - Mobile-first approach
  - Tablet optimization
  - Desktop experience
  - Hamburger menu for mobile navigation

- **Loading States**

  - Skeleton loaders for better UX
  - Custom loading indicators
  - Smooth data transitions

- **Notifications**
  - Toast notifications for user feedback
  - Error and success messages
  - Non-intrusive alerts

## Project Status

This project is currently in a **pre-refactor state**.

The purpose of this repository is to:

- Showcase the initial architecture and implementation
- Receive professional feedback before refactoring
- Apply improvements in a separate refactor phase
- Feedback is highly appreciated, especially regarding architecture, state management, and component structure.

### Upcoming Refactor Goals

- Improve folder structure
- Reduce component complexity
- Extract reusable logic into custom hooks
- Separate business logic from UI

## 🛠 Tech Stack

### Frontend Framework

- **React** 18.2.0 - UI library
- **Vite** 5.0.8 - Build tool and dev server
- **React Router** 7.9.5 - Client-side routing

### State Management & Data Fetching

- **TanStack React Query** 5.90.5 - Server state management
- **Axios** 1.13.1 - HTTP client

### UI & Styling

- **CSS Modules** - Component-scoped styling
- **React Icons** 5.5.0 - Icon library
- **React Loading Skeleton** 3.5.0 - Skeleton loaders

### Utilities

- **usehooks-ts** 2.4.1 - Custom React hooks

### Development Tools

- **ESLint** - Code quality
- **React Refresh** - Fast refresh during development

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd divar-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API**

   - Update API endpoints in `src/configs/api.js`
   - Configure React Query settings in `src/configs/reactQuery.js`

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── assets/              # Static assets and fonts
├── components/
│   ├── context/        # React Context providers (City, Theme, Auth, Toast)
│   ├── hooks/          # Custom React hooks
│   ├── modules/        # Reusable UI modules and components
│   └── Templates/      # Template components (Forms, Lists)
├── configs/            # Configuration files (API, React Query)
├── constants/          # Application constants
├── layouts/            # Layout components (Header, Footer)
├── pages/              # Page components
│   └── dashboard/      # Dashboard and user management pages
├── router/             # Routing configuration and protected routes
├── services/           # API service calls
├── styles/             # Global styles and theme files
└── utils/              # Utility functions
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

---

**Note:** This project is in active development. Please refer to the Project Status section for information about the upcoming refactoring phase.
