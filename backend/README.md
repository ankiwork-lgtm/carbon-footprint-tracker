# Carbon Footprint Tracker - Backend API

Python Flask backend for the Carbon Footprint Awareness Platform.

## 🛠️ Technology Stack

- **Framework**: Flask 3.0
- **Database**: Google Cloud Firestore
- **Deployment**: Google App Engine
- **Authentication**: JWT + Firebase Auth
- **Language**: Python 3.12

## 📁 Project Structure

```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── app.yaml              # App Engine configuration
├── .env.example          # Environment variables template
├── config/               # Configuration files
│   └── firestore.py      # Firestore database setup
├── routes/               # API route handlers
│   ├── auth.py           # Authentication endpoints
│   ├── activities.py     # Activity tracking endpoints
│   ├── quiz.py           # Onboarding quiz endpoints
│   ├── insights.py       # Personalized insights
│   ├── challenges.py     # Gamification challenges
│   ├── community.py      # Community feed
│   ├── dashboard.py      # Dashboard data
│   └── calculations.py   # Carbon calculations
├── services/             # Business logic
│   └── carbon_calculator.py  # Emission calculations
├── models/               # Data models (to be added)
└── utils/                # Utility functions (to be added)
```

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Google Cloud SDK
- Google Cloud Project with Firestore enabled

### Local Development Setup

1. **Create virtual environment**:
```bash
python -m venv venv

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
.\venv\Scripts\activate.bat

# Mac/Linux
source venv/bin/activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up Google Cloud credentials**:
```bash
# Download service account key from GCP Console
# Set environment variable
$env:GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
```

5. **Run the development server**:
```bash
python app.py
```

The API will be available at `http://localhost:8080`

### Testing the API

```bash
# Health check
curl http://localhost:8080/health

# Test activity logging
curl -X POST http://localhost:8080/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "category": "transport",
    "activity_type": "car_petrol",
    "amount": 25,
    "date": "2026-06-12"
  }'
```

## 📡 API Endpoints

### Health & Status
- `GET /health` - Health check endpoint
- `GET /` - API information

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Activities
- `POST /api/activities` - Log new activity
- `GET /api/activities` - Get activity history
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/summary` - Get period summary

### Quiz & Onboarding
- `POST /api/quiz/submit` - Submit lifestyle quiz

### Insights
- `GET /api/insights` - Get personalized insights

### Challenges
- `GET /api/challenges` - Get available challenges
- `POST /api/challenges/:id/enroll` - Enroll in challenge

### Community
- `GET /api/community/posts` - Get community feed
- `POST /api/community/posts` - Create post

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard data

### Calculations
- `POST /api/calculations/calculate` - Calculate emissions

## 🔧 Configuration

### Environment Variables

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
PORT=8080
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json
FIRESTORE_COLLECTION_PREFIX=dev_
FRONTEND_URL=http://localhost:3000
```

### App Engine Configuration

Edit `app.yaml` for production deployment:

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

## 🚢 Deployment

### Deploy to App Engine

1. **Authenticate with GCP**:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. **Create App Engine app** (first time only):
```bash
gcloud app create --region=us-central
```

3. **Deploy**:
```bash
gcloud app deploy
```

4. **View logs**:
```bash
gcloud app logs tail -s default
```

5. **Open in browser**:
```bash
gcloud app browse
```

## 📊 Carbon Calculation

### Emission Factors

The calculator uses emission factors from:
- EPA (Environmental Protection Agency)
- DEFRA (UK Department for Environment)
- IPCC Guidelines

### Categories

**Transport** (kg CO2 per km):
- Car (petrol): 0.192
- Car (diesel): 0.171
- Car (electric): 0.053
- Bus: 0.089
- Train: 0.041

**Food** (kg CO2 per kg):
- Beef: 27.0
- Chicken: 6.9
- Vegetables: 2.0

**Energy** (kg CO2 per kWh):
- Grid electricity: 0.475
- Natural gas: 0.185

## 🧪 Testing

```bash
# Run tests (to be implemented)
pytest

# Run with coverage
pytest --cov=.
```

## 📝 Development Guidelines

### Code Style
- Follow PEP 8 style guide
- Use type hints where possible
- Document functions with docstrings

### Error Handling
All endpoints return consistent error format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

## 🔒 Security

- CORS configured for frontend origin
- Input validation on all endpoints
- Firestore security rules (to be configured)
- Environment variables for secrets
- HTTPS enforced in production

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Google Cloud Firestore](https://cloud.google.com/firestore/docs)
- [App Engine Python](https://cloud.google.com/appengine/docs/standard/python3)
- [API Specification](../API_SPECIFICATION.md)

## 🐛 Troubleshooting

### Common Issues

**Import errors**: Make sure virtual environment is activated and dependencies are installed

**Firestore connection fails**: Check GOOGLE_APPLICATION_CREDENTIALS path

**Port already in use**: Change PORT in .env or kill process using port 8080

**CORS errors**: Verify FRONTEND_URL in environment variables

## 📞 Support

For issues and questions, please refer to the main project documentation.

---

**Version**: 1.0.0  
**Last Updated**: June 12, 2026