# Mobile Store

A modern e-commerce application for browsing and purchasing mobile phones, built with Next.js 16 and React 19.

## 🚀 Features

- **Product Catalog**: Browse and search through a catalog of mobile phones (displays first 20 phones initially)
- **Product Details**: View detailed specifications, storage options, colors, and similar products
- **Shopping Cart**: Add products to cart with selected storage and color options (persisted in localStorage)
- **Real-time Search**: API-based search filtering by name or brand with result count indicator
- **Internationalization**: Ready for multi-language support (currently English and Spanish)
- **Responsive Design**: Mobile-first design that works on all devices
- **Error Handling**: Comprehensive error states and loading indicators
- **Accessibility**: ARIA labels and semantic HTML throughout

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: SCSS Modules
- **Internationalization**: next-intl 4.7.0
- **Testing**:
  - **Unit Tests**: Jest + React Testing Library
  - **E2E Tests**: Cypress 15.9.0
- **Code Quality**: ESLint + Prettier

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://prueba-tecnica-api-tienda-moviles.onrender.com
NEXT_PUBLIC_API_KEY=87909682e6cd74208f41a6ef39fe4191
```

**Note**: All API requests are authenticated using the `x-api-key` header. The API key is automatically included in all requests via the API service layer (`src/services/api.ts`).

## 📁 Project Structure

```
mobile-store/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Home page
│   │   ├── cart/            # Cart page
│   │   └── products/[id]/  # Product detail page
│   ├── components/          # React components
│   │   ├── catalog/         # Product listing components
│   │   ├── product/         # Product detail components
│   │   ├── cart/            # Shopping cart components
│   │   ├── layout/          # Layout components (Navbar)
│   │   ├── ui/              # Reusable UI components
│   │   └── icons/           # Icon components
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── messages/                # i18n translation files
│   ├── en.json              # English translations
│   └── es.json              # Spanish translations
├── cypress/                 # E2E tests
│   ├── e2e/                 # Test files
│   └── support/             # Test utilities (actions, steps)
└── public/                  # Static assets
```

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests (Cypress)

```bash
# Open Cypress UI
npm run cypress:open

# Run tests headless
npm run cypress:run

# Run tests with browser visible
npm run cypress:run:headed
```

The Cypress tests are organized using a **Page Object Model** pattern with reusable actions and steps:

- **Actions** (`cypress/support/actions/`): Low-level, reusable actions
- **Steps** (`cypress/support/steps/`): High-level flows combining multiple actions
- **Commands** (`cypress/support/commands.ts`): Cypress custom commands

See `cypress/README.md` for detailed documentation.

## 🌍 Internationalization (i18n)

The application uses `next-intl` for internationalization. All user-facing text is stored in translation files:

- `messages/en.json` - English translations
- `messages/es.json` - Spanish translations

Currently, the app uses English as the default locale. The locale can be changed in `src/app/layout.tsx`.

### Adding Translations

1. Add the key-value pair to both `messages/en.json` and `messages/es.json`
2. Use the translation in components with `useTranslations()`:

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations();
return <button>{t('product.addToCart')}</button>;
```

## 🎨 Styling

The project uses **SCSS Modules** for component-scoped styling. Global styles and CSS variables are defined in `src/app/globals.scss`.

### Typography

The application uses the required font family: **Helvetica, Arial, sans-serif** (defined in `globals.scss`).

### CSS Variables

The design system uses CSS variables defined in `globals.scss`:

- Colors (primary, secondary, background, etc.)
- Spacing (xs, sm, md, lg, xl, 2xl)
- Typography (font-family: Helvetica, Arial, sans-serif)
- Border radius
- Transitions

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## ⚠️ Known Issues & Workarounds

### 1. Inconsistent Image Sizes

**Issue**: The backend API returns product images with varying dimensions. Images are not standardized in size.

**Solution**: The application uses Next.js `Image` component with `fill` prop and responsive `sizes` attribute to handle different image dimensions gracefully. Images are contained within fixed aspect ratio containers using CSS.

