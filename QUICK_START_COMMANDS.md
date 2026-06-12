# ⚡ Quick Start Commands - Carbon Footprint Platform

> **Essential commands for implementing the GCP-based Carbon Footprint Platform**

---

## 🚀 Initial Setup (Week 1)

### GCP Project Setup
```bash
# Authenticate with GCP
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  cloudscheduler.googleapis.com \
  cloudfunctions.googleapis.com

# Create service account
gcloud iam service-accounts create carbon-tracker-sa \
  --display-name="Carbon Tracker Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:carbon-tracker-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

# Create service account key
gcloud iam service-accounts keys create ./service-account-key.json \
  --iam-account=carbon-tracker-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### Next.js Project Setup
```bash
# Create Next.js app
npx create-next-app@latest carbon-footprint-tracker \
  --typescript --tailwind --app --src-dir --import-alias "@/*"

cd carbon-footprint-tracker

# Install core dependencies
npm install firebase firebase-admin next-auth@beta @auth/firebase-adapter \
  zod react-hook-form @hookform/resolvers zustand recharts date-fns lucide-react

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select dialog \
  dropdown-menu tabs toast progress badge avatar

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom tsx \
  vitest @vitest/ui @playwright/test
```

### Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Seed database
npm run seed
```

---

## 🔧 Development Commands

### Local Development
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Build for production
npm run build

# Start production server locally
npm run start
```

### Database Operations
```bash
# Seed Firestore with initial data
npm run seed

# Backup Firestore data
gcloud firestore export gs://YOUR_BUCKET_NAME/backups/$(date +%Y%m%d)

# Import Firestore data
gcloud firestore import gs://YOUR_BUCKET_NAME/backups/BACKUP_DATE
```

---

## 🚢 Deployment Commands

### Deploy to Cloud Run
```bash
# Deploy from source (automatic build)
gcloud run deploy carbon-tracker \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# Deploy with specific image
gcloud run deploy carbon-tracker \
  --image gcr.io/YOUR_PROJECT_ID/carbon-tracker:latest \
  --region us-central1 \
  --platform managed

# Get service URL
gcloud run services describe carbon-tracker \
  --region us-central1 \
  --format 'value(status.url)'
```

### Docker Commands
```bash
# Build Docker image
docker build -t carbon-tracker .

# Run Docker container locally
docker run -p 3000:3000 carbon-tracker

# Tag image for GCP
docker tag carbon-tracker gcr.io/YOUR_PROJECT_ID/carbon-tracker:latest

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/carbon-tracker:latest
```

### CI/CD Setup
```bash
# Create GitHub trigger for automatic deployment
gcloud builds triggers create github \
  --repo-name=carbon-footprint-tracker \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml

# List triggers
gcloud builds triggers list

# Run trigger manually
gcloud builds triggers run TRIGGER_NAME
```

---

## 🔐 Secret Management

### Create Secrets
```bash
# Create NextAuth secret
echo -n "your-nextauth-secret" | gcloud secrets create nextauth-secret --data-file=-

# Create Firebase private key
cat service-account-key.json | gcloud secrets create firebase-key --data-file=-

# Grant access to service account
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:carbon-tracker-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Access Secrets
```bash
# View secret value
gcloud secrets versions access latest --secret="SECRET_NAME"

# List all secrets
gcloud secrets list

# Delete secret
gcloud secrets delete SECRET_NAME
```

---

## 📊 Monitoring & Logs

### View Logs
```bash
# Stream Cloud Run logs
gcloud run services logs read carbon-tracker \
  --region us-central1 \
  --follow

# View recent logs
gcloud run services logs read carbon-tracker \
  --region us-central1 \
  --limit 50

# Filter logs by severity
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" \
  --limit 50 \
  --format json
```

### Monitoring
```bash
# Get service details
gcloud run services describe carbon-tracker --region us-central1

# List revisions
gcloud run revisions list --service carbon-tracker --region us-central1

# View metrics
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"'
```

---

