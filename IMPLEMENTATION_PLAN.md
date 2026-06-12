# 🌍 Carbon Footprint Platform - MVP Implementation Plan

## 📋 Executive Summary

This plan outlines the implementation strategy for the Carbon Footprint Awareness Platform MVP (Phase 1), focusing on core features that deliver immediate value while establishing a scalable foundation for future enhancements.

---

## 🎯 MVP Scope (Phase 1)

Based on the design document, the MVP will include:

- ✅ Lifestyle quiz + baseline carbon score
- ✅ Manual daily logging (transport, food, energy, shopping)
- ✅ Dashboard with weekly/monthly trends
- ✅ 3-5 personalized tips per week
- ✅ One active challenge at a time
- ✅ Basic community feed

---

## 🛠️ Recommended Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Zustand (for complex state)
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form + Zod validation

**Rationale**: Next.js provides excellent DX, built-in API routes, SSR/SSG capabilities, and easy deployment. TypeScript ensures type safety and better maintainability.

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes (for MVP simplicity)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Validation**: Zod

**Rationale**: Using Next.js full-stack approach reduces complexity for MVP. Prisma offers excellent TypeScript integration and migration management.

### Database
- **Primary DB**: PostgreSQL 15+
- **Caching**: Redis (optional for MVP, add in Phase 2)
- **Hosting**: Vercel Postgres or Supabase

**Rationale**: PostgreSQL is robust, scalable, and has excellent JSON support for flexible data structures.

### DevOps & Tools
- **Hosting**: Vercel (frontend + API)
- **Database**: Vercel Postgres or Supabase
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions + Vercel auto-deploy
- **Monitoring**: Vercel Analytics + Sentry (error tracking)
- **Testing**: Vitest + React Testing Library + Playwright

---

## 📊 Database Schema Design

### Core Tables

```sql
-- Users
users
  - id (uuid, PK)
  - email (unique)
  - name
  - avatar_url
  - created_at
  - updated_at

-- User Profiles
user_profiles
  - id (uuid, PK)
  - user_id (FK -> users)
  - carbon_score (integer, 0-100)
  - baseline_emissions (decimal, kg CO2/day)
  - reduction_goal_percentage (integer)
  - goal_deadline (date)
  - country
  - city
  - household_size
  - created_at
  - updated_at

-- Quiz Responses
quiz_responses
  - id (uuid, PK)
  - user_id (FK -> users)
  - question_id
  - answer
  - created_at

-- Activity Logs
activity_logs
  - id (uuid, PK)
  - user_id (FK -> users)
  - category (enum: transport, food, energy, shopping)
  - activity_type (string)
  - amount (decimal)
  - unit (string)
  - emissions_kg (decimal, calculated)
  - date (date)
  - notes (text, optional)
  - created_at

-- Emission Factors (reference data)
emission_factors
  - id (uuid, PK)
  - category (enum)
  - activity_type (string)
  - factor_kg_co2_per_unit (decimal)
  - unit (string)
  - source (string)
  - region (string, optional)
  - created_at
  - updated_at

-- User Insights
user_insights
  - id (uuid, PK)
  - user_id (FK -> users)
  - insight_type (enum: pattern, suggestion, celebration)
  - title (string)
  - description (text)
  - priority (integer)
  - is_read (boolean)
  - created_at
  - expires_at (date, optional)

-- Challenges
challenges
  - id (uuid, PK)
  - title (string)
  - description (text)
  - category (enum)
  - duration_days (integer)
  - target_reduction_kg (decimal)
  - badge_icon (string)
  - is_active (boolean)
  - created_at

-- User Challenges
user_challenges
  - id (uuid, PK)
  - user_id (FK -> users)
  - challenge_id (FK -> challenges)
  - status (enum: active, completed, failed)
  - start_date (date)
  - end_date (date)
  - progress_percentage (integer)
  - emissions_saved_kg (decimal)
  - created_at
  - updated_at

-- Achievements
achievements
  - id (uuid, PK)
  - user_id (FK -> users)
  - badge_type (string)
  - badge_name (string)
  - earned_at (timestamp)

-- Community Posts
community_posts
  - id (uuid, PK)
  - user_id (FK -> users)
  - content (text)
  - post_type (enum: win, tip, story)
  - likes_count (integer)
  - created_at
  - updated_at

-- Post Likes
post_likes
  - id (uuid, PK)
  - post_id (FK -> community_posts)
  - user_id (FK -> users)
  - created_at
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │   Tracking   │  │  Community   │      │
│  │     Page     │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                    NEXT.JS APPLICATION                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              API ROUTES (/app/api/*)                 │    │
│  │                                                       │    │
│  │  /auth/*        /activities/*    /insights/*         │    │
│  │  /quiz/*        /challenges/*    /community/*        │    │
│  │  /profile/*     /dashboard/*     /calculations/*     │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                  │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │              BUSINESS LOGIC LAYER                      │  │
│  │                                                         │  │
│  │  • Carbon Calculator Service                           │  │
│  │  • Insights Generator Service                          │  │
│  │  • Challenge Manager Service                           │  │
│  │  • Analytics Service                                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                  │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │                  PRISMA ORM                            │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                    POSTGRESQL DATABASE                         │
│                                                               │
│  • User data          • Activity logs      • Challenges       │
│  • Emission factors   • Insights           • Community posts  │
└───────────────────────────────────────────────────────────────┘
```

