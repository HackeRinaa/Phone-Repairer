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
- PostgreSQL Database
- NextAuth.js
- Stripe Payment Integration
- Tailwind CSS
- TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see below)
4. Set up the database: `npm run db-setup`
5. Run the development server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Time slots
AVAILABLE_TIME_SLOTS="10:00-10:30,10:30-11:00,11:00-11:30,11:30-12:00,12:00-12:30,12:30-13:00,13:00-13:30,13:30-14:00,14:00-14:30,14:30-15:00,15:00-15:30,15:30-16:00,16:00-16:30,16:30-17:00,17:00-17:30,17:30-18:00,18:00-18:30,18:30-19:00,19:00-19:30,19:30-20:00"
```

## Admin Setup

Run the admin setup script to create an admin user:

```bash
npm run create-admin
```

## Database Setup

The application uses PostgreSQL for production deployment. Follow these steps to set up your database:

1. Create a PostgreSQL database on your preferred hosting provider (e.g., Vercel, Supabase, Neon, etc.)
2. Update your `.env` file with the PostgreSQL connection string
3. Run the database setup script: `npm run db-setup`

To test your database connection:

```bash
node src/lib/db-test.mjs
```

## Deployment

The app is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the following environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT authentication
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - Other variables from `.env.production`

3. Deploy the application with:
```bash
vercel --prod
```

The deployment process will automatically:
1. Fix any SQLite migrations to be PostgreSQL compatible
2. Set up the database schema if needed
3. Generate the Prisma client
4. Build and deploy the application

## License

This project is licensed under the MIT License.
