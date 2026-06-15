# 🌍 Carbon Footprint Tracker - Frontend

A Next.js 14 application for tracking and reducing your carbon footprint.

## 🚀 Features

- **Authentication** - Sign up and sign in pages
- **Onboarding Quiz** - Interactive lifestyle assessment
- **Dashboard** - Carbon score widget with charts and visualizations
- **Activity Tracking** - Log daily activities across 4 categories
- **Challenges** - Gamified challenges with progress tracking
- **Community Feed** - Share wins, tips, and stories

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js v5 (ready for integration)
- **Database**: Firebase/Firestore (configured)

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your configuration
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🏃 Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   │   ├── signin/         # Sign in page
│   │   └── signup/         # Sign up page
│   ├── onboarding/         # Quiz and onboarding
│   ├── dashboard/          # Main dashboard
│   ├── tracking/           # Activity tracking
│   ├── challenges/         # Challenges page
│   ├── community/          # Community feed
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # React components
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/                    # Utilities and services
│   ├── firebase/           # Firebase configuration
│   ├── store/              # Zustand store
│   └── utils.ts            # Helper functions
├── types/                  # TypeScript types
│   └── index.ts            # Type definitions
└── public/                 # Static assets
```

## 🎨 Pages Overview

### Landing Page (`/`)
- Hero section with features
- Call-to-action buttons
- Statistics showcase

### Authentication
- **Sign In** (`/auth/signin`) - User login
- **Sign Up** (`/auth/signup`) - New user registration

### Onboarding (`/onboarding`)
- Interactive lifestyle quiz
- Baseline carbon footprint calculation
- Personalized recommendations

### Dashboard (`/dashboard`)
- Carbon score widget
- Daily/weekly emissions tracking
- Trend charts and visualizations
- Category breakdown (pie chart)
- Quick action cards

### Activity Tracking (`/tracking`)
- Category selection (Transport, Food, Energy, Shopping)
- Activity type selection
- Amount input with units
- Real-time emissions calculation

### Challenges (`/challenges`)
- Available challenges grid
- Active challenges with progress bars
- Enrollment functionality
- Streak tracking

### Community Feed (`/community`)
- Create posts (wins, tips, stories)
- Filter by post type
- Like functionality
- User profiles

## 🔌 API Integration

The frontend connects to the backend API at `NEXT_PUBLIC_API_URL`. Key endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/quiz/submit` - Submit quiz responses
- `GET /api/dashboard/summary` - Get dashboard data
- `POST /api/activities` - Log activity
- `GET /api/challenges` - Get challenges
- `POST /api/challenges/:id/enroll` - Enroll in challenge
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create post

## 🎯 Key Features Implementation

### Carbon Score Widget
- Real-time score display
- Score change indicator
- Today's emissions vs target
- Weekly and monthly totals

### Charts & Visualizations
- **Line Chart**: Weekly emissions trend
- **Pie Chart**: Category breakdown
- **Progress Bars**: Challenge progress

### Activity Tracking
- 4 main categories with icons
- Dynamic activity type selection
- Unit-based input (km, kg, kWh, etc.)
- Instant emissions feedback

### Gamification
- Challenges with badges
- Progress tracking
- Streak counters
- Achievement display

## 🔐 Authentication Flow

1. User signs up → Redirected to onboarding
2. User completes quiz → Baseline calculated
3. User redirected to dashboard
4. Subsequent logins → Direct to dashboard

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming
- **Responsive Design** for mobile/desktop
- **Green Color Scheme** (#22c55e primary)

## 📱 Responsive Design

All pages are fully responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid layouts adapt to screen size
- Touch-friendly buttons and inputs

## 🚧 Future Enhancements

- [ ] Real-time notifications
- [ ] Dark mode support
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Social sharing
- [ ] Export data functionality
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🌟 Acknowledgments

- Built with Next.js 14
- UI components inspired by shadcn/ui
- Charts powered by Recharts
- Icons from emoji set

---

**Built with 💚 for a sustainable future**