---

## 📝 Detailed Implementation Steps

### Step 1: Project Foundation (Week 1)

**Tasks:**
1. Initialize Next.js 14 project with TypeScript
2. Set up project structure and folder organization
3. Configure Tailwind CSS and shadcn/ui
4. Set up ESLint, Prettier, and Git hooks
5. Initialize PostgreSQL database (Vercel Postgres or Supabase)
6. Set up Prisma ORM and create initial schema
7. Configure NextAuth.js for authentication
8. Set up environment variables and configuration

**Folder Structure:**
```
carbon-footprint-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── track/
│   │   ├── challenges/
│   │   └── community/
│   ├── api/
│   │   ├── auth/
│   │   ├── activities/
│   │   ├── quiz/
│   │   ├── insights/
│   │   ├── challenges/
│   │   └── community/
│   ├── onboarding/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── dashboard/
│   ├── tracking/
│   ├── challenges/
│   └── community/
├── lib/
│   ├── db.ts (Prisma client)
│   ├── auth.ts (NextAuth config)
│   ├── services/
│   │   ├── carbon-calculator.ts
│   │   ├── insights-generator.ts
│   │   └── challenge-manager.ts
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
└── types/
```

**Deliverables:**
- Working Next.js application with authentication
- Database schema implemented and migrated
- Basic routing structure in place

---

### Step 2: Database Schema & Seed Data (Week 1-2)

**Tasks:**
1. Create Prisma schema with all MVP tables
2. Generate and run initial migration
3. Create seed script for emission factors
4. Populate emission factors database with reference data
5. Create database indexes for performance
6. Set up database backup strategy

**Emission Factors Data Sources:**
- EPA emission factors (US)
- DEFRA conversion factors (UK)
- IPCC guidelines
- Custom calculations for common activities

**Sample Emission Factors:**
```typescript
// Transport (kg CO2 per km)
- Car (petrol): 0.192
- Car (diesel): 0.171
- Car (electric): 0.053
- Bus: 0.089
- Train: 0.041
- Flight (short-haul): 0.255
- Flight (long-haul): 0.195

// Food (kg CO2 per kg)
- Beef: 27.0
- Lamb: 39.2
- Pork: 12.1
- Chicken: 6.9
- Fish: 6.1
- Dairy milk: 1.9
- Plant milk: 0.9
- Vegetables: 2.0

// Energy (kg CO2 per kWh)
- Grid electricity (varies by region): 0.233-0.850
- Natural gas: 0.185
- Heating oil: 0.247
```

**Deliverables:**
- Complete database schema
- Seeded emission factors database
- Database documentation

---

### Step 3: Authentication System (Week 2)

**Tasks:**
1. Implement NextAuth.js configuration
2. Create login/signup pages
3. Add email/password authentication
4. Implement session management
5. Create protected route middleware
6. Add user profile creation on signup
7. Implement password reset flow

**API Endpoints:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/reset-password` - Password reset

**Deliverables:**
- Working authentication system
- Protected routes
- User session management

---

### Step 4: Onboarding & Lifestyle Quiz (Week 2-3)

**Tasks:**
1. Design quiz questions covering all categories
2. Create multi-step quiz UI component
3. Implement quiz logic and state management
4. Build carbon score calculation algorithm
5. Create baseline assessment results page
6. Implement goal-setting interface
7. Store quiz responses and user profile

**Quiz Categories & Sample Questions:**

**Transport:**
- How do you commute to work/school? (car, public transport, bike, walk)
- Average daily commute distance?
- How many flights per year?

**Food:**
- How often do you eat meat? (daily, few times/week, rarely, never)
- Dairy consumption level?
- Food waste habits?

**Energy:**
- Home type and size?
- Heating/cooling usage?
- Renewable energy usage?

**Shopping:**
- Shopping frequency?
- New vs. second-hand purchases?
- Recycling habits?

**Carbon Score Algorithm:**
```typescript
// Simplified scoring (0-100, lower is better)
score = 100 - (
  (annual_emissions_kg / average_national_emissions) * 50
)

