# 🔌 Carbon Footprint Platform - API Specification

## Overview

RESTful API specification for the Carbon Footprint Awareness Platform MVP. All endpoints return JSON responses and use standard HTTP status codes.

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://carbon-tracker.vercel.app/api
```

---

## Authentication

All protected endpoints require authentication via NextAuth.js session cookies.

### Headers
```http
Cookie: next-auth.session-token=<token>
Content-Type: application/json
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## API Endpoints

## 1. Authentication

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-06-12T10:00:00Z"
    }
  },
  "message": "Account created successfully"
}
```

---

### POST /api/auth/signin
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "session": {
      "expires": "2026-07-12T10:00:00Z"
    }
  }
}
```

---

### POST /api/auth/signout
End user session.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

## 2. Quiz & Onboarding

### POST /api/quiz/submit
Submit lifestyle quiz responses and generate baseline assessment.

**Request Body:**
```json
{
  "responses": [
    {
      "questionId": "transport_mode",
      "answer": "car"
    },
    {
      "questionId": "commute_distance",
      "answer": "20"
    },
    {
      "questionId": "meat_frequency",
      "answer": "daily"
    },
    {
      "questionId": "home_size",
      "answer": "medium"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "carbonScore": 68,
    "baselineEmissions": 12.5,
    "breakdown": {
      "transport": 4.8,
      "food": 3.9,
      "energy": 2.8,
      "shopping": 1.0
    },
    "comparison": {
      "nationalAverage": 15.2,
      "percentile": 45
    },
    "recommendations": [
      "Consider carpooling to reduce transport emissions",
      "Try meatless Mondays to lower food footprint"
    ]
  }
}
```

---

### POST /api/profile/goals
Set or update user's reduction goals.

**Request Body:**
```json
{
  "reductionPercentage": 10,
  "deadline": "2026-09-12"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "goal": {
      "reductionPercentage": 10,
      "targetEmissions": 11.25,
      "deadline": "2026-09-12",
      "daysRemaining": 92
    }
  }
}
```

---

## 3. Activity Tracking

### POST /api/activities
Log a new activity.

**Request Body:**
```json
{
  "category": "transport",
  "activityType": "car_petrol",
  "amount": 25,
  "unit": "km",
  "date": "2026-06-12",
  "notes": "Commute to work"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "activity": {
      "id": "uuid",
      "category": "transport",
      "activityType": "car_petrol",
      "amount": 25,
      "unit": "km",
      "emissionsKg": 4.8,
      "date": "2026-06-12",
      "notes": "Commute to work",
      "createdAt": "2026-06-12T10:00:00Z"
    },
    "dailyTotal": 8.5,
    "dailyTarget": 8.0,
    "status": "over_target"
  }
}
```

---

### GET /api/activities
Get user's activity history with filters.

**Query Parameters:**
- `startDate` (optional) - ISO date string
- `endDate` (optional) - ISO date string
- `category` (optional) - transport|food|energy|shopping
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Example:** `/api/activities?startDate=2026-06-01&category=transport&page=1&limit=10`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "uuid",
        "category": "transport",
        "activityType": "car_petrol",
        "amount": 25,
        "unit": "km",
        "emissionsKg": 4.8,
        "date": "2026-06-12",
        "notes": "Commute to work"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

### PUT /api/activities/:id
Update an existing activity.

**Request Body:**
```json
{
  "amount": 30,
  "notes": "Updated commute distance"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "activity": {
      "id": "uuid",
      "amount": 30,
      "emissionsKg": 5.76,
      "notes": "Updated commute distance",
      "updatedAt": "2026-06-12T11:00:00Z"
    }
  }
}
```

---

### DELETE /api/activities/:id
Delete an activity.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Activity deleted successfully"
}
```

---

### GET /api/activities/summary
Get activity summary for a time period.

**Query Parameters:**
- `period` - daily|weekly|monthly
- `date` (optional) - ISO date string (default: today)

**Example:** `/api/activities/summary?period=weekly&date=2026-06-12`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "period": "weekly",
    "startDate": "2026-06-06",
    "endDate": "2026-06-12",
    "totalEmissions": 58.4,
    "averageDaily": 8.34,
    "breakdown": {
      "transport": 22.5,
      "food": 18.2,
      "energy": 12.7,
      "shopping": 5.0
    },
    "comparedToBaseline": {
      "difference": -4.1,
      "percentageChange": -6.6
    }
  }
}
```

