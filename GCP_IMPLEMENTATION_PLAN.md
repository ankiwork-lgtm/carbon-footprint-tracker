# 🌍 Carbon Footprint Platform - GCP Free Tier Implementation Plan

## 📋 Executive Summary

This implementation plan is specifically optimized for **Google Cloud Platform's Always Free tier**, ensuring **$0/month hosting costs** while building a fully functional Carbon Footprint Awareness Platform MVP.

---

## 🆓 GCP Free Tier Architecture

### Technology Stack (Zero Cost)

| Component | Technology | Free Tier Limit | Cost |
|-----------|-----------|-----------------|------|
| **Frontend + Backend** | Next.js 14 on Cloud Run | 2M requests/month | $0 |
| **Database** | Cloud Firestore | 1GB storage, 50K reads, 20K writes/day | $0 |
| **File Storage** | Cloud Storage | 5GB storage | $0 |
| **Authentication** | NextAuth.js + Firestore | Included in Firestore limits | $0 |
| **CI/CD** | Cloud Build | 120 build-minutes/day | $0 |
| **Monitoring** | Cloud Logging | 50GB logs/month | $0 |
| **Secrets** | Secret Manager | 6 active secrets | $0 |
| **Background Jobs** | Cloud Functions | 2M invocations/month | $0 |

**Total Monthly Cost: $0** ✅

---

## 🏗️ Updated System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                          │
└───────────────────────────┬───────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              CLOUD RUN (Next.js 14 Application)              │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Server Components + API Routes + Client Components   │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │
                ▼                     ▼
┌───────────────────────┐   ┌──────────────────────┐
│   CLOUD FIRESTORE     │   │   CLOUD STORAGE      │
│   (NoSQL Database)    │   │   (Static Assets)    │
│                       │   │                      │
│  • Users              │   │  • Images            │
│  • Activities         │   │  • Avatars           │
│  • Challenges         │   │  • Icons             │
│  • Community Posts    │   │                      │
└───────────────────────┘   └──────────────────────┘
```

---

## 📊 Firestore Data Model

### Collections Structure

```
firestore/
├── users/
│   └── {userId}/
│       ├── profile/
│       │   └── data (carbonScore, baseline, goals)
│       ├── activities/
│       │   └── {activityId}/ (category, emissions, date)
│       ├── insights/
│       │   └── {insightId}/ (type, title, description)
│       ├── userChallenges/
│       │   └── {challengeId}/ (status, progress)
│       └── achievements/
│           └── {achievementId}/ (badge, earnedAt)
│
├── challenges/ (global)
│   └── {challengeId}/ (title, description, target)
│
├── emissionFactors/ (global)
│   └── {factorId}/ (category, type, factor, unit)
│
└── communityPosts/
    └── {postId}/ (userId, content, likes, createdAt)
