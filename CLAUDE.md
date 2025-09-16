# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zone Tactics is a SaaS platform for basketball coaches to create and share tactical animations. Built with Next.js, TypeScript, and React, it features:

- Interactive tactical animations with drag-and-drop player positioning
- Subscription management via Stripe integration
- User authentication through Clerk
- Audio commentary recording for tactics
- System sharing and library management
- Responsive design with Tailwind CSS

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Development server runs on http://localhost:3000

## Architecture & Key Components

### Authentication & Authorization
- **Clerk** handles user authentication (`@clerk/nextjs`)
- **withPremiumAccess** HOC (`src/components/withSubscription.tsx`) restricts access to premium features
- Subscription status checked via `useSubscription` hook (`src/hooks/useSubscription.ts`)

### Subscription System
- **Stripe** integration for payment processing
- Subscription data stored in Vercel Blob storage
- Key files:
  - `src/lib/stripe.ts` - Stripe client configuration
  - `src/lib/subscription.ts` - Subscription status checking
  - `src/pages/api/create-checkout-session.ts` - Payment session creation
  - `src/pages/api/webhooks/stripe.ts` - Stripe webhook handling

### Core Application Pages
- **Landing page** (`src/pages/index.tsx`) - Marketing site with feature showcase
- **Tactics creator** (`src/pages/createsystem.tsx`) - Main application for creating tactical animations
- **Library** (`src/pages/library.tsx`) - User's saved tactics
- **Pricing** (`src/pages/pricing.tsx`) - Subscription plans
- **Shared systems** (`src/pages/shared-system/[id].tsx`) - View shared tactics

### Data Storage
- **Vercel Blob** storage for:
  - User systems/tactics data
  - Subscription information
  - Shared system data
- API routes handle CRUD operations for systems

### Styling & UI
- **Tailwind CSS** with custom color scheme:
  - `bleu: "#3DB2F0"` (primary brand color)
  - `bfonce: "rgba(7, 41, 60, .5)"` (dark overlay)
- **Framer Motion** for animations and transitions
- **React DnD** for drag-and-drop functionality in tactical creator
- Responsive design with mobile-first approach

### Key Hooks
- `useSubscription` - Manages subscription status checking
- `useIsMobile` - Responsive behavior detection

## Important Technical Details

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `src/*`
- ESLint configured with Next.js rules, `no-explicit-any` and `no-unused-vars` disabled

### API Structure
- RESTful API routes in `src/pages/api/`
- Authentication required for most endpoints
- Subscription verification for premium features

### Environment Variables Required
- `STRIPE_SECRET_KEY` - Stripe API key
- Clerk authentication variables
- Next.js public variables for client-side

### File Organization
```
src/
├── components/     # Reusable React components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries (Stripe, subscription logic)
├── pages/         # Next.js pages and API routes
│   ├── api/       # Backend API endpoints
│   └── shared-system/ # Dynamic routes for shared content
└── styles/        # Global CSS and Tailwind styles
```

## Deployment Notes
- Optimized for Vercel deployment
- Uses Next.js App Router architecture
- Static assets in `public/` directory
- Font optimization with `next/font`