---

## 4. Dashboard

### GET /api/dashboard/summary
Get comprehensive dashboard data.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "carbonScore": 72,
    "scoreChange": 4,
    "todayEmissions": 7.2,
    "todayTarget": 8.0,
    "weeklyEmissions": 58.4,
    "monthlyEmissions": 245.8,
    "goal": {
      "reductionPercentage": 10,
      "currentProgress": 6.2,
      "daysRemaining": 92,
      "onTrack": true
    },
    "breakdown": {
      "transport": 38,
      "food": 28,
      "energy": 22,
      "shopping": 12
    },
    "recentAchievements": [
      {
        "badgeType": "first_week",
        "badgeName": "First Week Complete",
        "earnedAt": "2026-06-10T10:00:00Z"
      }
    ]
  }
}
```

---

### GET /api/dashboard/trends
Get emissions trend data for charts.

**Query Parameters:**
- `period` - weekly|monthly|yearly
- `startDate` (optional) - ISO date string

**Example:** `/api/dashboard/trends?period=monthly`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "dataPoints": [
      {
        "date": "2026-06-01",
        "emissions": 12.8,
        "target": 11.25
      },
      {
        "date": "2026-06-02",
        "emissions": 11.5,
        "target": 11.25
      }
    ],
    "average": 11.8,
    "trend": "decreasing"
  }
}
```

---

## 5. Calculations

### POST /api/calculations/calculate
Calculate emissions for a specific activity without logging.

**Request Body:**
```json
{
  "category": "transport",
  "activityType": "car_petrol",
  "amount": 25,
  "unit": "km"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "emissionsKg": 4.8,
    "emissionFactor": 0.192,
    "equivalents": {
      "trees": 0.24,
      "flights": 0.019,
      "burgers": 1.78
    }
  }
}
```

---

## 6. Insights

### GET /api/insights
Get personalized insights and tips.

**Query Parameters:**
- `unreadOnly` (optional) - boolean (default: false)
- `limit` (optional) - number (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "id": "uuid",
        "type": "pattern",
        "title": "High Transport Emissions on Tuesdays",
        "description": "You drive most on Tuesdays. Could you carpool or use public transport?",
        "priority": 1,
        "isRead": false,
        "createdAt": "2026-06-12T08:00:00Z"
      },
      {
        "id": "uuid",
        "type": "suggestion",
        "title": "Switch to Oat Milk",
        "description": "Switching to oat milk could save 0.7 kg CO₂ per day",
        "priority": 2,
        "isRead": false,
        "createdAt": "2026-06-11T08:00:00Z"
      },
      {
        "id": "uuid",
        "type": "celebration",
        "title": "Great Progress!",
        "description": "You saved 15 kg CO₂ this week - equivalent to planting 1 tree!",
        "priority": 3,
        "isRead": true,
        "createdAt": "2026-06-10T08:00:00Z"
      }
    ],
    "unreadCount": 2
  }
}
```

---

### POST /api/insights/:id/read
Mark an insight as read.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Insight marked as read"
}
```

---

## 7. Challenges

### GET /api/challenges
Get available challenges.

**Query Parameters:**
- `status` (optional) - available|active|completed

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "uuid",
        "title": "Car-Free Week",
        "description": "Avoid using your car for 7 days",
        "category": "transport",
        "durationDays": 7,
        "targetReductionKg": 30,
        "badgeIcon": "🚲",
        "isActive": true,
        "enrollmentCount": 1247
      },
      {
        "id": "uuid",
        "title": "Meatless Mondays",
        "description": "Go meat-free every Monday for a month",
        "category": "food",
        "durationDays": 28,
        "targetReductionKg": 25,
        "badgeIcon": "🥗",
        "isActive": true,
        "enrollmentCount": 892
      }
    ]
  }
}
```

---

### POST /api/challenges/:id/enroll
Enroll in a challenge.

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "userChallenge": {
      "id": "uuid",
      "challengeId": "uuid",
      "status": "active",
      "startDate": "2026-06-12",
      "endDate": "2026-06-19",
      "progress": 0,
      "emissionsSaved": 0
    }
  },
  "message": "Successfully enrolled in challenge"
}
```

---