// Adjust for:
- Household size
- Regional factors
- Income level (optional)
```

**Deliverables:**
- Interactive quiz flow
- Carbon score calculation
- Baseline assessment results
- User profile with goals

---

### Step 5: Carbon Calculation Engine (Week 3)

**Tasks:**
1. Create carbon calculator service
2. Implement calculation logic for each category
3. Add unit conversion utilities
4. Create emission factor lookup system
5. Implement caching for frequently used calculations
6. Add validation for input data
7. Create calculation audit trail

**Calculator Service Structure:**
```typescript
class CarbonCalculator {
  calculateTransport(type, distance, unit): number
  calculateFood(foodType, amount, unit): number
  calculateEnergy(energyType, amount, unit): number
  calculateShopping(category, amount): number
  
  getTotalDailyEmissions(userId, date): number
  getWeeklyEmissions(userId, startDate): number
  getMonthlyEmissions(userId, month, year): number
  
  compareToBaseline(userId, currentEmissions): ComparisonResult
  calculateReductionPercentage(baseline, current): number
}
```

**API Endpoints:**
- `POST /api/calculations/calculate` - Calculate emissions for activity
- `GET /api/calculations/daily/:date` - Get daily total
- `GET /api/calculations/weekly` - Get weekly summary
- `GET /api/calculations/monthly` - Get monthly summary

**Deliverables:**
- Working carbon calculator service
- Calculation API endpoints
- Unit tests for calculations

---

### Step 6: Daily Tracking & Logging (Week 3-4)

**Tasks:**
1. Create activity logging UI
2. Build quick-add activity buttons
3. Implement activity form with validation
4. Create activity history view
5. Add edit/delete functionality
6. Implement date picker for backdating
7. Create activity categories and types
8. Add notes/comments to activities

**Activity Logging UI Features:**
- Quick-tap categories (Transport, Food, Energy, Shopping)
- Pre-defined activity types per category
- Amount input with unit selection
- Date/time picker
- Optional notes field
- Instant emission calculation preview

**API Endpoints:**
- `POST /api/activities` - Log new activity
- `GET /api/activities` - Get user activities (with filters)
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/summary` - Get daily/weekly summary

**Deliverables:**
- Activity logging interface
- Activity management system
- Activity history view

---

### Step 7: Dashboard & Visualization (Week 4-5)

**Tasks:**
1. Design dashboard layout
2. Create carbon score widget
3. Build daily emissions tracker
4. Implement weekly/monthly trend charts
5. Create category breakdown pie chart
6. Add goal progress indicator
7. Build comparison widgets (vs. baseline, vs. average)
8. Implement responsive design

**Dashboard Components:**

**Carbon Score Card:**
- Current score (0-100)
- Score change indicator
- Visual meter/gauge

**Daily Tracker:**
- Today's total emissions
- Daily target
- Progress bar
- Category breakdown

**Trend Chart:**
- Line chart showing emissions over time
- Weekly/monthly view toggle
- Highlight reduction milestones

**Category Breakdown:**
- Pie chart or bar chart
- Percentage per category
- Drill-down capability

**Goal Progress:**
- Reduction goal percentage
- Current progress
- Days remaining
- Projected completion

**API Endpoints:**
- `GET /api/dashboard/summary` - Get dashboard data
- `GET /api/dashboard/trends` - Get trend data
- `GET /api/dashboard/breakdown` - Get category breakdown
- `GET /api/dashboard/goals` - Get goal progress

**Deliverables:**
- Complete dashboard interface
- Data visualization components
- Responsive design

---

### Step 8: Personalized Insights & Tips (Week 5)

**Tasks:**
1. Create insights generation algorithm
2. Build pattern detection logic
3. Implement tip recommendation system
4. Create insights display UI
5. Add insight prioritization
6. Implement read/unread tracking
7. Create insight notification system

**Insight Types:**

**Pattern Detection:**
- High emission days/times
- Category trends
- Behavioral patterns

**Suggestions:**
- Alternative activities
- Reduction opportunities
- Quick wins

**Celebrations:**
- Milestones reached
- Streaks maintained
- Goals achieved

