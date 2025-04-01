# iRescue - Phone Repair & Service App

iRescue is a comprehensive mobile phone repair and service application that allows users to:

- Schedule phone repairs
- Purchase refurbished devices
- Sell their used devices
- Manage repair bookings and track status

## Features

- **Repair Service:** Schedule repair appointments for various phone issues
- **Purchase Section:** Browse and buy refurbished phones
- **Sell Your Device:** Get quotes and sell your used phones
- **Admin Dashboard:** Manage repair requests, inventory, and bookings
- **Secure Authentication:** User accounts and admin access
- **Payment Integration:** Secure online payments with Stripe
- **Responsive Design:** Works on mobile, tablet, and desktop

## Technologies

- Next.js 15+
- React 19
- Prisma ORM
- NextAuth.js
- Stripe Payment Integration
- Tailwind CSS
- TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see below)
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

## Admin Setup

Run the admin setup script to create an admin user:

```bash
npm run create-admin
```

## Deployment

The app is configured for easy deployment on Vercel:

```bash
npm run build
```

## License

This project is licensed under the MIT License.
