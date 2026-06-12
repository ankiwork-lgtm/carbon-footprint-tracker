# Complete Step-by-Step Guide: Python Flask/Django App Engine Deployment

## **Phase 1: Local Development Setup**

### Step 1: Set Up Local Python Environment
```bash
# Create project directory
cd c:/Users/AnkitGarg/OneDrive - IBM/Desktop/Learning/Google/carbon-footprint-tracker

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat

# Install Flask (or Django)
pip install flask gunicorn
# OR for Django:
# pip install django gunicorn
```

### Step 2: Create Your Application Structure

**For Flask:**
```
carbon-footprint-tracker/
├── app.py                 # Main application file
├── requirements.txt       # Python dependencies
├── app.yaml              # App Engine configuration
├── .gcloudignore         # Files to exclude from deployment
├── .gitignore            # Git ignore file
└── static/               # Static files (CSS, JS)
└── templates/            # HTML templates
```

**Sample `app.py` (Flask):**
```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
```

### Step 3: Create Required Configuration Files

**`requirements.txt`:**
```txt
Flask==3.0.0
gunicorn==21.2.0
# Add other dependencies
```

**`app.yaml`:**
```yaml
runtime: python312
entrypoint: gunicorn -b :$PORT app:app

env_variables:
  FLASK_ENV: 'production'

instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
```

**`.gcloudignore`:**
```
.git
.gitignore
venv/
__pycache__/
*.pyc
.env
.vscode/
```

**`.gitignore`:**
```
venv/
__pycache__/
*.pyc
.env
*.log
.DS_Store
```

### Step 4: Test Locally
```bash
# Run Flask app
python app.py

# Visit http://localhost:8080
```

---

## **Phase 2: GitHub Repository Setup**

### Step 5: Initialize Git Repository
```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Carbon footprint tracker"
```

### Step 6: Create GitHub Repository
```bash
# Create repo on GitHub (via web interface or CLI)
# Then connect local repo:

git remote add origin https://github.com/YOUR_USERNAME/carbon-footprint-tracker.git
git branch -M main
git push -u origin main
```

---

## **Phase 3: Google Cloud Platform Setup**

### Step 7: Install Google Cloud SDK
```bash
# Download from: https://cloud.google.com/sdk/docs/install
# After installation, verify:
gcloud --version
```

### Step 8: Initialize GCP and Create Project
```bash
# Login to GCP
gcloud auth login

# Create new project
gcloud projects create carbon-footprint-tracker-001 --name="Carbon Footprint Tracker"

# Set as active project
gcloud config set project carbon-footprint-tracker-001

# Enable billing (required for App Engine)
# Do this via GCP Console: https://console.cloud.google.com/billing
```

### Step 9: Enable Required APIs
```bash
# Enable App Engine API
gcloud services enable appengine.googleapis.com

# Enable Cloud Build API (for deployments)
gcloud services enable cloudbuild.googleapis.com
```

### Step 10: Create App Engine Application
```bash
# Create App Engine app (one-time setup)
gcloud app create --region=us-central

# Choose region closest to your users:
# us-central, europe-west, asia-south1, etc.
```

---

## **Phase 4: First Deployment**

### Step 11: Deploy to App Engine
```bash
# Deploy application
gcloud app deploy

# When prompted, type 'Y' to confirm

# View your app
gcloud app browse
```

### Step 12: View Logs and Monitor
```bash
# Stream logs
gcloud app logs tail -s default

# View in browser
# Visit: https://console.cloud.google.com/logs
```

---

## **Phase 5: CI/CD Setup with GitHub Actions**

### Step 13: Create Service Account for Deployment
```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Deployer"

# Grant App Engine deployer role
gcloud projects add-iam-policy-binding carbon-footprint-tracker-001 \
    --member="serviceAccount:github-actions@carbon-footprint-tracker-001.iam.gserviceaccount.com" \
    --role="roles/appengine.deployer"

# Grant Cloud Build editor role
gcloud projects add-iam-policy-binding carbon-footprint-tracker-001 \
    --member="serviceAccount:github-actions@carbon-footprint-tracker-001.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.editor"

# Grant Service Account User role
gcloud projects add-iam-policy-binding carbon-footprint-tracker-001 \
    --member="serviceAccount:github-actions@carbon-footprint-tracker-001.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@carbon-footprint-tracker-001.iam.gserviceaccount.com
```

