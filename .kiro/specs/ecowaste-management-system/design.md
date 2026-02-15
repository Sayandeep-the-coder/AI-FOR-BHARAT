# Design Document: EcoWaste Management System

## Overview

The EcoWaste Management System is a full-stack web application built with a Node.js/Express backend and Next.js 14 frontend. The system provides waste management capabilities including user authentication, AI-powered waste classification, community reporting, facility management, and gamification through a points system.

### Architecture Style

The system follows a three-tier architecture:
- **Presentation Layer**: Next.js 14 with TypeScript, React 18, and Tailwind CSS
- **Application Layer**: Express.js REST API with JWT authentication
- **Data Layer**: MongoDB with Mongoose ODM

### Key Design Decisions

1. **JWT Authentication**: Stateless authentication using HTTP-only cookies for security, enabling scalable session management without server-side storage
2. **AI Integration**: Google Gemini 2.5 Flash for real-time waste classification, providing instant feedback to users
3. **Gamification**: Points-based reward system to encourage user engagement and sustained participation
4. **Modular Architecture**: Separation of concerns with distinct controller, service, and route layers for maintainability
5. **Environment-Based Configuration**: All sensitive credentials and environment-specific settings loaded from environment variables
6. **RESTful API Design**: Standard HTTP methods and status codes for predictable API behavior
7. **MongoDB Document Model**: Flexible schema design supporting evolving requirements and embedded documents for recycler data
8. **Next.js App Router**: Modern routing with server components for improved performance and SEO
9. **TypeScript Frontend**: Type safety in the presentation layer to catch errors at compile time
10. **Component-Based UI**: Radix UI component library for accessible, customizable interface elements


## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Presentation Layer - Next.js Frontend"
        Pages[Pages/Routes]
        Components[UI Components]
        Hooks[Custom Hooks]
        API_Client[Axios HTTP Client]
    end
    
    subgraph "Application Layer - Express Backend"
        Routes[API Routes]
        Middleware[Auth Middleware]
        Controllers[Controllers]
        Services[Services]
    end
    
    subgraph "External Services"
        AI[Google Gemini AI]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB Database)]
        FileSystem[File System Storage]
    end
    
    Browser --> Pages
    Mobile --> Pages
    Pages --> Components
    Components --> API_Client
    API_Client --> Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> AI
    Services --> MongoDB
    Controllers --> FileSystem
    
    style AI fill:#f9f,stroke:#333,stroke-width:2px
    style MongoDB fill:#9f9,stroke:#333,stroke-width:2px
```

### Component Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Auth
    participant Controller
    participant AI_Service
    participant Database
    
    User->>Frontend: Upload waste image
    Frontend->>API: POST /report/image (with JWT cookie)
    API->>Auth: Validate JWT token
    Auth-->>API: User ID extracted
    API->>Controller: Process report request
    Controller->>AI_Service: Classify waste image
    AI_Service->>AI_Service: Encode image to base64
    AI_Service-->>Controller: Waste type + points
    Controller->>Database: Save report with classification
    Database-->>Controller: Report saved
    Controller->>Database: Update user points
    Database-->>Controller: Points updated
    Controller-->>API: Report created response
    API-->>Frontend: 201 Created with report data
    Frontend-->>User: Show success with classification
```


## Components and Interfaces

### Backend Components

#### 1. Authentication Controller (`auth.controller.js`)

**Responsibilities:**
- User registration with password hashing
- User login with JWT token generation
- User logout with cookie clearing
- Password validation and credential verification

**Interface:**
```javascript
class AuthController {
  // POST /register
  async register(req, res): Promise<Response>
    Input: { username: string, email: string, password: string }
    Output: { token: string, user: { id, username, email, points } }
    Status: 201 Created | 400 Bad Request | 409 Conflict
  
  // POST /login
  async login(req, res): Promise<Response>
    Input: { email: string, password: string }
    Output: { token: string, user: { id, username, email, points } }
    Status: 200 OK | 401 Unauthorized
  
  // POST /logout
  async logout(req, res): Promise<Response>
    Output: { message: string }
    Status: 200 OK
}
```


#### 2. Waste Type Controller (`WasteType.Controller.js`)

**Responsibilities:**
- Report creation with image upload
- AI-powered waste classification
- Points calculation and user update
- Report retrieval and filtering

**Interface:**
```javascript
class WasteTypeController {
  // POST /report/image
  async createReport(req, res): Promise<Response>
    Input: FormData {
      image: File,
      username: string,
      location: string,
      title: string,
      description: string
    }
    Headers: { Cookie: JWT_Token }
    Output: { 
      report: Report,
      classification: string,
      points: number
    }
    Status: 201 Created | 400 Bad Request | 401 Unauthorized
  
  // GET /report/list
  async getReports(req, res): Promise<Response>
    Headers: { Cookie: JWT_Token }
    Output: { reports: Report[] }
    Status: 200 OK | 401 Unauthorized
}
```


#### 3. AI Service (`ai.service.js`)

**Responsibilities:**
- Image encoding to base64
- Communication with Google Gemini API
- Waste type classification
- Points calculation based on waste type

**Interface:**
```javascript
class AIService {
  async classifyWaste(imagePath: string): Promise<ClassificationResult>
    Input: imagePath (file system path)
    Output: {
      wasteType: 'plastic' | 'biodegradable' | 'other' | 'unknown',
      emoji: '♻️' | '🌿' | '',
      points: 10 | 5 | 0,
      rawResponse: string
    }
    Throws: Error if image processing fails
  
  private encodeImage(imagePath: string): Promise<string>
    Input: imagePath
    Output: base64 encoded JPEG string
    Throws: Error if file read fails
}
```

