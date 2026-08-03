# API Integration — GearUp

This document lists all backend API endpoints consumed by the GearUp frontend.  
Base URL is configured via the `BACKEND_API_URL` environment variable.

All endpoints are proxied through Next.js API route handlers at `src/app/api/*` unless noted otherwise.

---

## Authentication

| Method | Endpoint                       | Description               | Auth Required |
| ------ | ------------------------------ | ------------------------- | ------------- |
| POST   | `/api/v1/auth/login`           | Login with email/password | No            |
| POST   | `/api/v1/users/register`       | Register a new account    | No            |
| POST   | `/api/v1/auth/google`          | Google OAuth login        | No            |
| POST   | `/api/v1/auth/forgot-password` | Send password reset email | No            |
| POST   | `/api/v1/auth/reset-password`  | Reset forgotten password  | No            |

---

## Users / Profile

| Method | Endpoint                        | Description               | Auth Required |
| ------ | ------------------------------- | ------------------------- | ------------- |
| GET    | `/api/v1/users/me`              | Get current user profile  | Yes           |
| PATCH  | `/api/v1/users/me`              | Update profile (FormData) | Yes           |
| PATCH  | `/api/v1/users/change-password` | Change password           | Yes           |

---

## Gear (Public)

| Method | Endpoint                 | Description                       | Auth Required  |
| ------ | ------------------------ | --------------------------------- | -------------- |
| GET    | `/api/v1/gears`          | List gear (paginated, filterable) | No             |
| GET    | `/api/v1/gears/:id`      | Get single gear detail            | No             |
| GET    | `/api/v1/gears/my-gears` | Get provider's own gear listings  | Yes (PROVIDER) |

**Query Parameters for `GET /api/v1/gears`:**

| Param     | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| search    | string | Full-text search                  |
| category  | string | Category slug                     |
| brand     | string | Brand name                        |
| minPrice  | number | Minimum price per day             |
| maxPrice  | number | Maximum price per day             |
| sortBy    | string | Sort field (default: `createdAt`) |
| sortOrder | string | `asc` or `desc` (default: `desc`) |
| page      | number | Page number (default: 1)          |
| limit     | number | Items per page (default: 9)       |

---

## Categories

| Method | Endpoint                 | Description         | Auth Required |
| ------ | ------------------------ | ------------------- | ------------- |
| GET    | `/api/v1/categories`     | List all categories | No            |
| POST   | `/api/v1/categories`     | Create a category   | Yes (ADMIN)   |
| PATCH  | `/api/v1/categories/:id` | Update a category   | Yes (ADMIN)   |
| DELETE | `/api/v1/categories/:id` | Delete a category   | Yes (ADMIN)   |

---

## Rentals

| Method | Endpoint                     | Description                    | Auth Required        |
| ------ | ---------------------------- | ------------------------------ | -------------------- |
| POST   | `/api/v1/rentals`            | Create a rental order          | Yes (CUSTOMER)       |
| POST   | `/api/v1/rental-orders`      | Confirm/complete rental order  | Yes (CUSTOMER)       |
| GET    | `/api/v1/rentals/my-rentals` | List user's rental orders      | Yes (CUSTOMER)       |
| GET    | `/api/v1/rentals/:id`        | Get single rental order        | Yes (CUSTOMER)       |
| PATCH  | `/api/v1/rentals/:id/status` | Update rental item status      | Yes (PROVIDER/ADMIN) |
| GET    | `/api/v1/rentals/admin`      | List all rental orders (admin) | Yes (ADMIN)          |

---

## Payments

| Method | Endpoint                   | Description               | Auth Required  |
| ------ | -------------------------- | ------------------------- | -------------- |
| POST   | `/api/v1/payments/create`  | Initiate payment session  | Yes (CUSTOMER) |
| POST   | `/api/v1/payments/confirm` | Confirm payment           | Yes (CUSTOMER) |
| GET    | `/api/v1/payments`         | List customer payments    | Yes (CUSTOMER) |
| GET    | `/api/v1/payments/admin`   | List all payments (admin) | Yes (ADMIN)    |

Supported payment methods: `STRIPE`, `SSLCOMMERZ`.

---

## Reviews

| Method | Endpoint                           | Description                     | Auth Required  |
| ------ | ---------------------------------- | ------------------------------- | -------------- |
| POST   | `/api/v1/reviews`                  | Submit a review                 | Yes (CUSTOMER) |
| GET    | `/api/v1/reviews/:gearId`          | Get reviews for a gear item     | No             |
| GET    | `/api/v1/reviews/my-reviews`       | Get current user's reviews      | Yes (CUSTOMER) |
| GET    | `/api/v1/reviews/provider-reviews` | Get reviews for provider's gear | Yes (PROVIDER) |

---

## Dashboard

| Method | Endpoint                     | Description              | Auth Required  |
| ------ | ---------------------------- | ------------------------ | -------------- |
| GET    | `/api/v1/dashboard/admin`    | Admin dashboard stats    | Yes (ADMIN)    |
| GET    | `/api/v1/dashboard/provider` | Provider dashboard stats | Yes (PROVIDER) |
| GET    | `/api/v1/dashboard/customer` | Customer dashboard stats | Yes (CUSTOMER) |

---

## Admin Management

| Method | Endpoint                     | Description               | Auth Required |
| ------ | ---------------------------- | ------------------------- | ------------- |
| GET    | `/api/v1/users`              | List all users            | Yes (ADMIN)   |
| PATCH  | `/api/v1/users/:id/status`   | Update user status        | Yes (ADMIN)   |
| GET    | `/api/v1/gears/admin`        | List all gear (for admin) | Yes (ADMIN)   |
| PATCH  | `/api/v1/gears/:id/moderate` | Moderate a gear listing   | Yes (ADMIN)   |

---

## Provider Gear Management

| Method | Endpoint        | Description                | Auth Required  |
| ------ | --------------- | -------------------------- | -------------- |
| POST   | `/api/v1/gears` | Create new gear (FormData) | Yes (PROVIDER) |

---

## API Response Envelope

All endpoints return responses in the following format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPage": 10
  }
}
```

- `data` — The actual response payload.
- `meta` — Present only for paginated list endpoints.
- On error, `success` is `false` and `message` contains the error description.

## Environment Variables

```env
BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxx
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```
