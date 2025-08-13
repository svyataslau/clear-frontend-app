# Clear - React SPA

Modern Single Page Application (SPA) built with React + TypeScript with complete quality infrastructure.

## 🚀 Technologies

- **Build**: Vite + React + TypeScript
- **Router**: React Router DOM
- **Data**: TanStack Query (react-query) + axios
- **Forms/Validation**: React Hook Form + zod
- **Styling**: TailwindCSS
- **Testing**: Vitest + @testing-library/react / user-event
- **E2E**: Playwright (chromium)
- **Linter/Formatter**: Biome with recommended rules

## 📦 Installation and Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests with UI
npm run test:ui

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## 🔧 Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 📁 Project Structure

```
src/
├── api/              # API client and methods
├── components/       # React components
│   └── __tests__/   # Component unit tests
├── hooks/           # Custom hooks
├── pages/           # Application pages
├── schemas/         # Zod validation schemas
├── test/            # Test setup
├── types/           # TypeScript types
└── App.tsx          # Main component

tests/
└── e2e/             # Playwright E2E tests
```

## ✨ Functionality

### 🏠 Home Page
- Posts feed with infinite scrolling
- Form for creating new posts
- Likes with optimistic UI
- Form validation with Zod

### 📁 Upload Page
- Drag & drop file upload
- File size and type validation
- Manage uploaded files

### 🎨 UI/UX
- Modern design with TailwindCSS
- Responsive layout
- Accessibility (a11y) support
- Smooth animations and transitions

## 🛠️ API

The application uses mock API for functionality demonstration:

- `GET /posts` - get posts with pagination
- `POST /posts` - create new post
- `PUT /posts/:id/like` - toggle like

## 🧪 Testing

### Unit Tests
- Component testing with React Testing Library
- Hook and utility testing
- Coverage of main usage scenarios

### E2E Tests
- Navigation testing
- Post creation testing
- File upload testing
- Like testing

## 📋 Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `preview` | Preview build |
| `lint` | Lint code with Biome |
| `format` | Format code with Biome |
| `test` | Run unit tests |
| `test:ui` | Run unit tests with UI |
| `test:e2e` | Run e2e tests |
| `test:e2e:ui` | Run e2e tests with UI |

## 🚀 Deployment

The project is ready for deployment on any platform that supports static sites:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📄 Лицензия

MIT