**AI Model Configuration:**
- Model: `gemini-2.5-flash`
- Input: Base64 JPEG image
- System Instruction: Classify waste into plastic, biodegradable, or other
- Output Format: Text with emoji indicator


#### 4. Authentication Middleware (`auth.middleware.js`)

**Responsibilities:**
- JWT token extraction from cookies
- Token validation and signature verification
- User ID extraction and request attachment
- Unauthorized request rejection

**Interface:**
```javascript
async function authMiddleware(req, res, next): Promise<void>
  Input: req.cookies.token
  Side Effect: Sets req.userId if valid
  Output: Calls next() or sends 401 response
  
  Validation Steps:
  1. Check token exists in cookies
  2. Verify token signature with JWT_SECRET
  3. Check token expiration
  4. Extract user ID from payload
  5. Attach userId to request object
```


### Frontend Components

#### 1. Authentication Pages

**Login Page (`app/login/page.tsx`)**
- Form with email and password fields
- Client-side validation
- JWT token storage in cookies
- Redirect to dashboard on success

**Register Page (`app/register/page.tsx`)**
- Form with username, email, and password fields
- Password strength validation
- Duplicate username/email handling
- Auto-login after registration

#### 2. Dashboard Page (`app/dashboard/page.tsx`)

**Responsibilities:**
- Display area statistics (households, compliance, waste collected)
- Show real-time alerts
- Sector-wise monitoring with compliance tracking
- Collection vehicle tracking
- Photo reports from community
- Performance metrics visualization

**Key Features:**
- Tab-based interface (Collection Status, Reports)
- Progress bars for compliance metrics
- Badge system for status indicators
- Responsive grid layout


#### 3. Report Page (`app/report/page.tsx`)

**Responsibilities:**
- Multi-step report submission form
- Drag-and-drop image upload
- AI-powered waste detection integration
- Community reports feed display
- User's submitted reports tracking

**Interface Structure:**
```typescript
interface ReportFormData {
  username: string;
  category: 'illegal_dumping' | 'overflowing_bins' | 'missed_collection' | 'other';
  title: string;
  location: string;
  description: string;
  photos: File[];
}

interface Report {
  _id: string;
  username: string;
  title: string;
  description: string;
  location: string;
  image: string;
  content: string; // AI classification result
  points: number;
  status: 'pending' | 'investigating' | 'resolved' | 'verified';
  createdAt: string;
  updatedAt: string;
}
```

**Tab Structure:**
1. Submit Report: Form for new report submission
2. Community Reports: All reports from all users
3. My Reports: Current user's submitted reports


#### 4. Facilities Page (`app/facilities/page.tsx`)

**Responsibilities:**
- Display recycling facilities by state
- Show facility details (name, address, quantity, rating)
- Filter and search functionality
- Loading states for async data fetching

**Interface:**
```typescript
interface Recycler {
  name: string;
  address: string;
  quantity: number;
  rating: number;
}

interface Facility {
  _id: string;
  state: string;
  total: number;
  recyclers: Recycler[];
}
```

#### 5. Shared UI Components

**Theme Provider (`components/theme-provider.tsx`)**
- Dark/light mode support
- System preference detection
- Theme persistence

**Theme Toggle (`components/theme-toggle.tsx`)**
- Toggle button for theme switching
- Icon indicators for current theme

**Radix UI Components (`components/ui/`)**
- 50+ accessible components
- Button, Card, Dialog, Form, Input, Select, Tabs, etc.
- Consistent styling with Tailwind CSS


## Data Models

### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  role: {
    type: String,
    enum: ['user', 'green_champion', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `username`: unique index for fast lookup
- `email`: unique index for authentication
- `points`: index for leaderboard queries


### Report Model

```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['illegal_dumping', 'overflowing_bins', 'missed_collection', 'other'],
    default: 'other'
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String, // AI classification result
    default: ''
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'verified'],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  votes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `user`: for user-specific report queries
- `status`: for filtering by status
- `createdAt`: for sorting by date (descending)
- Compound index: `(status, createdAt)` for efficient filtered sorting


### Facility Model

```javascript
{
  state: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  recyclers: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    facilityType: {
      type: String,
      enum: ['biomethanization', 'waste_to_energy', 'recycling', 'scrap_collection'],
      default: 'recycling'
    },
    contact: {
      phone: String,
      email: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `state`: for state-based facility lookup
- `recyclers.rating`: for sorting by rating


## API Design

### Base URL
- Development: `http://localhost:4000`
- Production: `https://api.ecowaste.com` (configured via environment variable)

### Authentication Endpoints

#### POST /register
**Description:** Register a new user account

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "points": 0
  }
}
```
**Cookie Set:** `token=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`

**Error Responses:**
- 400: Invalid input data
- 409: Username or email already exists


#### POST /login
**Description:** Authenticate user and receive JWT token

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "points": 150
  }
}
```
**Cookie Set:** `token=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`

**Error Responses:**
- 400: Missing email or password
- 401: Invalid credentials

#### POST /logout
**Description:** Clear authentication token

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```
**Cookie Cleared:** `token=; Max-Age=0`


### Report Endpoints

#### POST /report/image
**Description:** Submit a waste report with image (Protected)

**Headers:**
```
Cookie: token=<JWT>
Content-Type: multipart/form-data
```

**Request (FormData):**
```
image: <File> (JPEG/PNG/WebP, max 5MB)
username: "john_doe"
title: "Overflowing bin at Park Street"
location: "Park Street, Sector 5"
description: "The bin has been overflowing for 3 days"
category: "overflowing_bins"
```

**Response (201 Created):**
```json
{
  "message": "Report submitted successfully",
  "report": {
    "id": "507f1f77bcf86cd799439012",
    "username": "john_doe",
    "title": "Overflowing bin at Park Street",
    "location": "Park Street, Sector 5",
    "description": "The bin has been overflowing for 3 days",
    "category": "overflowing_bins",
    "image": "/uploads/1234567890-waste.jpg",
    "content": "plastic ♻️",
    "points": 10,
    "status": "pending",
    "createdAt": "2026-02-15T10:30:00Z"
  },
  "classification": {
    "wasteType": "plastic",
    "emoji": "♻️",
    "pointsAwarded": 10
  }
}
```

**Error Responses:**
- 400: Invalid file type or missing required fields
- 401: Unauthorized (no valid token)
- 413: File too large
- 500: AI classification failed


#### GET /report/list
**Description:** Retrieve all reports (Protected)

**Headers:**
```
Cookie: token=<JWT>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, investigating, resolved, verified)
- `userId` (optional): Filter by user ID
- `limit` (optional): Number of reports per page (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "reports": [
    {
      "id": "507f1f77bcf86cd799439012",
      "username": "john_doe",
      "title": "Overflowing bin at Park Street",
      "location": "Park Street, Sector 5",
      "description": "The bin has been overflowing for 3 days",
      "category": "overflowing_bins",
      "image": "/uploads/1234567890-waste.jpg",
      "content": "plastic ♻️",
      "points": 10,
      "status": "pending",
      "votes": 5,
      "createdAt": "2026-02-15T10:30:00Z",
      "updatedAt": "2026-02-15T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

**Error Responses:**
- 401: Unauthorized


#### PATCH /report/:id/status
**Description:** Update report status (Protected - Green Champions only)

**Headers:**
```
Cookie: token=<JWT>
Content-Type: application/json
```

**Request:**
```json
{
  "status": "investigating"
}
```

**Response (200 OK):**
```json
{
  "message": "Report status updated",
  "report": {
    "id": "507f1f77bcf86cd799439012",
    "status": "investigating",
    "updatedAt": "2026-02-15T11:00:00Z"
  }
}
```

**Error Responses:**
- 400: Invalid status value
- 401: Unauthorized
- 403: Forbidden (not a Green Champion)
- 404: Report not found


### Facility Endpoints

#### GET /facilities
**Description:** Retrieve all facilities

**Query Parameters:**
- `state` (optional): Filter by state name
- `minRating` (optional): Minimum facility rating (0-5)

**Response (200 OK):**
```json
{
  "facilities": [
    {
      "id": "507f1f77bcf86cd799439013",
      "state": "Maharashtra",
      "total": 150,
      "recyclers": [
        {
          "name": "Green Recyclers Pvt Ltd",
          "address": "123 Industrial Area, Mumbai",
          "quantity": 5000,
          "rating": 4.5,
          "facilityType": "recycling",
          "contact": {
            "phone": "+91-22-12345678",
            "email": "contact@greenrecyclers.com"
          }
        }
      ]
    }
  ],
  "total": 1
}
```

#### POST /facilities
**Description:** Add a new facility (Protected - Admin only)

**Headers:**
```
Cookie: token=<JWT>
Content-Type: application/json
```

**Request:**
```json
{
  "state": "Maharashtra",
  "total": 150,
  "recyclers": [
    {
      "name": "Green Recyclers Pvt Ltd",
      "address": "123 Industrial Area, Mumbai",
      "quantity": 5000,
      "rating": 4.5,
      "facilityType": "recycling",
      "contact": {
        "phone": "+91-22-12345678",
        "email": "contact@greenrecyclers.com"
      }
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Facility added successfully",
  "facility": { /* facility object */ }
}
```

**Error Responses:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Forbidden (not an admin)


### User Endpoints

#### GET /user/profile
**Description:** Get current user profile (Protected)

**Headers:**
```
Cookie: token=<JWT>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "points": 150,
    "role": "user",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- 401: Unauthorized

#### GET /user/leaderboard
**Description:** Get top users by points

**Query Parameters:**
- `limit` (optional): Number of users to return (default: 10, max: 100)

**Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "eco_warrior",
      "points": 5000,
      "reportsCount": 250
    },
    {
      "rank": 2,
      "username": "john_doe",
      "points": 150,
      "reportsCount": 15
    }
  ]
}
```


## AI Service Integration

### Google Gemini AI Configuration

**Model:** `gemini-2.5-flash`
**Purpose:** Real-time waste classification from uploaded images

**System Instruction:**
```
Analyze the provided waste image and classify the waste into one of the following 
categories: plastic, biodegradable, or other. Respond only with the waste type label. 
If the image is unclear or the waste type cannot be determined, respond with 'unknown' 
and add emoji at the end according to the waste type:
- Plastic: ♻️
- Biodegradable: 🌿
```

### Classification Flow

```mermaid
graph LR
    A[Image Upload] --> B[Read File]
    B --> C[Encode to Base64]
    C --> D[Send to Gemini API]
    D --> E[Parse Response]
    E --> F{Waste Type?}
    F -->|Plastic| G[10 Points + ♻️]
    F -->|Biodegradable| H[5 Points + 🌿]
    F -->|Other/Unknown| I[0 Points]
    G --> J[Update User Points]
    H --> J
    I --> J
    J --> K[Save Report]
```


### Points Calculation Logic

```javascript
function calculatePoints(wasteType) {
  const pointsMap = {
    'plastic': 10,      // Recyclable, high value
    'biodegradable': 5, // Compostable, medium value
    'other': 0,         // Unclassified
    'unknown': 0        // Cannot determine
  };
  
  return pointsMap[wasteType.toLowerCase()] || 0;
}
```

### Error Handling

**AI Service Failures:**
1. **Network Error**: Retry up to 3 times with exponential backoff
2. **Invalid Response**: Default to 'unknown' classification with 0 points
3. **Rate Limit**: Queue request for later processing
4. **API Key Invalid**: Log critical error and notify admin

**Fallback Strategy:**
- If AI classification fails, still create report with 0 points
- Mark report for manual review by Green Champions
- Log failure for monitoring and debugging


## Security Architecture

### Authentication Security

**Password Hashing:**
- Algorithm: bcrypt
- Salt Rounds: 10
- Never store plain text passwords
- Validate password strength on registration (min 8 characters)

**JWT Token Management:**
```javascript
{
  payload: {
    userId: "507f1f77bcf86cd799439011",
    role: "user",
    iat: 1708000000,
    exp: 1708604800  // 7 days
  },
  secret: process.env.JWT_SECRET,
  algorithm: "HS256"
}
```

**Cookie Configuration:**
```javascript
{
  httpOnly: true,      // Prevent XSS access
  secure: true,        // HTTPS only in production
  sameSite: 'strict',  // CSRF protection
  maxAge: 604800000    // 7 days in milliseconds
}
```


### Input Validation and Sanitization

**Validation Rules:**

1. **Username:**
   - Length: 3-30 characters
   - Pattern: Alphanumeric and underscores only
   - Sanitize: Trim whitespace

2. **Email:**
   - Pattern: Valid email format
   - Transform: Lowercase
   - Sanitize: Trim whitespace

3. **Password:**
   - Minimum length: 8 characters
   - Recommended: Include uppercase, lowercase, number, special character

4. **Image Upload:**
   - Allowed types: JPEG, PNG, WebP
   - Maximum size: 5MB
   - Validate MIME type and file extension

5. **Text Fields (title, description, location):**
   - Sanitize HTML tags to prevent XSS
   - Trim whitespace
   - Maximum lengths enforced

**Sanitization Library:** Use `express-validator` or `joi` for comprehensive validation


### Rate Limiting

**Configuration:**

```javascript
const rateLimits = {
  authentication: {
    windowMs: 60 * 1000,      // 1 minute
    max: 5,                    // 5 requests per window
    message: "Too many authentication attempts"
  },
  reportSubmission: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,                   // 10 reports per hour
    message: "Report submission limit reached"
  },
  reportListing: {
    windowMs: 60 * 1000,      // 1 minute
    max: 100,                  // 100 requests per minute
    message: "Too many requests"
  },
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,                 // 1000 requests per window
    message: "Rate limit exceeded"
  }
};
```

**Implementation:** Use `express-rate-limit` middleware


### Security Headers

**Helmet.js Configuration:**

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.API_URL]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  xssFilter: true,
  noSniff: true
}));
```

**Headers Applied:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy: <policy>`