**Insight Generation Logic:**
```typescript
class InsightsGenerator {
  analyzePatterns(userId, timeframe): Pattern[]
  generateSuggestions(userId, patterns): Suggestion[]
  detectMilestones(userId): Milestone[]
  prioritizeInsights(insights): PrioritizedInsight[]
  
  // Example patterns:
  - "You drive most on Tuesdays"
  - "Your energy usage spikes on weekends"
  - "Beef consumption is your highest food emission"
}
```

**API Endpoints:**
- `GET /api/insights` - Get user insights
- `POST /api/insights/:id/read` - Mark insight as read
- `GET /api/insights/tips` - Get personalized tips

**Deliverables:**
- Insights generation system
- Tips recommendation engine
- Insights display interface

---

### Step 9: Challenges & Gamification (Week 5-6)

**Tasks:**
1. Create challenge templates
2. Build challenge enrollment system
3. Implement progress tracking
4. Create badge/achievement system
5. Build challenge UI components
6. Add streak tracking
7. Implement XP/points system
8. Create level progression

**Challenge Types:**

**Weekly Challenges:**
- Car-Free Week
- Meatless Week
- Zero Waste Week
- Energy Saver Week

**Monthly Challenges:**
- Reduce by 10%
- 30-Day Streak
- Category Champion

**Achievement Badges:**
- 🌱 First Week Complete
- 🚲 Car-Free Champion
- 🥗 Plant-Based Pioneer
- ⚡ Energy Saver
- 🌿 50kg CO₂ Saved
- 🌳 100kg CO₂ Saved
- 🏅 Century Saver

**Gamification Elements:**
```typescript
// XP System
- Log activity: +10 XP
- Complete challenge: +100 XP
- Maintain streak: +5 XP/day
- Share to community: +20 XP

// Levels
- Level 1: Climate Newbie (0-100 XP)
- Level 2: Eco Warrior (100-500 XP)
- Level 3: Green Champion (500-1000 XP)
- Level 4: Climate Hero (1000-2500 XP)
- Level 5: Planet Protector (2500+ XP)
```

**API Endpoints:**
- `GET /api/challenges` - Get available challenges
- `POST /api/challenges/:id/enroll` - Enroll in challenge
- `GET /api/challenges/active` - Get user's active challenges
- `GET /api/challenges/:id/progress` - Get challenge progress
- `GET /api/achievements` - Get user achievements

**Deliverables:**
- Challenge system
- Badge/achievement system
- Gamification mechanics
- Challenge UI

---

### Step 10: Basic Community Feed (Week 6)

**Tasks:**
1. Create community post model
2. Build post creation UI
3. Implement post feed
4. Add like functionality
5. Create post filtering (wins, tips, stories)
6. Implement basic moderation
7. Add user profiles in feed

**Community Features:**

**Post Types:**
- 🎉 Wins (achievements, milestones)
- 💡 Tips (advice, recommendations)
- 📖 Stories (personal experiences)

**Feed Features:**
- Chronological feed
- Filter by post type
- Like posts
- View user profiles
- Simple text posts (no images in MVP)

**API Endpoints:**
- `POST /api/community/posts` - Create post
- `GET /api/community/posts` - Get feed
- `POST /api/community/posts/:id/like` - Like post
- `DELETE /api/community/posts/:id/like` - Unlike post
- `GET /api/community/posts/:id` - Get single post

**Deliverables:**
- Community feed interface
- Post creation system
- Like functionality

---

### Step 11: Testing (Week 6-7)

**Tasks:**
1. Set up testing framework (Vitest + React Testing Library)
2. Write unit tests for services
3. Write integration tests for API routes
4. Create component tests
5. Set up E2E tests with Playwright
6. Implement test coverage reporting
7. Create CI/CD pipeline with tests

**Testing Strategy:**

**Unit Tests:**
- Carbon calculator functions
- Insights generator logic
- Utility functions

**Integration Tests:**
- API endpoints
- Database operations
- Authentication flows

**Component Tests:**
- UI components
- Form validation
- User interactions

**E2E Tests:**
- Complete user journeys
- Onboarding flow
- Activity logging flow
- Challenge enrollment

**Deliverables:**
- Comprehensive test suite
- CI/CD pipeline
- Test coverage reports

---

### Step 12: Deployment & Monitoring (Week 7)

