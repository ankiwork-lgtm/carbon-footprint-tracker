# 🏗️ Carbon Footprint Platform - Technical Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
    end
    
    subgraph "Application Layer - Next.js 14"
        C[App Router Pages]
        D[API Routes]
        E[Server Components]
        F[Client Components]
    end
    
    subgraph "Business Logic Layer"
        G[Carbon Calculator Service]
        H[Insights Generator Service]
        I[Challenge Manager Service]
        J[Analytics Service]
        K[Notification Service]
    end
    
    subgraph "Data Access Layer"
        L[Prisma ORM]
        M[Query Optimization]
        N[Caching Layer]
    end
    
    subgraph "Data Layer"
        O[(PostgreSQL)]
        P[(Redis Cache)]
    end
    
    subgraph "External Services"
        Q[NextAuth.js]
        R[Vercel Analytics]
        S[Sentry Error Tracking]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    E --> F
    D --> G
    D --> H
    D --> I
    D --> J
    G --> L
    H --> L
    I --> L
    J --> L
    L --> M
    M --> N
    N --> O
    N --> P
    D --> Q
    C --> R
    D --> S
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Component
    participant API as API Route
    participant S as Service Layer
    participant DB as Database
    
    U->>UI: Log Activity
    UI->>API: POST /api/activities
    API->>API: Validate Input
    API->>S: Calculate Emissions
    S->>DB: Fetch Emission Factor
    DB-->>S: Return Factor
    S->>S: Calculate CO2
    S->>DB: Save Activity
    DB-->>S: Confirm Save
    S->>S: Generate Insights
    S->>DB: Save Insights
    API-->>UI: Return Result
    UI-->>U: Show Success + Emissions