```

### Key Differences from PostgreSQL

| PostgreSQL | Firestore | Adaptation |
|------------|-----------|------------|
| Foreign keys | Document references | Use document paths |
| JOINs | Denormalization | Duplicate data strategically |
| Transactions | Batch writes | Use batched operations |
| Complex queries | Simple queries + client-side filtering | Pre-compute aggregations |
| Indexes | Automatic + composite | Create indexes for common queries |

---

## 📝 Implementation Steps (7 Weeks)

### Week 1: GCP Setup & Foundation

**Day 1-2: GCP Project Setup**
- [ ] Create GCP project
- [ ] Enable required APIs (Cloud Run, Firestore, Storage, Build)
- [ ] Set up billing alerts (even for free tier monitoring)
- [ ] Configure IAM roles and service accounts
- [ ] Set up Secret Manager for credentials

**Day 3-4: Firestore Database Setup**
- [ ] Initialize Firestore in Native mode
- [ ] Design and document collection structure
- [ ] Create Firestore security rules
- [ ] Set up composite indexes
- [ ] Create seed data script for emission factors

**Day 5-7: Next.js Project Initialization**
- [ ] Initialize Next.js 14 with TypeScript
- [ ] Install Firebase SDK (client + admin)
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up project folder structure
- [ ] Create Dockerfile for Cloud Run
- [ ] Configure cloudbuild.yaml for CI/CD
- [ ] Test local development environment

**Deliverables:**
- Working GCP project with all services enabled
- Firestore database with security rules
- Next.js app running locally
- CI/CD pipeline configured

---

### Week 2: Authentication & Onboarding

**Day 1-3: Authentication System**
- [ ] Install NextAuth.js with Firestore adapter
- [ ] Create login/signup pages
- [ ] Implement email/password authentication
- [ ] Set up session management
- [ ] Create protected route middleware
- [ ] Test authentication flow

**Day 4-7: Lifestyle Quiz & Onboarding**
- [ ] Design quiz questions (transport, food, energy, shopping)
- [ ] Create multi-step quiz UI
- [ ] Implement quiz state management
- [ ] Build carbon score calculation algorithm
- [ ] Create baseline assessment results page
- [ ] Implement goal-setting interface
- [ ] Store quiz data in Firestore

**Deliverables:**
- Working authentication system
- Complete onboarding flow
- Baseline carbon score calculation

---

### Week 3: Carbon Calculator & Activity Tracking

**Day 1-3: Carbon Calculation Engine**
- [ ] Create carbon calculator service
- [ ] Implement calculation logic for each category
- [ ] Add unit conversion utilities
- [ ] Create emission factor lookup from Firestore
- [ ] Add validation for input data
- [ ] Write unit tests for calculations

**Day 4-7: Activity Logging System**
- [ ] Create activity logging UI
- [ ] Build quick-add activity buttons
- [ ] Implement activity form with validation
- [ ] Create activity history view
- [ ] Add edit/delete functionality
- [ ] Implement date picker for backdating
- [ ] Store activities in Firestore subcollections

**Deliverables:**
- Working carbon calculator
- Activity logging interface
- Activity management system

---

### Week 4: Dashboard & Visualization

**Day 1-3: Dashboard Layout**
- [ ] Design dashboard layout
- [ ] Create carbon score widget
- [ ] Build daily emissions tracker
- [ ] Add goal progress indicator
- [ ] Implement responsive design

**Day 4-7: Data Visualization**
- [ ] Implement weekly/monthly trend charts (Recharts)
- [ ] Create category breakdown pie chart
- [ ] Build comparison widgets (vs baseline, vs average)
- [ ] Add data aggregation queries
- [ ] Optimize Firestore queries with indexes
- [ ] Implement client-side caching

**Deliverables:**
- Complete dashboard interface
- Data visualization components
- Optimized data fetching

---

### Week 5: Insights & Challenges

**Day 1-3: Personalized Insights**
- [ ] Create insights generation algorithm
- [ ] Build pattern detection logic
- [ ] Implement tip recommendation system
- [ ] Create insights display UI
- [ ] Add insight prioritization
- [ ] Implement read/unread tracking
- [ ] Schedule Cloud Function for daily insights

**Day 4-7: Challenges & Gamification**
- [ ] Create challenge templates in Firestore
- [ ] Build challenge enrollment system
- [ ] Implement progress tracking
- [ ] Create badge/achievement system
- [ ] Build challenge UI components
- [ ] Add streak tracking
- [ ] Implement XP/points system

**Deliverables:**
- Insights generation system
- Challenge system with gamification
- Badge/achievement tracking

---

### Week 6: Community & Testing

**Day 1-3: Community Feed**
- [ ] Create community post model in Firestore
- [ ] Build post creation UI
- [ ] Implement post feed with pagination
- [ ] Add like functionality
- [ ] Create post filtering (wins, tips, stories)
- [ ] Implement basic moderation rules

**Day 4-7: Testing & Quality Assurance**
- [ ] Set up Vitest for unit tests
- [ ] Write tests for carbon calculator
- [ ] Write tests for insights generator
- [ ] Set up Playwright for E2E tests
- [ ] Create E2E test scenarios
- [ ] Fix bugs and issues
- [ ] Performance optimization

**Deliverables:**
- Community feed functionality
- Comprehensive test suite
- Bug fixes and optimizations

---

### Week 7: Deployment & Launch

**Day 1-2: Cloud Run Deployment**
- [ ] Configure Cloud Run service
- [ ] Set up environment variables
- [ ] Deploy to staging environment
- [ ] Test all features in staging
- [ ] Configure custom domain (optional)

**Day 3-4: Monitoring & Analytics**
- [ ] Set up Cloud Logging queries
- [ ] Configure error tracking
- [ ] Create monitoring dashboard
- [ ] Set up performance monitoring
- [ ] Configure budget alerts

**Day 5-7: Production Launch**
- [ ] Final testing and QA
- [ ] Deploy to production
- [ ] Monitor initial traffic
- [ ] Document deployment process
- [ ] Create user documentation
- [ ] Plan post-launch improvements

**Deliverables:**
- Production deployment on Cloud Run
- Monitoring and logging configured
- Documentation complete

---

## 🔧 Key Configuration Files

### 1. Environment Variables (.env.local)

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Production
# NEXTAUTH_URL=https://your-cloud-run-url.run.app
```

### 2. next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Cloud Run
  images: {
    domains: ['storage.googleapis.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

### 3. package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "gcloud run deploy carbon-tracker --source .",
    "seed": "tsx scripts/seed-firestore.ts"
  }
}
```

---

## 📊 Firestore Query Patterns

### Efficient Query Examples

```typescript
// Get user's activities for a date range
const activitiesRef = collection(db, `users/${userId}/activities`)
const q = query(
  activitiesRef,
  where('date', '>=', startDate),
  where('date', '<=', endDate),
  orderBy('date', 'desc'),
  limit(50)
)