### CORS Configuration

**Development:**
```javascript
{
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

**Production:**
```javascript
{
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

### Environment Variables Security

**Required Environment Variables:**

```bash
# Server Configuration
PORT=4000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecowaste

# Authentication
JWT_SECRET=<cryptographically-secure-random-string-min-32-chars>
JWT_EXPIRY=7d

# AI Service
GOOGLE_AI_API_KEY=<google-gemini-api-key>

# CORS
FRONTEND_URL=https://ecowaste.com

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

**Security Best Practices:**
- Never commit `.env` file to version control
- Use different secrets for development and production
- Rotate JWT secret periodically
- Use strong, randomly generated secrets (min 32 characters)
- Store production secrets in secure vault (AWS Secrets Manager, HashiCorp Vault)


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, the following redundancies were identified and consolidated:

- **Requirements 8.1-8.3** are redundant with **3.2-3.4** (points assignment for waste types)
- **Requirement 12.2** is redundant with **1.4-1.5** (unique username/email constraints)
- **Requirement 13.2** is redundant with **4.7** (image file path storage)
- **Requirement 14.1** is redundant with **12.4** (default pending status)
- **Requirement 15.1** is redundant with **8.5** (profile includes points)

These redundant properties have been eliminated to ensure each property provides unique validation value.


### Authentication and User Management Properties

**Property 1: Password Hashing Integrity**
*For any* user registration with valid credentials, the stored password in the database should be a bcrypt hash and never match the plain text password submitted.
**Validates: Requirements 1.1, 1.3**

**Property 2: JWT Token Generation**
*For any* successful login with valid credentials, the system should generate a JWT token, store it in an HTTP-only cookie, and the token should be verifiable with the configured secret.
**Validates: Requirements 1.2, 1.7**

**Property 3: Unique Username Constraint**
*For any* attempt to register with an existing username, the system should reject the registration and return a 409 Conflict error.
**Validates: Requirements 1.5**

**Property 4: Unique Email Constraint**
*For any* attempt to register with an existing email, the system should reject the registration and return a 409 Conflict error.
**Validates: Requirements 1.4**

**Property 5: Logout Cookie Clearing**
*For any* authenticated user who logs out, the JWT token cookie should be cleared (Max-Age=0) in the response.
**Validates: Requirements 1.6**

**Property 6: Initial Points Assignment**
*For any* newly registered user, the points field should be initialized to 0.
**Validates: Requirements 8.6**

**Property 7: Password Hash Exclusion**
*For any* user profile request, the response should include username, email, and points, but should never include the password hash.
**Validates: Requirements 15.4**

**Property 8: Points Non-Negativity Invariant**
*For any* sequence of point operations on a user account, the total points should never become negative.
**Validates: Requirements 15.2**


### AI Classification and Points Properties

**Property 9: Waste Classification Returns Valid Type**
*For any* uploaded waste image, the AI classifier should return one of the valid waste types: 'plastic', 'biodegradable', 'other', or 'unknown'.
**Validates: Requirements 3.1**

**Property 10: Image Base64 Encoding**
*For any* image sent to the AI classifier, the system should encode it as a base64 JPEG string before transmission.
**Validates: Requirements 3.6**

**Property 11: Classification Emoji Indicators**
*For any* waste classification result, if the type is 'plastic' the result should include ♻️, if 'biodegradable' it should include 🌿, otherwise no emoji.
**Validates: Requirements 3.7**

**Property 12: Points Accumulation**
*For any* user who creates multiple reports, the total points should equal the sum of points from all their reports.
**Validates: Requirements 4.4, 15.3**

**Property 13: Points Persistence**
*For any* point update operation, the new total should be persisted to the database and retrievable in subsequent profile requests.
**Validates: Requirements 8.4**


### Report Management Properties

**Property 14: Report Creation with Pending Status**
*For any* valid report submission with image, username, location, title, and description, the system should create a report with status "pending" and process it through the AI classifier.
**Validates: Requirements 4.1, 4.2, 12.4**

**Property 15: Report User Association**
*For any* report created by an authenticated user, the report should be associated with that user's account via the user reference field.
**Validates: Requirements 4.3**

**Property 16: User Report Filtering**
*For any* user requesting their reports, the system should return only reports where the user field matches their user ID, and no reports from other users.
**Validates: Requirements 4.5**

**Property 17: Community Reports Sorting**
*For any* request for community reports, the returned list should be sorted by createdAt timestamp in descending order (newest first).
**Validates: Requirements 4.6**

**Property 18: Image File Path Storage**
*For any* report with an uploaded image, the report document should contain the file path to the stored image.
**Validates: Requirements 4.7**

**Property 19: Unique Image Filenames**
*For any* two images uploaded at different times, the system should generate unique filenames to prevent collisions.
**Validates: Requirements 13.1**

**Property 20: Original Image Preservation**
*For any* image processed by the AI classifier, the original uploaded file should remain unchanged in the file system.
**Validates: Requirements 13.6**

**Property 21: Atomic Report Creation**
*For any* image upload failure during report submission, the system should return an error and not create a partial report in the database.
**Validates: Requirements 13.4**

**Property 22: Report Status Validation**
*For any* report status update, the new status value should be one of: "pending", "investigating", "resolved", or "verified".
**Validates: Requirements 14.2, 14.3**

**Property 23: Timestamp Update on Status Change**
*For any* report status update, the updatedAt timestamp should be modified to reflect the current time.
**Validates: Requirements 14.4**

**Property 24: Status Display in Listings**
*For any* report in a community reports listing, the response should include the current status field.
**Validates: Requirements 14.5**


### Input Validation Properties

**Property 25: Username Format Validation**
*For any* registration attempt with a username containing characters other than alphanumeric and underscores, or with length outside 3-30 characters, the system should reject the registration with a 400 Bad Request error.
**Validates: Requirements 5.1**

**Property 26: Email Format Validation**
*For any* registration attempt with an invalid email format, the system should reject the registration with a 400 Bad Request error.
**Validates: Requirements 5.2**

**Property 27: Password Length Validation**
*For any* registration attempt with a password shorter than 8 characters, the system should reject the registration with a 400 Bad Request error.
**Validates: Requirements 5.3**

**Property 28: Image File Type Validation**
*For any* image upload with a file type other than JPEG, PNG, or WebP, the system should reject the upload with a 400 Bad Request error.
**Validates: Requirements 5.4**

**Property 29: Image File Size Validation**
*For any* image upload exceeding 5MB, the system should reject the upload with a 413 Payload Too Large error.
**Validates: Requirements 5.5**

**Property 30: XSS Prevention in Text Fields**
*For any* report submission with HTML tags or script content in title or description fields, the system should sanitize the input to remove potentially malicious content.
**Validates: Requirements 5.6**

**Property 31: Location Non-Empty Validation**
*For any* report submission with an empty or whitespace-only location string, the system should reject the submission with a 400 Bad Request error.
**Validates: Requirements 5.7**

**Property 32: Facility State Validation**
*For any* facility creation with an empty state field, the system should reject the creation with a 400 Bad Request error.
**Validates: Requirements 7.5**

**Property 33: Recycler Rating Bounds**
*For any* recycler with a rating value outside the range 0-5, the system should reject the data with a 400 Bad Request error.
**Validates: Requirements 7.6**


### CORS and Security Properties

**Property 42: Origin Validation**
*For any* cross-origin request from an origin not in the configured allowed origins list, the system should reject the request.
**Validates: Requirements 11.1, 11.2**

**Property 43: Preflight CORS Headers**
*For any* preflight OPTIONS request from an allowed origin, the system should respond with appropriate CORS headers including Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Credentials.
**Validates: Requirements 11.3**

**Property 44: Credentials Support**
*For any* request from an allowed origin, the system should include Access-Control-Allow-Credentials: true in the response headers.
**Validates: Requirements 11.4**


### Error Handling Properties

**Property 45: Consistent Error Response Format**
*For any* error that occurs during request processing, the system should return a response with a consistent format containing status code and error message.
**Validates: Requirements 10.1**

**Property 46: Database Error Logging**
*For any* database operation failure, the system should log the error with timestamp, operation context, and error details.
**Validates: Requirements 10.2**

**Property 47: AI Classifier Error Handling**
*For any* AI classifier failure, the system should log the error, return a user-friendly message, and still create the report with 0 points and 'unknown' classification.
**Validates: Requirements 10.3**

**Property 48: Authentication Failure Logging**
*For any* failed authentication attempt, the system should log the attempt with timestamp, email/username, and IP address.
**Validates: Requirements 10.4**

**Property 49: File Upload Error Messages**
*For any* file upload failure, the system should return a descriptive error message indicating the specific failure reason (file too large, invalid type, etc.).
**Validates: Requirements 10.5**

**Property 50: Production Error Sanitization**
*For any* error response in production environment, the system should not expose internal error details, stack traces, or database information to the client.
**Validates: Requirements 10.6**

**Property 51: Critical Error Severity**
*For any* critical error (database connection failure, missing environment variables, AI service unavailable), the system should log it with "error" severity level.
**Validates: Requirements 10.7**


### Database Schema Properties

**Property 52: User Required Fields**
*For any* attempt to create a User document without username, email, or password fields, the database should reject the operation with a validation error.
**Validates: Requirements 12.1**

**Property 53: Report Required Fields**
*For any* attempt to create a Report document without user reference or username fields, the database should reject the operation with a validation error.
**Validates: Requirements 12.3**

**Property 54: Report Default Points**
*For any* Report document created without specifying points, the system should default the points field to 0.
**Validates: Requirements 12.5**

**Property 55: Facility Required Fields**
*For any* attempt to create a Facility document without state or total fields, the database should reject the operation with a validation error.
**Validates: Requirements 12.6**

**Property 56: Automatic Timestamps**
*For any* document creation or update on models with timestamps enabled, the system should automatically set createdAt on creation and update updatedAt on modifications.
**Validates: Requirements 12.7**

**Property 57: Referential Integrity on User Deletion**
*For any* user deletion, the system should maintain referential integrity such that their reports remain accessible and queryable.
**Validates: Requirements 15.5**


### Facility Management Properties

**Property 58: State-Based Facility Filtering**
*For any* request for facilities with a state parameter, the system should return only facilities where the state field matches the requested state.
**Validates: Requirements 7.1**

**Property 59: Facility Schema Completeness**
*For any* stored facility, the document should include state, total count, and an array of recyclers.
**Validates: Requirements 7.2**

**Property 60: Recycler Schema Completeness**
*For any* recycler within a facility, the object should include name, address, quantity, and rating fields.
**Validates: Requirements 7.3**

**Property 61: Alphabetical Facility Sorting**
*For any* request for all facilities without filters, the system should return facilities sorted alphabetically by state name.
**Validates: Requirements 7.4**


### Configuration Management Properties

**Property 62: Environment Variable Loading**
*For any* system startup, if any required environment variable (JWT_SECRET, GOOGLE_AI_API_KEY, MONGODB_URI, CORS_ORIGIN) is missing, the system should fail to start and log a descriptive error message indicating which variable is missing.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**


## Error Handling

### Error Response Format

All error responses follow a consistent structure:

```json
{
  "error": {
    "status": 400,
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Error Categories

#### 1. Validation Errors (400 Bad Request)
- Invalid input format (email, username, password)
- Missing required fields
- File type or size violations
- Invalid enum values

**Example:**
```json
{
  "error": {
    "status": 400,
    "code": "INVALID_FILE_TYPE",
    "message": "Only JPEG, PNG, and WebP images are allowed"
  }
}
```

#### 2. Authentication Errors (401 Unauthorized)
- Missing JWT token
- Invalid or expired token
- Invalid credentials

**Example:**
```json
{
  "error": {
    "status": 401,
    "code": "INVALID_TOKEN",
    "message": "Authentication token is invalid or expired"
  }
}
```

#### 3. Authorization Errors (403 Forbidden)
- Insufficient permissions
- Role-based access denial

**Example:**
```json
{
  "error": {
    "status": 403,
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Green Champion role required for this action"
  }
}
```

#### 4. Resource Errors (404 Not Found)
- Report not found
- User not found
- Facility not found

**Example:**
```json
{
  "error": {
    "status": 404,
    "code": "REPORT_NOT_FOUND",
    "message": "Report with ID 507f1f77bcf86cd799439012 not found"
  }
}
```

#### 5. Conflict Errors (409 Conflict)
- Duplicate username
- Duplicate email

**Example:**
```json
{
  "error": {
    "status": 409,
    "code": "DUPLICATE_EMAIL",
    "message": "An account with this email already exists"
  }
}
```

#### 6. Payload Errors (413 Payload Too Large)
- File size exceeds limit

**Example:**
```json
{
  "error": {
    "status": 413,
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed size of 5MB"
  }
}
```

#### 7. Rate Limit Errors (429 Too Many Requests)
- Rate limit exceeded

**Example:**
```json
{
  "error": {
    "status": 429,
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

#### 8. Server Errors (500 Internal Server Error)
- Database connection failures
- AI service failures
- Unexpected errors

**Example (Production):**
```json
{
  "error": {
    "status": 500,
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later."
  }
}
```

**Example (Development):**
```json
{
  "error": {
    "status": 500,
    "code": "DATABASE_ERROR",
    "message": "Failed to connect to database",
    "stack": "Error: connect ECONNREFUSED...",
    "details": { /* additional debug info */ }
  }
}
```


### Error Handling Strategy

#### Global Error Handler

```javascript
app.use((err, req, res, next) => {
  // Log error with context
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.userId,
    timestamp: new Date().toISOString()
  });
  
  // Determine error type and status
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  
  // Sanitize error for production
  const response = {
    error: {
      status,
      code,
      message: process.env.NODE_ENV === 'production' 
        ? getPublicErrorMessage(code)
        : err.message
    }
  };
  
  // Include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
    response.error.details = err.details;
  }
  
  res.status(status).json(response);
});
```

#### Async Error Wrapper

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.post('/report/image', authMiddleware, asyncHandler(async (req, res) => {
  // Controller logic
}));
```

#### Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.status = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
    this.code = 'AUTHENTICATION_ERROR';
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with ID ${id} not found`);
    this.status = 404;
    this.code = 'NOT_FOUND';
  }
}
```


### Logging Strategy

#### Log Levels

1. **error**: Critical failures requiring immediate attention
   - Database connection failures
   - AI service unavailable
   - Missing environment variables
   - Unhandled exceptions

2. **warn**: Potential issues that don't stop execution
   - AI classification failures (with fallback)
   - Rate limit approaching threshold
   - Deprecated API usage

3. **info**: Normal operational events
   - User registration
   - Report submission
   - Status updates
   - Server startup

4. **debug**: Detailed diagnostic information
   - Request/response details
   - Database queries
   - AI API calls

#### Log Format

```javascript
{
  timestamp: "2026-02-15T10:30:00.000Z",
  level: "error",
  message: "Database connection failed",
  context: {
    service: "database",
    operation: "connect",
    error: "ECONNREFUSED",
    retryAttempt: 3
  },
  request: {
    method: "POST",
    url: "/report/image",
    ip: "192.168.1.1",
    userId: "507f1f77bcf86cd799439011"
  }
}
```

#### Logging Library

Use **Winston** or **Pino** for structured logging with:
- File rotation for log management
- Different transports for different environments
- Sensitive data redaction (passwords, tokens)


