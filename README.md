# FitMarket - Premium Gym Clothes E-Commerce Frontend

A modern, performance-optimized e-commerce frontend built with Next.js 14, TypeScript, and Tailwind CSS, specifically designed for selling premium gym clothes.

## 🚀 Features

- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** with custom design system
- **Athletic-focused** brand identity and color palette
- **Performance optimized** with SSR/SSG capabilities
- **Responsive design** with mobile-first approach
- **Accessibility compliant** (WCAG 2.1 AA)

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Linting:** ESLint + Prettier
- **Pre-commit:** Husky + lint-staged
- **Package Manager:** npm

## 🎨 Design System

### Brand Colors
- **Primary:** Athletic Black (#1a1a1a)
- **Performance:** Performance Red (#e53e3e)
- **Steel:** Steel Gray (#718096)
- **Energy:** Energy Orange (#fd7e14)
- **Success:** Success Green (#38a169)

### Typography
- **Body:** Inter
- **Display:** Bebas Neue

## 🚦 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fitmarket-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.config.example .env.local
# Edit .env.local with your actual values
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── styles/               # Additional styles
```

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `env.config.example` - Environment variables template

## 🎯 Development Guidelines

### Code Quality
- Follow TypeScript strict mode
- Use ESLint and Prettier for consistent formatting
- Write semantic HTML with proper ARIA labels
- Follow React best practices with functional components and hooks

### Git Workflow
- Use conventional commit messages
- Pre-commit hooks ensure code quality
- All code must pass linting and type checking

## 📊 Performance Targets

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Lighthouse Performance:** > 95
- **Lighthouse Accessibility:** > 95

## 🔮 Roadmap

- [ ] Authentication system
- [ ] Product catalog
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Order management
- [ ] Payment integration
- [ ] Admin dashboard

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

Please read the development guidelines before contributing to this project. 