// Get daily total emissions (pre-aggregated)
const dailyStatsRef = doc(db, `users/${userId}/stats/daily-${dateString}`)
const dailyStats = await getDoc(dailyStatsRef)

// Get active challenges
const challengesRef = collection(db, 'challenges')
const q = query(challengesRef, where('isActive', '==', true))

// Get community posts with pagination
const postsRef = collection(db, 'communityPosts')
const q = query(
  postsRef,
  orderBy('createdAt', 'desc'),
  limit(20),
  startAfter(lastDoc) // For pagination
)
```

### Data Aggregation Strategy

Since Firestore doesn't support complex aggregations, use these patterns:

1. **Pre-compute aggregations** - Store daily/weekly/monthly totals
2. **Client-side aggregation** - For small datasets
3. **Cloud Functions** - For scheduled aggregations
4. **Denormalization** - Duplicate data where needed

---

## 🚀 Deployment Commands

### Initial Deployment

```bash
# 1. Authenticate with GCP
gcloud auth login

# 2. Set project
gcloud config set project carbon-footprint-tracker

# 3. Deploy to Cloud Run
gcloud run deploy carbon-tracker \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# 4. Get service URL
gcloud run services describe carbon-tracker \
  --region us-central1 \
  --format 'value(status.url)'
```

### Continuous Deployment

```bash
# Set up GitHub trigger
gcloud builds triggers create github \
  --repo-name=carbon-footprint-tracker \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

---

## 📈 Performance Optimization

### Firestore Best Practices

1. **Use subcollections** for user-specific data
2. **Create composite indexes** for complex queries
3. **Implement pagination** for large lists
4. **Cache frequently accessed data** client-side
5. **Batch writes** for multiple operations
6. **Denormalize data** to avoid multiple reads

### Cloud Run Optimization

1. **Minimize cold starts** - Keep instances warm
2. **Optimize bundle size** - Code splitting
3. **Use caching headers** - For static assets
4. **Implement request caching** - Redis or in-memory
5. **Monitor performance** - Cloud Logging

---

## 💰 Cost Monitoring

### Free Tier Limits

**Daily Monitoring:**
- Firestore reads: < 50,000/day
- Firestore writes: < 20,000/day
- Cloud Run requests: < 66,000/day
- Cloud Build: < 120 minutes/day

**Monthly Monitoring:**
- Cloud Run: < 2M requests
- Firestore storage: < 1GB
- Cloud Storage: < 5GB

### Set Up Alerts

```bash
# Create budget alert
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Carbon Tracker Budget" \
  --budget-amount=5 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90
```

---

## 🔒 Security Checklist

- [ ] Firestore security rules configured
- [ ] Authentication required for all protected routes
- [ ] Input validation on all forms
- [ ] Rate limiting implemented
- [ ] Secrets stored in Secret Manager
- [ ] CORS configured properly
- [ ] HTTPS enforced
- [ ] User data encrypted

---

## 📚 Additional Resources

### Documentation
- [GCP Free Tier](https://cloud.google.com/free)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js on Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service)

### Tutorials
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Cloud Run Best Practices](https://cloud.google.com/run/docs/tips)
- [NextAuth.js with Firestore](https://next-auth.js.org/adapters/firebase)

---

## 🎯 Success Metrics

### Technical Metrics
- Cloud Run cold start time: < 2 seconds
- Firestore query time: < 500ms
- Page load time: < 3 seconds
- API response time: < 1 second

### Business Metrics
- User registration rate: 80%+ complete onboarding
- Daily active users: Track engagement
- Activity logging frequency: 5+ activities/week
- Challenge completion rate: 40%+

---

## 🔄 Post-MVP Roadmap

### When to Scale Beyond Free Tier

**Indicators:**
- Consistent > 50K Firestore reads/day
- > 2M Cloud Run requests/month
- Need for real-time features
- Need for advanced analytics

**Estimated Costs After Free Tier:**
- Cloud Run: $5-10/month
- Firestore: $5-15/month
- Cloud Storage: $1-5/month
- **Total: $11-30/month**

---

## ✅ Implementation Checklist

### Pre-Development
- [ ] GCP account created
- [ ] Project initialized
- [ ] Billing configured (with alerts)
- [ ] All APIs enabled
- [ ] Documentation reviewed

### Development
- [ ] Local environment set up
- [ ] Firestore configured
- [ ] Authentication working
- [ ] Core features implemented
- [ ] Tests written
- [ ] Performance optimized

### Deployment
- [ ] Staging environment deployed
- [ ] Production environment deployed
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Team trained

---

**Document Version:** 1.0  
**Created:** June 12, 2026  
**Status:** GCP-Optimized Implementation Plan  
**Estimated Cost:** $0/month (Free Tier)  
**Timeline:** 7 weeks