## Testing Strategy

### Dual Testing Approach

The EcoWaste Management System requires both unit tests and property-based tests for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs through randomization

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Library Selection:**
- **Backend (Node.js)**: Use `fast-check` for property-based testing
- **Frontend (TypeScript)**: Use `fast-check` for property-based testing

**Configuration:**
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `Feature: ecowaste-management-system, Property {number}: {property_text}`

**Example Property Test:**

```javascript
// Feature: ecowaste-management-system, Property 1: Password Hashing Integrity
describe('Property 1: Password Hashing Integrity', () => {
  it('should never store plain text passwords', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 30 })
            .filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 100 })
        }),
        async (userData) => {
          // Register user
          const user = await User.create(userData);
          
          // Verify password is hashed
          expect(user.password).not.toBe(userData.password);
          expect(user.password).toMatch(/^\$2[aby]\$\d{2}\$/); // bcrypt format
          
          // Verify bcrypt can verify the password
          const isValid = await bcrypt.compare(userData.password, user.password);
          expect(isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```


### Unit Testing

**Testing Framework:**
- **Backend**: Jest or Mocha with Chai
- **Frontend**: Jest with React Testing Library

**Unit Test Focus Areas:**

1. **Specific Examples**
   - User registration with valid data
   - Login with correct credentials
   - Report submission with plastic waste image
   - Facility lookup by specific state