**Tasks:**
1. Set up Vercel project
2. Configure environment variables
3. Set up database connection
4. Deploy to staging environment
5. Configure custom domain
6. Set up Sentry for error tracking
7. Configure Vercel Analytics
8. Create deployment documentation

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data loaded
- [ ] SSL certificate configured
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Performance monitoring active
- [ ] Backup strategy in place

**Deliverables:**
- Deployed staging environment
- Monitoring and analytics
- Deployment documentation

---

## 📅 Timeline Summary

| Week | Focus Area | Key Deliverables |
|------|-----------|------------------|
| 1 | Foundation & Database | Project setup, database schema, seed data |
| 2 | Auth & Onboarding | Authentication, lifestyle quiz |
| 3 | Core Tracking | Carbon calculator, activity logging |
| 4 | Dashboard | Data visualization, trend charts |
| 5 | Insights & Challenges | Personalized tips, gamification |
| 6 | Community & Testing | Community feed, test suite |
| 7 | Deployment | Staging deployment, monitoring |

**Total MVP Timeline: 7 weeks**

---

## 🎨 Design System & UI Components

### Color Palette
```css
/* Primary Colors */
--green-50: #f0fdf4
--green-500: #22c55e (primary action)
--green-700: #15803d (hover)

/* Semantic Colors */
--red-500: #ef4444 (high emissions)
--yellow-500: #eab308 (medium emissions)
--green-500: #22c55e (low emissions)

/* Neutral Colors */
--gray-50: #f9fafb
--gray-900: #111827
```

### Key UI Components
- Carbon Score Meter
- Activity Quick-Add Buttons
- Emission Category Cards
- Trend Charts (Line, Bar, Pie)
- Challenge Cards
- Badge Display
- Community Post Cards
- Progress Bars
- Goal Trackers

---

## 🔒 Security Considerations

1. **Authentication:**
   - Secure password hashing (bcrypt)
   - JWT token management
   - Session timeout
   - CSRF protection

2. **Data Protection:**
   - Input validation (Zod)
   - SQL injection prevention (Prisma)
   - XSS protection
   - Rate limiting

3. **Privacy:**
   - User data encryption
   - GDPR compliance
   - Data export capability
   - Account deletion

---

## 📊 Success Metrics (MVP)

### User Engagement
- Daily active users (DAU)
- Weekly active users (WAU)
- Average session duration
- Activity logging frequency

### Feature Adoption
- Quiz completion rate
- Challenge enrollment rate
- Community post creation rate
- Dashboard visit frequency

### Impact Metrics
- Average carbon reduction per user
- Total CO₂ saved (platform-wide)
- Goal achievement rate
- User retention (7-day, 30-day)

---

## 🚀 Post-MVP Roadmap (Phase 2 & 3)

### Phase 2: Integrations & AI (Weeks 8-12)
- Google Maps integration for automatic travel tracking
- Smart home device integrations
- Banking API for purchase categorization
- AI-powered recommendations
- Receipt scanning with OCR
- Voice logging

### Phase 3: Social & Corporate (Weeks 13-16)
- Advanced social features (groups, messaging)
- Leaderboards (city, company, friends)
- Corporate wellness programs
- Carbon offset marketplace
- Advanced analytics and reports
- Mobile app (React Native)

---

## 💰 Estimated Costs (Monthly)

### MVP Infrastructure
- Vercel Pro: $20/month
- PostgreSQL (Vercel/Supabase): $25/month
- Domain: $1/month
- Sentry (error tracking): Free tier
- Total: ~$46/month

### Scaling Costs (1000+ users)
- Vercel Pro: $20/month
- Database: $50-100/month
- Redis caching: $10/month
- CDN: $10/month
- Total: ~$90-140/month

---

## 🎯 Next Steps

1. **Review this plan** - Confirm scope and timeline
2. **Set up development environment** - Install tools and dependencies
3. **Create project repository** - Initialize Git and GitHub
4. **Begin Step 1** - Project foundation and setup

---

## 📚 Resources & References

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Carbon Data Sources
- [EPA Emission Factors](https://www.epa.gov/climateleadership/ghg-emission-factors-hub)
- [DEFRA Conversion Factors](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting)
- [IPCC Guidelines](https://www.ipcc.ch/report/2019-refinement-to-the-2006-ipcc-guidelines-for-national-greenhouse-gas-inventories/)

### Design Inspiration
- [Carbon Footprint Calculator](https://www.carbonfootprint.com)
- [Oroeco](https://www.oroeco.com)
- [JouleBug](https://joulebug.com)

---

**Document Version:** 1.0  
**Created:** June 12, 2026  
**Status:** Ready for Implementation