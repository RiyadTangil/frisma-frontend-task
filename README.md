# Next.js Prisma Demo

This is a demonstration of a Next.js application with Prisma ORM, PostgreSQL on Neon, and Datadog APM/RUM integration. The application showcases a type-friendly Prisma utility for finding Masjids with their Banks and latest Deposits.

## Features

- **Next.js Page Router**: Utilizes the traditional Page Router architecture
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Type-friendly Prisma Utilities**: Custom utilities with perfect autocompletion
- **Zod Validation**: Robust API validation with readable error messages
- **Datadog APM & RUM**: Comprehensive application monitoring
- **Tailwind CSS**: Utility-first CSS framework for styling

## Type-friendly Prisma Utility

The project includes a custom Prisma utility called `findMasjidWithBanksWithLatestDeposit` that provides perfect autocompletion as if it were a first-class Prisma utility. This utility allows you to:

- Find a Masjid with its Banks and their latest Deposits
- Maintain full type safety throughout the query
- Use the familiar Prisma API pattern

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@db.example.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_DD_CLIENT_TOKEN="your_datadog_client_token"
   NEXT_PUBLIC_DD_APPLICATION_ID="your_datadog_application_id"
   NEXT_PUBLIC_DD_SITE="datadoghq.com"
   NEXT_PUBLIC_DD_SERVICE="nextjs-prisma-demo"
   NEXT_PUBLIC_DD_ENV="development"
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following database schema:

- **Masjid**: Represents a mosque with basic information
- **Bank**: Represents a bank account associated with a Masjid
- **Deposit**: Represents a deposit made to a bank account

## API Routes

The application includes RESTful API routes with Zod validation:

- `GET /api/masjids`: Get a list of Masjids with pagination
- `POST /api/masjids`: Create a new Masjid with validation

## Datadog Integration

The application integrates with Datadog for monitoring:

- **Real User Monitoring (RUM)**: Track user interactions and page performance
- **Application Performance Monitoring (APM)**: Monitor server-side performance

## Deployment

The application is designed to be deployed on Vercel, with the database hosted on Neon PostgreSQL.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Quick Reference

### Project Structure
```
vote-frontend/
├── lib/
│   ├── prisma/
│   │   └── utils.ts    # Type-friendly Prisma utilities
│   └── datadog/
│       └── index.ts    # Datadog APM & RUM setup
├── pages/
│   ├── api/
│   │   └── masjids/    # API routes for Masjid operations
│   └── index.tsx       # Main page with Masjid listing
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts        # Database seeding script
└── .env               # Environment variables
```

### Common Issues

1. **Package.json Not Found Error**
   - Error: `npm error: Could not read package.json`
   - Solution: Make sure you're in the correct directory
   ```bash
   cd vote-frontend    # Navigate to the project directory first
   npm run dev        # Then run the development server
   ```

2. **Database Tables Missing**
   - Solution: Run these commands in order:
   ```bash
   npx prisma generate     # Generate Prisma Client
   npx prisma db push      # Push schema changes to database
   npx prisma db seed      # Seed initial data
   ```

3. **Available Masjids**
   The application includes six pre-seeded Masjids:
   - Masjid Al-Noor (New York)
   - Masjid Al-Iman (Chicago)
   - Masjid Al-Taqwa (Los Angeles)
   - Masjid Al-Rahman (Houston)
   - Masjid Al-Huda (Miami)
   - Masjid Al-Salam (Seattle)

### Important Commands

```bash
# Development
npm run dev           # Start development server

# Database Operations
npx prisma generate   # Generate Prisma Client
npx prisma db push    # Push schema changes to database
npx prisma db seed    # Seed the database
```
# frisma-frontend-task