2. **Edge Cases**
   - Empty input fields
   - Maximum length strings
   - Boundary values (0 points, 5MB file size)
   - Special characters in text fields

3. **Error Conditions**
   - Invalid email format
   - Duplicate username registration
   - Expired JWT token
   - Missing required fields
   - File upload failures

4. **Integration Points**
   - Database connection and queries
   - AI service API calls
   - File system operations
   - Cookie management

**Example Unit Test:**

```javascript
describe('User Registration', () => {
  it('should register a new user with valid data', async () => {
    const userData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'SecurePass123'
    };
    
    const response = await request(app)
      .post('/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.user.username).toBe('john_doe');
    expect(response.body.user.email).toBe('john@example.com');
    expect(response.body.user.points).toBe(0);
    expect(response.headers['set-cookie']).toBeDefined();
  });
  
  it('should reject registration with duplicate email', async () => {
    // Create first user
    await User.create({
      username: 'user1',
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Attempt duplicate registration
    const response = await request(app)
      .post('/register')
      .send({
        username: 'user2',
        email: 'test@example.com',
        password: 'password456'
      })
      .expect(409);
    
    expect(response.body.error.code).toBe('DUPLICATE_EMAIL');
  });
});
```


### Test Coverage Goals

**Backend:**
- Controllers: 90%+ coverage
- Services: 95%+ coverage
- Middleware: 95%+ coverage
- Models: 85%+ coverage
- Routes: 90%+ coverage

**Frontend:**
- Components: 80%+ coverage
- Pages: 75%+ coverage
- Hooks: 90%+ coverage
- Utilities: 95%+ coverage

### Testing Best Practices

1. **Avoid Too Many Unit Tests**
   - Property-based tests handle covering lots of inputs
   - Focus unit tests on specific examples and integration points
   - Don't write redundant tests for scenarios covered by properties

2. **Test Isolation**
   - Each test should be independent
   - Use beforeEach/afterEach for setup/teardown
   - Mock external dependencies (AI service, file system)

3. **Test Data Management**
   - Use factories or fixtures for test data
   - Clean up database after each test
   - Use separate test database

4. **Mocking Strategy**
   - Mock AI service to avoid API costs and rate limits
   - Mock file system for upload tests
   - Use real database for integration tests

5. **Property Test Generators**
   - Create custom generators for domain objects (User, Report, Facility)
   - Ensure generated data meets validation constraints
   - Use shrinking to find minimal failing examples

### Continuous Integration

**CI Pipeline:**
1. Lint code (ESLint, Prettier)
2. Run unit tests
3. Run property tests
4. Check test coverage
5. Build application
6. Run integration tests
7. Security audit (npm audit)

**Required Checks:**
- All tests pass
- Coverage thresholds met
- No linting errors
- No security vulnerabilities


## Deployment Architecture

### Environment Configuration

**Development:**
- Local MongoDB instance
- Local file storage
- CORS: localhost:3000
- Detailed error messages and stack traces
- Debug logging enabled

**Staging:**
- MongoDB Atlas (shared cluster)
- Cloud storage (AWS S3 or Cloudinary)
- CORS: staging.ecowaste.com
- Sanitized error messages
- Info-level logging

