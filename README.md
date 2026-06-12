# 🌍 Carbon Footprint Awareness Platform

> Empower individuals to understand their environmental impact and take small, consistent actions that collectively drive massive change.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![GCP](https://img.shields.io/badge/GCP-Free%20Tier-4285f4)](https://cloud.google.com/free)

A comprehensive web application that helps users track, understand, and reduce their carbon footprint through personalized insights, gamification, and community engagement.

---

## ✨ Features

### 🎯 Core Functionality (MVP)

- **📝 Lifestyle Assessment** - Interactive quiz to calculate baseline carbon footprint
- **📊 Daily Tracking** - Log activities across Transport, Food, Energy, and Shopping
- **📈 Dashboard** - Visualize emissions with charts and trends
- **💡 Personalized Insights** - AI-powered tips and pattern detection
- **🏆 Challenges** - Gamified challenges with badges and achievements
- **👥 Community** - Share wins, tips, and stories with others

### 🚀 Coming Soon (Phase 2 & 3)

- Smart device integrations (Google Maps, smart meters)
- AI-powered recommendations
- Carbon offset marketplace
- Mobile app (React Native)
- Corporate wellness programs

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **State**: Zustand

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **Database**: Cloud Firestore (NoSQL)
- **Auth**: NextAuth.js v5

### Infrastructure (GCP Free Tier)
- **Hosting**: Cloud Run (2M requests/month free)
- **Database**: Cloud Firestore (1GB storage free)
- **Storage**: Cloud Storage (5GB free)
- **CI/CD**: Cloud Build (120 min/day free)
- **Monitoring**: Cloud Logging (50GB/month free)

**💰 Total Cost: $0/month** (within free tier limits)

---

## 📚 Documentation

### Planning & Architecture
- **[Project Summary](./PROJECT_SUMMARY.md)** - Overview and quick reference
- **[Design Document](./carbon-footprint-platform-design.md)** - Original design blueprint
- **[Technical Architecture](./TECHNICAL_ARCHITECTURE.md)** - System design and diagrams
- **[API Specification](./API_SPECIFICATION.md)** - Complete API reference

### Implementation Guides
- **[GCP Implementation Plan](./GCP_IMPLEMENTATION_PLAN.md)** - 7-week roadmap for GCP
- **[GCP Deployment Guide](./GCP_DEPLOYMENT_GUIDE.md)** - Detailed GCP setup instructions
- **[Getting Started](./GETTING_STARTED.md)** - Development environment setup
- **[Implementation Plan](./IMPLEMENTATION_PLAN.md)** - Original implementation plan (Vercel)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Google Cloud Platform account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/carbon-footprint-tracker.git
cd carbon-footprint-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### GCP Deployment

```bash
# Authenticate with GCP
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Deploy to Cloud Run
gcloud run deploy carbon-tracker --source .
```

For detailed setup instructions, see [GCP Deployment Guide](./GCP_DEPLOYMENT_GUIDE.md).

---

## 📊 Project Structure

```
carbon-footprint-tracker/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   └── onboarding/          # Quiz & onboarding
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── dashboard/           # Dashboard components
│   ├── tracking/            # Activity tracking
│   ├── challenges/          # Challenge components
│   └── community/           # Community feed
├── lib/                     # Utilities and services
│   ├── firebase/            # Firebase configuration
│   ├── services/            # Business logic
│   └── utils/               # Helper functions
├── public/                  # Static assets
├── types/                   # TypeScript types
└── docs/                    # Documentation
```

---

## 🎯 Development Roadmap

### Phase 1: MVP (7 weeks) ✅ Planning Complete

- [x] Project planning and architecture
- [ ] GCP setup and configuration
- [ ] Authentication system
- [ ] Onboarding flow
- [ ] Activity tracking
- [ ] Dashboard and visualization
- [ ] Insights and challenges
- [ ] Community feed
- [ ] Testing and deployment

### Phase 2: Integrations (Weeks 8-12)

- [ ] Google Maps integration
- [ ] Smart home devices
- [ ] Banking API integration
- [ ] AI recommendations
- [ ] Receipt scanning

### Phase 3: Advanced Features (Weeks 13-16)

- [ ] Mobile app
- [ ] Corporate programs
- [ ] Carbon offset marketplace
- [ ] Advanced analytics
- [ ] Social features

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📈 Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Activity logging frequency
- Challenge completion rate

### Impact Metrics
- Total CO₂ saved (platform-wide)
- Average reduction per user
- Goal achievement rate

### Technical Metrics
- Page load time < 3 seconds
- API response time < 1 second
- 99.9% uptime

---

## 🔒 Security

- Authentication via NextAuth.js
- Firestore security rules
- Input validation with Zod
- Secrets managed via GCP Secret Manager
- HTTPS enforced
- Rate limiting implemented

For security issues, please email security@example.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🌟 Acknowledgments

- Design inspired by leading carbon tracking platforms
- Emission factors from EPA, DEFRA, and IPCC
- Built with Next.js, Firebase, and Google Cloud Platform
- UI components from shadcn/ui

---

## 📞 Support

- **Documentation**: See [docs](./docs) folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/carbon-footprint-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/carbon-footprint-tracker/discussions)
- **Email**: support@example.com

---

## 🎯 Vision

> "Making carbon awareness empowering, simple, social, and actionable - transforming individual actions into collective impact."

Join us in building a platform that makes environmental responsibility accessible, engaging, and impactful for everyone.

---

**Built with 💚 for a sustainable future**

[![Deploy to GCP](https://img.shields.io/badge/Deploy%20to-GCP-4285f4?style=for-the-badge&logo=google-cloud)](./GCP_DEPLOYMENT_GUIDE.md)
[![View Docs](https://img.shields.io/badge/View-Documentation-blue?style=for-the-badge)](./PROJECT_SUMMARY.md)