### Step 14: Add Secret to GitHub
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GCP_SA_KEY`
4. Value: Copy entire contents of `key.json` file
5. Click "Add secret"

**IMPORTANT:** Delete `key.json` from your local machine after adding to GitHub!

### Step 15: Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to App Engine

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Deploy to App Engine
        run: |
          gcloud app deploy --quiet --project=carbon-footprint-tracker-001
```

### Step 16: Commit and Push Workflow
```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main

# Deployment will trigger automatically!
```

---

## **Phase 6: Development Workflow**

### Step 17: Daily Development Process
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes to code
# Edit files...

# 3. Test locally
python app.py

# 4. Commit changes
git add .
git commit -m "Add new feature"

# 5. Push to GitHub
git push origin feature/new-feature

# 6. Create Pull Request on GitHub
# Review and merge to main

# 7. Automatic deployment triggers when merged to main!
```

---

## **Phase 7: Environment Management**

### Step 18: Manage Environment Variables
```bash
# Set environment variables in app.yaml
# For sensitive data, use Secret Manager:

# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create secret
echo -n "your-secret-value" | gcloud secrets create my-secret --data-file=-

# Reference in app.yaml:
# env_variables:
#   MY_SECRET: ${MY_SECRET}
```

### Step 19: Multiple Environments Setup
```bash
# Deploy to different versions
gcloud app deploy --version=staging --no-promote

# Split traffic between versions
gcloud app services set-traffic default --splits=v1=0.9,v2=0.1

# View all versions
gcloud app versions list
```

---

## **Phase 8: Monitoring and Maintenance**

### Step 20: Monitor Application
```bash
# View logs
gcloud app logs tail -s default

# View metrics in GCP Console
# Visit: https://console.cloud.google.com/appengine

# Set up alerts
# Visit: https://console.cloud.google.com/monitoring
```

---

## **Quick Reference Commands**

```bash
# Deploy
gcloud app deploy

# View logs
gcloud app logs tail -s default

# Open app in browser
gcloud app browse

# View versions
gcloud app versions list

# Delete old version
gcloud app versions delete VERSION_ID

# Update traffic split
gcloud app services set-traffic default --splits=v1=1.0
```

---

## **Cost Optimization Tips**

1. Use `F1` instance class for development (free tier eligible)
2. Set `max_instances` to control costs
3. Use `min_instances: 0` to scale to zero when idle
4. Monitor usage in GCP Console → Billing

---

## **Troubleshooting**

**Issue: Deployment fails**
```bash
# Check logs
gcloud app logs tail -s default

# Verify app.yaml syntax
gcloud app deploy --dry-run
```

**Issue: App not starting**
- Check `requirements.txt` has all dependencies
- Verify Python version matches `app.yaml`
- Check entrypoint command is correct

**Issue: GitHub Actions fails**
- Verify `GCP_SA_KEY` secret is set correctly
- Check service account has required permissions
- Review GitHub Actions logs

---

## **Next Steps**

1. Add database (Cloud SQL or Firestore)
2. Set up custom domain
3. Enable HTTPS (automatic with App Engine)
4. Add monitoring and alerting
5. Implement staging environment

---

## **Architecture Overview**

```
┌─────────────────┐
│ Local Dev       │
│ (Python/Flask)  │
└────────┬────────┘
         │
         │ git push
         ▼
┌─────────────────┐
│ GitHub Repo     │
└────────┬────────┘
         │
         │ triggers
         ▼
┌─────────────────┐
│ GitHub Actions  │
│ (CI/CD)         │
└────────┬────────┘
         │
         │ gcloud deploy
         ▼
┌─────────────────┐
│ App Engine      │
│ (Production)    │
└─────────────────┘
```

---

## **Key Benefits of This Approach**

✅ **No Docker Required** - Deploy source code directly  
✅ **Automatic Scaling** - Handles traffic spikes automatically  
✅ **Zero Downtime** - Rolling deployments with traffic splitting  
✅ **Built-in Load Balancing** - Distributed across multiple instances  
✅ **Integrated Monitoring** - Cloud Logging and Monitoring included  
✅ **Free Tier Available** - F1 instances eligible for free quota  
✅ **HTTPS by Default** - SSL certificates managed automatically  
✅ **Version Management** - Easy rollbacks and A/B testing  

---

## **Support and Resources**

- **App Engine Documentation**: https://cloud.google.com/appengine/docs
- **Python Runtime**: https://cloud.google.com/appengine/docs/standard/python3
- **GitHub Actions**: https://docs.github.com/en/actions
- **GCP Console**: https://console.cloud.google.com

Your application is now fully deployed with automated CI/CD from GitHub to Google App Engine!