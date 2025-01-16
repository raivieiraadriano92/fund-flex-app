# FundFlex: Finance Made Simple

FundFlex is a personal finance management mobile app built with Expo and Supabase. It helps users track expenses, set financial goals, and visualize their spending patterns.

## Project Structure

```
app/
├── (app)/                   # Protected routes
│   ├── (tabs)/             # Main tab navigation
│   ├── categories/
│   │   ├── [id].tsx       # Category form
│   │   ├── picker.tsx     # Category selector
│   │   └── quick-start.tsx# Quick start categories
│   ├── goals/
│   │   ├── [id].tsx       # Goal form
│   │   └── picker.tsx     # Goal selector
│   ├── settings/
│   │   ├── currency.tsx   # Currency settings
│   │   └── theme.tsx      # Theme settings
│   └── transactions/
│       ├── [id].tsx       # Transaction form
│       ├── filters.tsx    # Transaction filters
│       └── history.tsx    # Transaction history
├── components/
│   ├── features/          # Feature-specific components
│   ├── providers/         # Context providers
│   └── ui/               # Shared UI components
├── core/
│   ├── api/              # Supabase client functions
│   ├── config/           # Default configurations
│   ├── hooks/            # Custom hooks
│   ├── services/         # App services
│   │   ├── app-review.ts # App store review
│   │   └── events.ts     # Event emitter
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── validations/      # Zod schemas
├── lib/                  # react-native-reusables utilities
└── store/               # Zustand stores
    ├── auth.ts
    ├── categories.ts
    ├── currency.ts
    ├── goals.ts
    └── transactions.ts
```

## Key Features

### Authentication

- Apple/Google Sign In
- Anonymous Sign In (DEV mode only)
- Session management with Supabase

### Transaction Management

- Create/Edit/Delete transactions
- Recurring transactions support
- Period filtering
- Categories organization

### Goals

- Set financial goals
- Track progress
- Link transactions to goals

### Analytics

- Monthly overview chart
- Expense breakdown by category
- Custom date range filtering

## Core Utilities

### Theme System

- Light/Dark mode support
- Custom theme tokens
- Navigation theme integration

### Currency Handling

```typescript
interface Currency {
  code: string; // e.g., 'USD'
  symbol: string; // e.g., '$'
  locale: string; // e.g., 'en-US'
}
```

### Data Stores (Zustand)

- Auth store: Session management
- Categories store: CRUD operations
- Transactions store: CRUD + filtering
- Goals store: CRUD + progress tracking
- Currency store: Currency preferences

## API Integration

### Supabase Functions

```sql
-- Calculate balance with date range support
calculate_balance(
  user_id_param uuid,
  start_date timestamp default null,
  end_date timestamp default current_timestamp
)
```

### Database Schema

```sql
-- Key tables
transactions
categories
goals
profiles
```

## UI Components

### Core Components

- Button, Input, Select from react-native-reusables
- Custom Typography components
- Charts using react-native-gifted-charts

### Feature Components

- TransactionItem
- CategoryCard
- GoalProgress
- Analytics charts

## Getting Started

1. Environment Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn start
```

2. Environment Variables

```
# Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Authentication
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=

# Monitoring
EXPO_PUBLIC_SENTRY_DNS=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# Analytics
EXPO_PUBLIC_VEXO_API_KEY=
```

## Key Concepts

### Transaction Management

- Support for recurring transactions
- Date-based filtering
- Category organization

### Goals System

- Progress tracking
- Transaction linking
- Visual progress indicators

### Analytics

- Period-based filtering
- Multiple visualization options
- Real-time calculations

## Common Patterns

### Form Handling

- React Hook Form + Zod validation
- Consistent error handling
- Loading states

### Data Fetching

- Supabase queries
- Error boundaries
- Loading indicators

### Navigation

- Tab-based main navigation
- Modal presentations
- Deep linking support

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase for backend
- Zustand for state management
- React Hook Form + Zod
- NativeWind for styling
- React Native Gifted Charts
- Sentry for error tracking
- Vexo for analytics

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
