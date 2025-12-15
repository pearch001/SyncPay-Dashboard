# SyncPay Admin Dashboard

> A modern, AI-powered admin dashboard for managing offline transactions with intelligent insights and real-time analytics.

![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg)

## 📋 Overview

SyncPay Admin Dashboard is a sophisticated web application designed to manage and analyze offline payment transactions. It features an AI-powered insights chat that provides intelligent data visualization, trend analysis, and business intelligence through natural language conversations.

### Key Features

- 🤖 **AI Insights Chat** - Natural language interface for data queries with smart chart detection
- 📊 **Interactive Charts** - Beautiful, accessible data visualizations with export capabilities
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ♿ **Accessibility First** - WCAG compliant with screen reader support and keyboard navigation
- 🎨 **Color-Blind Friendly** - Alternative palettes for better accessibility
- 💾 **Export Options** - Download charts as PNG/CSV or copy data to clipboard
- 🔄 **Real-time Updates** - Live transaction monitoring and analytics
- 🌙 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SyncPay

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

### Core Technologies

- **React 19.2** - UI library with latest features
- **TypeScript 5.9** - Type-safe development
- **Vite 7.2** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework

### Key Libraries

- **Recharts 3.5** - Composable charting library
- **Zustand 5.0** - Lightweight state management
- **React Router 7.10** - Client-side routing
- **Axios 1.13** - HTTP client for API requests
- **Lucide React** - Beautiful icon set
- **React Hot Toast** - Elegant notifications
- **React Markdown** - Markdown rendering with syntax highlighting

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS transformations
- **Autoprefixer** - Automatic vendor prefixing

## 📁 Project Structure

```
SyncPay/
├── src/
│   ├── assets/          # Static assets (images, fonts)
│   ├── components/      # Reusable React components
│   │   ├── AIInsightCard.tsx
│   │   ├── AIThinkingInsights.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChartRenderer.tsx       # Interactive chart component
│   │   ├── CodeBlock.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── ConnectionStatus.tsx
│   │   ├── ConversationContext.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── ErrorAlert.tsx
│   │   ├── InfoModal.tsx
│   │   ├── MobileActionsMenu.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── SettingsModal.tsx
│   │   ├── ShortcutsHint.tsx
│   │   ├── StatCard.tsx
│   │   └── TypingIndicator.tsx
│   ├── pages/           # Page components
│   │   ├── Analytics.tsx
│   │   ├── InsightsChat.tsx        # AI chat interface
│   │   ├── Login.tsx
│   │   ├── Transactions.tsx
│   │   └── Users.tsx
│   ├── services/        # API services
│   │   ├── api.ts
│   │   └── chatApi.ts
│   ├── store/           # State management
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   └── dashboardStore.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── timeUtils.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Public static files
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── eslint.config.js     # ESLint configuration
└── README.md            # This file
```

## 🎯 Key Features Deep Dive

### AI Insights Chat

The AI chat interface enables natural language queries about your transaction data:

- **Smart Chart Detection** - Automatically detects when users want visualizations
- **Multi-Chart Support** - Line, bar, pie, donut, and area charts
- **Context Awareness** - Maintains conversation history for follow-up questions
- **Thinking Insights** - Shows AI processing steps for transparency

**Keywords that trigger chart mode:**
- Explicit: "show chart", "create graph", "visualize"
- Trends: "trend", "over time", "growth"
- Comparisons: "compare", "vs", "difference"
- Distribution: "breakdown", "distribution", "proportion"
- Metrics: "top", "bottom", "ranking"

### Interactive Charts

All charts include:

- **Enhanced Tooltips** - Formatted values (₦1.2M), percentages, and labels
- **Click Interactions** - Click data points for details, legend items to toggle series
- **Export Options** - PNG image, CSV data, or copy to clipboard
- **Fullscreen Mode** - Expand charts for detailed analysis
- **Responsive Design** - Adapts to mobile (250px) and desktop (300px)
- **Accessibility** - ARIA labels, keyboard navigation, color-blind friendly palettes

### State Management

Zustand stores for efficient state management:

- **authStore** - Authentication and user session
- **chatStore** - Chat messages, history, and metadata
- **dashboardStore** - Dashboard statistics and analytics

## 🎨 Styling

The project uses Tailwind CSS v4 with custom configuration:

- **Custom Colors** - Primary brand colors with shades
- **Responsive Breakpoints** - Mobile-first design
- **Dark Mode Support** - Ready for dark theme implementation
- **Custom Animations** - Smooth transitions and effects

## 🔌 API Integration

API services are structured for easy backend integration:

```typescript
// Example API call
import { sendChatMessage } from './services/chatApi';

const response = await sendChatMessage(message, conversationId, {
  includeCharts: true,
  contextWindow: 10
});
```

**Available API Methods:**
- `sendChatMessage` - Send chat message to AI
- `getChatHistory` - Retrieve conversation history (TODO)
- `deleteConversation` - Delete conversation (TODO)

## 🧪 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Code Quality

- **TypeScript** - Strict type checking enabled
- **ESLint** - Configured with React and TypeScript rules
- **Prettier** - Code formatting (recommended)

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Chart Types

The ChartRenderer component supports:

1. **Line Chart** - Time series and trend analysis
2. **Bar Chart** - Comparisons and categorical data
3. **Pie Chart** - Proportions and distributions
4. **Donut Chart** - Proportions with center space
5. **Area Chart** - Cumulative trends

Each chart type includes:
- Customizable colors
- Responsive sizing
- Interactive tooltips
- Export functionality
- Accessibility features

## ♿ Accessibility Features

- **ARIA Labels** - Proper semantic markup
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Descriptive labels and roles
- **Color-Blind Palettes** - Okabe-Ito palette option
- **Focus Management** - Clear focus indicators
- **High Contrast** - Readable color combinations

## 🔐 Authentication

Protected routes ensure secure access:

- Login page with credential validation
- Protected dashboard routes
- Session persistence
- Automatic redirect on auth failure

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Mobile-specific optimizations:
- Collapsible navigation
- Touch-optimized controls
- Reduced chart heights
- Abbreviated labels

## 🚧 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filtering and search
- [ ] Export full reports
- [ ] User management interface
- [ ] Customizable dashboard widgets
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced analytics

## 📝 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For questions or issues, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and Vite**