**Production:**
- MongoDB Atlas (dedicated cluster with replicas)
- Cloud storage with CDN
- CORS: ecowaste.com
- Minimal error exposure
- Warn/error-level logging only
- Rate limiting enforced
- Security headers enabled

### Infrastructure Components

```mermaid
graph TB
    subgraph "Client"
        Browser[Web Browser]
    end
    
    subgraph "CDN"
        CloudFront[CloudFront/Cloudflare]
    end
    
    subgraph "Frontend Hosting"
        Vercel[Vercel/Netlify]
    end
    
    subgraph "Backend Hosting"
        LB[Load Balancer]
        API1[API Server 1]
        API2[API Server 2]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB Atlas)]
        S3[AWS S3/Cloudinary]
        Redis[(Redis Cache)]
    end
    
    subgraph "External Services"
        Gemini[Google Gemini AI]
    end
    
    Browser --> CloudFront
    CloudFront --> Vercel
    Vercel --> LB
    LB --> API1
    LB --> API2
    API1 --> MongoDB
    API2 --> MongoDB
    API1 --> S3
    API2 --> S3
    API1 --> Redis
    API2 --> Redis
    API1 --> Gemini
    API2 --> Gemini
```

### Scaling Considerations

**Horizontal Scaling:**
- Multiple API server instances behind load balancer
- Stateless authentication (JWT) enables easy scaling
- Session data in Redis for shared state

**Database Scaling:**
- MongoDB replica set for high availability
- Read replicas for report listing queries
- Indexes on frequently queried fields

**Caching Strategy:**
- Redis for session storage
- Cache facility listings (TTL: 1 hour)
- Cache user profiles (TTL: 15 minutes)
- CDN for static assets and images

**File Storage:**
- Cloud storage (S3/Cloudinary) for uploaded images
- CDN for fast image delivery
- Image optimization and compression
- Automatic backup and versioning


## Performance Optimization

### Backend Optimizations

1. **Database Query Optimization**
   - Use indexes on frequently queried fields (username, email, status, createdAt)
   - Implement pagination for large result sets
   - Use projection to return only needed fields
   - Aggregate queries for statistics

2. **Caching**
   - Cache facility listings in Redis
   - Cache user profiles with short TTL
   - Cache AI classification results for duplicate images
   - Implement cache invalidation on updates

3. **Compression**
   - Enable gzip compression for API responses
   - Compress images before storage
   - Use WebP format for better compression

4. **Connection Pooling**
   - MongoDB connection pool (min: 10, max: 100)
   - Reuse HTTP connections for AI API calls

### Frontend Optimizations

1. **Code Splitting**
   - Route-based code splitting (Next.js automatic)
   - Lazy load heavy components (dashboard charts)
   - Dynamic imports for modals and dialogs

2. **Image Optimization**
   - Next.js Image component for automatic optimization
   - Lazy loading for images below the fold
   - Responsive images with srcset
   - WebP format with fallbacks

3. **Bundle Size**
   - Tree shaking to remove unused code
   - Analyze bundle with webpack-bundle-analyzer
   - Use lighter alternatives for heavy libraries
   - Remove unused Radix UI components

4. **Rendering Strategy**
   - Server-side rendering for landing page (SEO)
   - Static generation for public pages
   - Client-side rendering for authenticated pages
   - Incremental static regeneration for facility listings

### Monitoring and Metrics

**Application Monitoring:**
- Response time tracking
- Error rate monitoring
- API endpoint performance
- Database query performance

**Infrastructure Monitoring:**
- CPU and memory usage
- Network throughput
- Disk I/O
- Database connections

**Business Metrics:**
- User registrations per day
- Reports submitted per day
- AI classification accuracy
- Average points per user

**Tools:**
- Application: New Relic, Datadog, or Application Insights
- Logs: ELK Stack (Elasticsearch, Logstash, Kibana)
- Errors: Sentry
- Uptime: Pingdom, UptimeRobot


## Future Enhancements

### Phase 2 Features

1. **Real-time Notifications**
   - WebSocket integration for live updates
   - Push notifications for report status changes
   - Email notifications for Green Champions

2. **Advanced Analytics**
   - Waste type distribution charts
   - Geographic heat maps of reports
   - User engagement metrics
   - Trend analysis over time

3. **Mobile Application**
   - React Native mobile app
   - Offline support for report submission
   - Camera integration for instant capture
   - GPS integration for automatic location

4. **Social Features**
   - User profiles with badges and achievements
   - Public leaderboards
   - Report commenting and discussions
   - Share reports on social media

5. **Green Champion Tools**
   - Report assignment and routing
   - Bulk status updates
   - Performance dashboards
   - Communication tools

### Technical Improvements

1. **GraphQL API**
   - Replace REST with GraphQL for flexible queries
   - Reduce over-fetching and under-fetching
   - Real-time subscriptions

2. **Microservices Architecture**
   - Separate AI service into dedicated microservice
   - Image processing service
   - Notification service
   - Analytics service

3. **Advanced AI Features**
   - Multi-object detection in images
   - Waste quantity estimation
   - Contamination detection
   - Automated report categorization

4. **Blockchain Integration**
   - Immutable audit trail for reports
   - Tokenized rewards system
   - Transparent facility tracking

5. **Internationalization**
   - Multi-language support
   - Regional waste classification standards
   - Currency localization for shopping

## Conclusion

This design document provides a comprehensive blueprint for the EcoWaste Management System. The architecture balances modern technology choices with practical implementation considerations, ensuring scalability, security, and maintainability.

Key design strengths:
- Modular three-tier architecture
- Comprehensive security measures
- AI-powered waste classification
- Property-based testing for correctness
- Scalable infrastructure design

The system is designed to grow with user needs while maintaining code quality and system reliability through extensive testing and monitoring strategies.