### GET /api/challenges/active
Get user's active challenges.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "uuid",
        "challenge": {
          "title": "Car-Free Week",
          "description": "Avoid using your car for 7 days",
          "badgeIcon": "🚲"
        },
        "status": "active",
        "startDate": "2026-06-12",
        "endDate": "2026-06-19",
        "progress": 42,
        "emissionsSaved": 12.6,
        "daysRemaining": 4,
        "currentStreak": 3
      }
    ]
  }
}
```

---

### GET /api/challenges/:id/progress
Get detailed progress for a specific challenge.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "challenge": {
      "title": "Car-Free Week",
      "targetReductionKg": 30
    },
    "progress": {
      "percentage": 42,
      "emissionsSaved": 12.6,
      "daysCompleted": 3,
      "totalDays": 7,
      "dailyProgress": [
        {
          "date": "2026-06-12",
          "completed": true,
          "emissionsSaved": 4.8
        },
        {
          "date": "2026-06-13",
          "completed": true,
          "emissionsSaved": 4.2
        },
        {
          "date": "2026-06-14",
          "completed": true,
          "emissionsSaved": 3.6
        }
      ]
    }
  }
}
```

---

## 8. Achievements

### GET /api/achievements
Get user's earned achievements.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "uuid",
        "badgeType": "first_week",
        "badgeName": "First Week Complete",
        "badgeIcon": "🌱",
        "description": "Completed your first week of tracking",
        "earnedAt": "2026-06-10T10:00:00Z"
      },
      {
        "id": "uuid",
        "badgeType": "car_free",
        "badgeName": "Car-Free Champion",
        "badgeIcon": "🚲",
        "description": "Completed the Car-Free Week challenge",
        "earnedAt": "2026-06-08T10:00:00Z"
      }
    ],
    "totalBadges": 2,
    "level": 4,
    "xp": 1250,
    "nextLevelXp": 2500
  }
}
```

---

## 9. Community

### GET /api/community/posts
Get community feed posts.

**Query Parameters:**
- `type` (optional) - win|tip|story
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "name": "Jane Smith",
          "avatarUrl": "https://..."
        },
        "content": "Just completed my first car-free week! Saved 30kg CO₂ 🎉",
        "postType": "win",
        "likesCount": 24,
        "isLiked": false,
        "createdAt": "2026-06-12T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

---

### POST /api/community/posts
Create a new community post.

**Request Body:**
```json
{
  "content": "Just completed my first car-free week! Saved 30kg CO₂ 🎉",
  "postType": "win"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "uuid",
      "content": "Just completed my first car-free week! Saved 30kg CO₂ 🎉",
      "postType": "win",
      "likesCount": 0,
      "createdAt": "2026-06-12T10:00:00Z"
    }
  }
}
```

---

### POST /api/community/posts/:id/like
Like a community post.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "likesCount": 25
  }
}
```

---

### DELETE /api/community/posts/:id/like
Unlike a community post.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "likesCount": 24
  }
}
```

---

## 10. User Profile

### GET /api/profile
Get user profile and settings.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatarUrl": "https://...",
      "createdAt": "2026-05-01T10:00:00Z"
    },
    "profile": {
      "carbonScore": 72,
      "baselineEmissions": 12.5,
      "reductionGoal": 10,
      "goalDeadline": "2026-09-12",
      "country": "US",
      "city": "San Francisco",
      "householdSize": 2
    },
    "stats": {
      "totalActivities": 156,
      "totalEmissionsSaved": 142.5,
      "currentStreak": 12,
      "longestStreak": 18,
      "level": 4,
      "xp": 1250
    }
  }
}
```

---

### PUT /api/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "city": "Los Angeles",
  "householdSize": 3
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "John Smith",
      "city": "Los Angeles",
      "householdSize": 3,
      "updatedAt": "2026-06-12T10:00:00Z"
    }
  }
}
```

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **Authenticated requests:** 100 requests per minute
- **Unauthenticated requests:** 20 requests per minute

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1686567600
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## Webhooks (Future)

Webhook endpoints for real-time notifications (Phase 2):

- `challenge.completed` - User completes a challenge
- `milestone.reached` - User reaches emission milestone
- `insight.generated` - New insight available

---

**Document Version:** 1.0  
**Created:** June 12, 2026  
**Status:** API Reference