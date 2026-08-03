# GearUp — Gear Rental Marketplace

A full-stack gear and equipment rental marketplace built with **Next.js 16 (App Router)**. Users can browse, rent, and review gear; providers can list and manage their inventory; admins oversee users, categories, gear moderation, and platform payments.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Authentication:** JWT (access + refresh tokens), Google OAuth
- **Payments:** Stripe, SSLCommerz
- **Backend:** RESTful API (hosted separately)

## Roles

| Role     | Description                                     |
| -------- | ----------------------------------------------- |
| CUSTOMER | Browse gear, place rental orders, make payments |
| PROVIDER | List gear, manage inventory, fulfill rentals    |
| ADMIN    | Manage users, categories, gear, payments        |

## Pages & Routes

### Public Pages

| Route              | Description                    |
| ------------------ | ------------------------------ |
| `/`                | Homepage (hero, featured gear) |
| `/gear`            | Browse all gear with filters   |
| `/gear/[id]`       | Gear detail & booking          |
| `/payment/success` | Payment success confirmation   |
| `/payment/cancel`  | Payment cancellation           |

### Auth Pages

| Route              | Description     |
| ------------------ | --------------- |
| `/login`           | Login           |
| `/register`        | Register        |
| `/forgot-password` | Forgot password |
| `/reset-password`  | Reset password  |

### Customer Dashboard (`/dashboard/*`)

| Route                         | Description             |
| ----------------------------- | ----------------------- |
| `/dashboard`                  | Dashboard overview      |
| `/dashboard/rentals`          | My rental orders        |
| `/dashboard/rentals/[id]/pay` | Pay for a rental order  |
| `/dashboard/payments`         | Payment history         |
| `/dashboard/reviews`          | My reviews              |
| `/profile`                    | Edit personal info      |
| `/settings`                   | Change password & theme |

### Provider Dashboard (`/provider/*`)

| Route                       | Description             |
| --------------------------- | ----------------------- |
| `/provider`                 | Dashboard overview      |
| `/provider/gears`           | Manage my gear listings |
| `/provider/gears/new`       | Add new gear            |
| `/provider/gears/[id]/edit` | Edit gear               |
| `/provider/rentals`         | Rental requests         |
| `/provider/reviews`         | Reviews on my gear      |

### Admin Dashboard (`/admin/*`)

| Route               | Description            |
| ------------------- | ---------------------- |
| `/admin`            | Platform overview      |
| `/admin/categories` | Manage categories      |
| `/admin/gears`      | Moderate gear listings |
| `/admin/users`      | Manage users           |
| `/admin/rentals`    | All rental orders      |
| `/admin/payments`   | All payments           |

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd gearup
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root (see `.env.example`):

   ```env
   BACKEND_API_URL=http://localhost:5000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxx
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   ```

4. Start the dev server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The frontend is deployed on **Vercel**. Set the environment variables above in your Vercel project dashboard.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