## 💰 Cost Management

### Set Budget Alerts
```bash
# Create budget
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Carbon Tracker Budget" \
  --budget-amount=5 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90

# List budgets
gcloud billing budgets list --billing-account=BILLING_ACCOUNT_ID
```

### Monitor Usage
```bash
# Check Firestore usage
gcloud firestore operations list

# Check Cloud Run usage
gcloud run services describe carbon-tracker \
  --region us-central1 \
  --format="value(status.traffic)"

# View billing report
gcloud billing accounts list
```

---

## 🔄 Common Workflows

### Update Environment Variables
```bash
# Update Cloud Run service with new env vars
gcloud run services update carbon-tracker \
  --region us-central1 \
  --set-env-vars="KEY1=value1,KEY2=value2"

# Update from env file
gcloud run services update carbon-tracker \
  --region us-central1 \
  --env-vars-file=.env.production
```

### Rollback Deployment
```bash
# List revisions
gcloud run revisions list --service carbon-tracker --region us-central1

# Rollback to previous revision
gcloud run services update-traffic carbon-tracker \
  --region us-central1 \
  --to-revisions=REVISION_NAME=100
```

### Scale Service
```bash
# Update instance limits
gcloud run services update carbon-tracker \
  --region us-central1 \
  --min-instances=0 \
  --max-instances=10

# Update memory and CPU
gcloud run services update carbon-tracker \
  --region us-central1 \
  --memory=1Gi \
  --cpu=2
```

---

## 🧪 Testing Commands

### Unit Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test src/lib/services/carbon-calculator.test.ts
```

### E2E Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test
npx playwright test tests/auth.spec.ts
```

---

## 🛠️ Troubleshooting Commands

### Debug Cloud Run
```bash
# Get service status
gcloud run services describe carbon-tracker --region us-central1

# Check recent deployments
gcloud run revisions list --service carbon-tracker --region us-central1

# View error logs
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" \
  --limit 100 \
  --format json

# Test service locally with Cloud Run emulator
gcloud beta code dev
```

### Debug Firestore
```bash
# Check Firestore indexes
gcloud firestore indexes list

# View Firestore operations
gcloud firestore operations list

# Test Firestore rules
firebase emulators:start --only firestore
```

### Debug Build Issues
```bash
# View build logs
gcloud builds list --limit=10

# Get specific build details
gcloud builds describe BUILD_ID

# View build logs
gcloud builds log BUILD_ID
```

---

## 📦 Project Structure Commands

### Create Folder Structure
```bash
# Create all necessary directories
mkdir -p src/app/{auth,dashboard,api,onboarding}
mkdir -p src/components/{ui,dashboard,tracking,challenges,community}
mkdir -p src/lib/{firebase,services,utils}
mkdir -p src/types
mkdir -p scripts
mkdir -p public/images
```

### Generate Component
```bash
# Using shadcn/ui
npx shadcn-ui@latest add [component-name]

# Example: Add new components
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add chart
```

---

## 🔗 Useful Links

- **GCP Console**: https://console.cloud.google.com
- **Firebase Console**: https://console.firebase.google.com
- **Cloud Run Dashboard**: https://console.cloud.google.com/run
- **Firestore Dashboard**: https://console.firebase.google.com/project/_/firestore
- **Cloud Build History**: https://console.cloud.google.com/cloud-build/builds
- **Logs Explorer**: https://console.cloud.google.com/logs

---

## 📝 Quick Reference

### Environment Variables Template
```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

### Common File Paths
```
src/app/api/auth/[...nextauth]/route.ts  # NextAuth config
src/lib/firebase/config.ts                # Firebase client
src/lib/firebase/admin.ts                 # Firebase admin
src/middleware.ts                         # Auth middleware
firestore.rules                           # Firestore security
firestore.indexes.json                    # Firestore indexes
cloudbuild.yaml                           # CI/CD config
Dockerfile                                # Container config
```

---

**💡 Tip**: Bookmark this page for quick access to essential commands during development!