**Location**:

- `src/components/catalog/PhoneCard.tsx` (catalog images)
- `src/components/product/ProductDetail.tsx` (product detail images)

### 2. Duplicate Product IDs

**Issue**: The backend API occasionally returns products with duplicate IDs in the same response.

**Solution**: The frontend implements deduplication logic using the `dedupeById` utility function. This ensures that only unique products (by ID) are displayed, keeping the first occurrence of each ID.

**Implementation**:

```typescript
// src/utils/utils.ts
export function dedupeById<T extends { id: string | number }>(items: T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}
```

**Usage**: Applied in `src/components/catalog/Catalog.tsx`:

```typescript
const uniquePhones = useMemo(() => dedupeById(phones), [phones]);
```

### 3. Auto-Selection Behavior

**Note**: The `useProductSelection` hook automatically selects the first available option when one is selected:

- Selecting a storage option automatically selects the first color
- Selecting a color automatically selects the first storage option

This is intentional UX behavior to simplify the selection process, but it means the "Add to Cart" button becomes enabled immediately after selecting either option (not both).

## 🎯 Key Features Implementation

### Product Selection

The `useProductSelection` hook manages storage and color selection with auto-selection logic:

- Automatically selects the first color when storage is selected
- Automatically selects the first storage when color is selected
- Provides `reset()` method to clear selections

### Shopping Cart

- Cart state is persisted in `localStorage` (requirement: persistent cart)
- Each cart item is uniquely identified by `lineId` (combination of phoneId, storage, and color)
- Prevents duplicate items with the same phone + storage + color combination
- Cart count is displayed in the navbar with an icon
- Remove individual items functionality
- Total price calculation

### Search Functionality

- **API-based filtering** (requirement: use API filtering, not client-side)
- Debounced search (300ms delay) to reduce API calls
- **Result count indicator** showing number of products found (requirement)
- Loading states during search
- Error handling with user-friendly messages
- Empty state messages when no results found
- Filters by name or brand (requirement)

### Product Catalog

- **Displays first 20 phones** from the API on initial load (requirement)
- Grid layout with cards showing image, name, brand, and base price
- Click on phone card navigates to product detail page
- Responsive grid that adapts to screen size

### Error Handling

- Network error detection and user-friendly messages
- Product not found error page
- API error handling with fallback states
- Error states are accessible with proper ARIA attributes

## 🔄 Development vs Production Modes

### Development Mode

Run the development server with:

```bash
npm run dev
```

In development mode:

- Assets are served without minification
- Source maps are enabled for debugging
- Hot module replacement (HMR) is active
- Detailed error messages are shown

### Production Mode

Build and run the production server:

```bash
npm run build
npm start
```

In production mode (Next.js 16 default behavior):

- **Assets are automatically minified** using SWC (Rust-based compiler)
- **JavaScript bundles are concatenated and optimized**
- Code splitting by route segments
- Static rendering of components at build time
- Automatic optimization of images, fonts, and other assets

**Note**: Next.js 16 automatically handles minification and concatenation in production builds. No additional configuration is required. The build process uses the SWC compiler which is 17x faster than Babel and provides automatic optimizations.

## 🚀 Deployment

The application is deployed on **Vercel**.

**Live URL**: [https://mobile-store-five-murex.vercel.app/](https://mobile-store-five-murex.vercel.app/)

### Environment Variables

The following environment variables are configured in Vercel:

- `NEXT_PUBLIC_API_URL`: `https://prueba-tecnica-api-tienda-moviles.onrender.com`
- `NEXT_PUBLIC_API_KEY`: `87909682e6cd74208f41a6ef39fe4191`

## 📚 Additional Documentation

- [Cypress Testing Guide](./cypress/README.md) - Detailed documentation for E2E tests
- [i18n Configuration](./i18n.ts) - Internationalization setup

## 🤝 Contact

Marcela Vilas Boas (marcela.vilasboas@gmail.com)
