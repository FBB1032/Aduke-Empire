# Aduke's Empire - E-commerce Store

## Overview
Aduke's Empire is a mobile-first React e-commerce storefront for modest fashion (Abayas, Scarves, Jallabiyas) with an admin panel for product management and WhatsApp-based checkout.

## Current State
MVP Complete - Full-featured e-commerce platform with:
- Public storefront (Home, Category pages, Product Details)
- Admin authentication and product management
- WhatsApp "Buy Now" integration
- Responsive design with Great Vibes brand font

## Project Architecture

### Frontend (`/client/src`)
- **Components:**
  - `Navbar.tsx` - Sticky navigation with brand logo and responsive menu
  - `Footer.tsx` - Site-wide footer with contact info and social links
  - `Layout.tsx` - Main layout wrapper with navbar and footer
  - `HeroSection.tsx` - Home page hero with CTA
  - `CategoryCard.tsx` - Category showcase cards
  - `ProductCard.tsx` - Product listing cards
  - `ProductGrid.tsx` - Responsive product grid with loading states

- **Pages:**
  - `Home.tsx` - Landing page with hero, categories, best sellers
  - `CategoryPage.tsx` - Category listing with infinite scroll (reused for Abaya, Scarf, Jallabiya)
  - `ProductDetails.tsx` - Product detail page with WhatsApp buy button
  - `AdminLogin.tsx` - Admin authentication page
  - `AdminPanel.tsx` - Product CRUD management

### Backend (`/server`)
- `index.ts` - Express server with session middleware
- `routes.ts` - API endpoints for products and auth
- `storage.ts` - In-memory storage with sample data

### Shared (`/shared`)
- `schema.ts` - TypeScript types and Zod schemas for products

## Key Features
1. **Public Storefront**
   - Hero section with brand messaging
   - Category browsing (Abaya, Scarf, Jallabiya)
   - Infinite scroll on category pages
   - Product detail with specifications

2. **Admin Panel**
   - Email/password authentication
   - Add new products with image preview
   - Edit existing products
   - Delete products with confirmation

3. **WhatsApp Integration**
   - "Buy Now" button generates WhatsApp link
   - Pre-filled message with product name and price
   - Direct contact with store owner

## API Routes
- `GET /api/products` - List products (with pagination)
- `GET /api/products/bestsellers` - Get best-selling products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PATCH /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status

## Admin Credentials
- Email: admin@adukesempire.com
- Password: admin123

## Design System
- **Brand Font:** Great Vibes (cursive) for "Aduke's Empire" logo
- **Body Font:** DM Sans / Inter (sans-serif)
- **Colors:** Purple-based primary with elegant neutral palette
- **Responsive:** Mobile-first, 2-col mobile → 4-5 col desktop grids

## Running the Project
```bash
npm run dev
```
Server runs on port 5000, serving both API and frontend.

## Recent Changes
- November 29, 2025: Initial MVP implementation
  - Complete frontend with all pages and components
  - Backend with in-memory storage and sample products
  - Admin authentication with session management
  - WhatsApp "Buy Now" integration

## User Preferences
- Mobile-first responsive design
- Elegant, high-end fashion aesthetic
- WhatsApp-based checkout (no traditional cart)
- Simple admin interface for product management
