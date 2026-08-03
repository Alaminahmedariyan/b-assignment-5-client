# Admin Credentials

Use the following credentials to access the admin dashboard:

| Field    | Value                         |
| -------- | ----------------------------- |
| URL      | `https://<your-domain>/login` |
| Email    | `admin@gearup.com`            |
| Password | `Admin123`                    |

> **Note:** These credentials are for the admin role only. After logging in, you will be redirected to `/admin`.

## Other Test Accounts

| Role     | Email                 | Password    |
| -------- | --------------------- | ----------- |
| CUSTOMER | `customer@gearup.com` | `Customer1` |
| PROVIDER | `provider@gearup.com` | `Provider1` |

## Environment Variables Required

Make sure the following environment variables are set in your `.env` file or Vercel dashboard:

```
BACKEND_API_URL=<your-backend-url>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
```