```

## Database Schema Relationships

```mermaid
erDiagram
    USERS ||--o{ USER_PROFILES : has
    USERS ||--o{ ACTIVITY_LOGS : creates
    USERS ||--o{ QUIZ_RESPONSES : completes
    USERS ||--o{ USER_INSIGHTS : receives
    USERS ||--o{ USER_CHALLENGES : enrolls
    USERS ||--o{ ACHIEVEMENTS : earns
    USERS ||--o{ COMMUNITY_POSTS : creates
    USERS ||--o{ POST_LIKES : gives
    
    CHALLENGES ||--o{ USER_CHALLENGES : has
    COMMUNITY_POSTS ||--o{ POST_LIKES : receives
    
    EMISSION_FACTORS ||--o{ ACTIVITY_LOGS : references
    
    USERS {
        uuid id PK
        string email UK
        string name
        string avatar_url
        timestamp created_at
    }
    
    USER_PROFILES {
        uuid id PK
        uuid user_id FK
        int carbon_score
        decimal baseline_emissions
        int reduction_goal_percentage
        date goal_deadline
    }
    
    ACTIVITY_LOGS {
        uuid id PK
        uuid user_id FK
        enum category
        string activity_type
        decimal amount
        decimal emissions_kg
        date date
    }
    
    CHALLENGES {
        uuid id PK
        string title
        int duration_days
        decimal target_reduction_kg
        boolean is_active
    }
    
    USER_CHALLENGES {
        uuid id PK
        uuid user_id FK
        uuid challenge_id FK
        enum status
        date start_date
        int progress_percentage
    }
```

## API Architecture

```mermaid
graph LR
    subgraph "API Routes Structure"
        A[/api/auth/*]
        B[/api/activities/*]
        C[/api/quiz/*]
        D[/api/insights/*]
        E[/api/challenges/*]
        F[/api/community/*]
        G[/api/dashboard/*]
        H[/api/calculations/*]
    end
    
    subgraph "Middleware"
        I[Authentication]
        J[Rate Limiting]
        K[Validation]
        L[Error Handling]
    end
    
    A --> I
    B --> I
    C --> I
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J
    J --> K
    K --> L
```

## Component Architecture

```mermaid
graph TD
    subgraph "Page Components"
        A[Dashboard Page]
        B[Tracking Page]
        C[Challenges Page]
        D[Community Page]
    end
    
    subgraph "Feature Components"
        E[Carbon Score Widget]
        F[Activity Logger]
        G[Trend Chart]
        H[Challenge Card]
        I[Community Feed]
    end
    
    subgraph "UI Components"
        J[Button]
        K[Card]
        L[Chart]
        M[Form]
        N[Modal]
    end
    
    A --> E
    A --> G
    B --> F
    C --> H
    D --> I
    
    E --> K
    E --> L
    F --> M
    G --> L
    H --> K
    I --> K
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as NextAuth
    participant DB as Database
    
    U->>C: Enter Credentials
    C->>A: POST /api/auth/signin
    A->>DB: Verify Credentials
    DB-->>A: User Data
    A->>A: Generate JWT
    A-->>C: Set Session Cookie
    C-->>U: Redirect to Dashboard
    
    Note over U,DB: Subsequent Requests
    
    U->>C: Access Protected Page
    C->>A: Verify Session
    A->>A: Validate JWT
    A-->>C: Session Valid
    C-->>U: Render Page
```

## Carbon Calculation Flow

```mermaid
flowchart TD
    A[User Logs Activity] --> B{Activity Type?}
    
    B -->|Transport| C[Get Distance & Vehicle Type]
    B -->|Food| D[Get Food Type & Amount]
    B -->|Energy| E[Get Energy Type & Usage]
    B -->|Shopping| F[Get Product Category]
    
    C --> G[Fetch Emission Factor]
    D --> G
    E --> G
    F --> G
    
    G --> H[Calculate CO2 = Amount × Factor]
    H --> I[Apply Regional Adjustments]
    I --> J[Store in Database]
    J --> K[Update Daily Total]
    K --> L[Check for Insights]
    L --> M{Patterns Detected?}
    
    M -->|Yes| N[Generate Insight]
    M -->|No| O[Return Result]
    N --> O
```

## Insights Generation Flow

```mermaid
flowchart TD
    A[Scheduled Job / Activity Trigger] --> B[Fetch User Activity Data]
    B --> C[Analyze Patterns]
    
    C --> D{Pattern Type?}
    
    D -->|High Emission Day| E[Generate Warning Insight]
    D -->|Consistent Reduction| F[Generate Celebration Insight]
    D -->|Category Spike| G[Generate Suggestion Insight]
    D -->|Milestone Reached| H[Generate Achievement Insight]
    
    E --> I[Prioritize Insight]
    F --> I
    G --> I
    H --> I
    
    I --> J[Store in Database]
    J --> K[Send Notification]
    K --> L[Display in Dashboard]
```

## Challenge Progress Tracking

```mermaid
stateDiagram-v2
    [*] --> Available: Challenge Created
    Available --> Enrolled: User Enrolls
    Enrolled --> Active: Challenge Starts
    Active --> InProgress: User Logs Activities
    InProgress --> InProgress: Daily Progress Update
    InProgress --> Completed: Target Achieved
    InProgress --> Failed: Deadline Passed
    Completed --> [*]: Award Badge
    Failed --> [*]: No Badge
    
    note right of InProgress
        Calculate progress daily
        Check emissions reduction
        Update progress percentage
    end note
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        A[Local Dev Environment]
        B[Git Repository]
    end
    
    subgraph "CI/CD Pipeline"
        C[GitHub Actions]
        D[Run Tests]
        E[Build Application]
        F[Run Migrations]
    end
    
    subgraph "Staging Environment"
        G[Vercel Staging]
        H[Staging Database]
    end
    
    subgraph "Production Environment"
        I[Vercel Production]
        J[Production Database]
        K[CDN]
    end
    
    subgraph "Monitoring"
        L[Vercel Analytics]
        M[Sentry]
        N[Database Monitoring]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    
    G -->|Manual Approval| I
    I --> J
    I --> K
    
    I --> L
    I --> M
    J --> N
```

## Caching Strategy

```mermaid
flowchart LR
    A[API Request] --> B{Cache Hit?}
    
    B -->|Yes| C[Return Cached Data]
    B -->|No| D[Query Database]
    
    D --> E[Process Data]
    E --> F[Store in Cache]
    F --> G[Return Data]
    
    C --> H[Response]
    G --> H
    
    subgraph "Cache Layers"
        I[Browser Cache]
        J[CDN Cache]
        K[Redis Cache]
        L[Database Query Cache]
    end
```

## Security Architecture

```mermaid
graph TD
    subgraph "Security Layers"
        A[HTTPS/TLS]
        B[CSRF Protection]
        C[Rate Limiting]
        D[Input Validation]
        E[SQL Injection Prevention]
        F[XSS Protection]
        G[Authentication]
        H[Authorization]
    end
    
    subgraph "Data Protection"
        I[Password Hashing]
        J[JWT Tokens]
        K[Session Management]
        L[Data Encryption]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    
    G --> I
    G --> J
    G --> K
    H --> L
```

## Performance Optimization Strategy

```mermaid
mindmap
    root((Performance))
        Frontend
            Code Splitting
            Lazy Loading
            Image Optimization
            Bundle Size Reduction
        Backend
            Database Indexing
            Query Optimization
            Connection Pooling
            Caching Strategy
        Network
            CDN Usage
            Compression
            HTTP/2
            Prefetching
        Monitoring
            Core Web Vitals
            API Response Times
            Database Query Times
            Error Rates
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Redis for session storage
- CDN for static assets

### Vertical Scaling
- Database optimization
- Query performance tuning
- Efficient indexing
- Caching strategies

### Load Distribution
```mermaid
graph LR
    A[Users] --> B[Load Balancer]
    B --> C[Vercel Edge Network]
    C --> D[Next.js Instance 1]
    C --> E[Next.js Instance 2]
    C --> F[Next.js Instance N]
    
    D --> G[Database Pool]
    E --> G
    F --> G
    
    G --> H[(PostgreSQL)]
```

## Monitoring & Observability

```mermaid
graph TB
    subgraph "Application Metrics"
        A[Response Times]
        B[Error Rates]
        C[Request Volume]
        D[User Sessions]
    end
    
    subgraph "Infrastructure Metrics"
        E[CPU Usage]
        F[Memory Usage]
        G[Database Connections]
        H[Cache Hit Rate]
    end
    
    subgraph "Business Metrics"
        I[Active Users]
        J[Activities Logged]
        K[Challenges Completed]
        L[CO2 Saved]
    end
    
    subgraph "Monitoring Tools"
        M[Vercel Analytics]
        N[Sentry]
        O[Database Monitoring]
        P[Custom Dashboards]
    end
    
    A --> M
    B --> N
    C --> M
    D --> M
    
    E --> M
    F --> M
    G --> O
    H --> O
    
    I --> P
    J --> P
    K --> P
    L --> P
```

---

**Document Version:** 1.0  
**Created:** June 12, 2026  
**Status:** Technical Reference