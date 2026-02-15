# Requirements Document: EcoWaste Management System

## Introduction

The EcoWaste Management System is a comprehensive waste management platform designed for India's waste management ecosystem. The system integrates citizen training, community monitoring, facility tracking, and AI-powered waste classification to promote sustainable waste management practices. The platform enables citizens to report waste management issues, earn points through gamification, and access recycling facilities while providing Green Champions with monitoring tools and administrators with facility management capabilities.

## Glossary

- **System**: The EcoWaste Management System platform (backend and frontend)
- **User**: A registered citizen using the platform
- **Green_Champion**: A user with elevated privileges for monitoring and verification
- **Report**: A waste management issue submission with photo and location data
- **AI_Classifier**: The Google Gemini-based waste classification service
- **Facility**: A recycling center or waste processing facility
- **Points**: Gamification currency awarded for waste reporting activities
- **JWT_Token**: JSON Web Token used for authentication
- **Waste_Type**: Classification category (Plastic, Biodegradable, Other)

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a citizen, I want to register and authenticate securely, so that I can access the platform and track my contributions.

#### Acceptance Criteria

1. WHEN a user submits registration with username, email, and password, THE System SHALL create a new user account with hashed password
2. WHEN a user submits valid login credentials, THE System SHALL generate a JWT_Token and store it in an HTTP-only cookie
3. WHEN a user's password is stored, THE System SHALL hash it using bcrypt with minimum 10 salt rounds
4. WHEN a user attempts to register with an existing email, THE System SHALL reject the registration and return an error
5. WHEN a user attempts to register with an existing username, THE System SHALL reject the registration and return an error
6. WHEN a user logs out, THE System SHALL clear the JWT_Token cookie
7. WHEN a JWT_Token is generated, THE System SHALL use a cryptographically secure secret from environment variables

### Requirement 2: Secure Configuration Management

**User Story:** As a system administrator, I want sensitive credentials stored securely, so that the system is protected from security vulnerabilities.

#### Acceptance Criteria

1. THE System SHALL load JWT secret from environment variables
2. THE System SHALL load Google AI API key from environment variables
3. THE System SHALL load database connection string from environment variables
4. THE System SHALL load CORS origin configuration from environment variables
5. WHEN environment variables are missing, THE System SHALL fail to start and log descriptive error messages
6. THE System SHALL NOT expose sensitive credentials in source code or logs

### Requirement 3: AI-Powered Waste Classification

**User Story:** As a user, I want my waste photos automatically classified, so that I can receive appropriate points and contribute accurate data.

#### Acceptance Criteria

1. WHEN a user uploads a waste image, THE AI_Classifier SHALL analyze the image and return a Waste_Type classification
2. WHEN the AI_Classifier identifies plastic waste, THE System SHALL assign 10 points to the report
3. WHEN the AI_Classifier identifies biodegradable waste, THE System SHALL assign 5 points to the report
4. WHEN the AI_Classifier identifies other waste types, THE System SHALL assign 0 points to the report
5. WHEN the AI_Classifier cannot determine waste type, THE System SHALL classify it as "unknown" and assign 0 points
6. WHEN an image is sent to the AI_Classifier, THE System SHALL encode it as base64 JPEG format
7. THE AI_Classifier SHALL return classification results with appropriate emoji indicators (♻️ for plastic, 🌿 for biodegradable)

### Requirement 4: Community Waste Reporting

**User Story:** As a user, I want to report waste management issues with photos and location data, so that problems can be tracked and resolved.

#### Acceptance Criteria

1. WHEN a user submits a report with image, username, location, title, and description, THE System SHALL create a new Report with status "pending"
2. WHEN a report is created, THE System SHALL process the uploaded image through the AI_Classifier
3. WHEN a report is created, THE System SHALL associate it with the authenticated user's account
4. WHEN a report is created with AI classification, THE System SHALL add the awarded points to the user's total points
5. WHEN a user requests their reports, THE System SHALL return only reports created by that user
6. WHEN a user requests community reports, THE System SHALL return all reports sorted by creation date descending
7. WHEN a report image is uploaded, THE System SHALL store the image file path in the database

### Requirement 5: Input Validation and Sanitization

**User Story:** As a system administrator, I want all user inputs validated and sanitized, so that the system is protected from malicious data and injection attacks.

#### Acceptance Criteria

1. WHEN a user submits registration data, THE System SHALL validate that username is non-empty and contains only alphanumeric characters and underscores
2. WHEN a user submits registration data, THE System SHALL validate that email follows valid email format
3. WHEN a user submits registration data, THE System SHALL validate that password meets minimum length of 8 characters
4. WHEN a user uploads an image file, THE System SHALL validate that the file type is JPEG, PNG, or WebP
5. WHEN a user uploads an image file, THE System SHALL validate that the file size does not exceed 5MB
6. WHEN a user submits report data, THE System SHALL sanitize title and description to prevent XSS attacks
7. WHEN a user submits location data, THE System SHALL validate that it is a non-empty string

### Requirement 6: Rate Limiting and Security Headers

**User Story:** As a system administrator, I want rate limiting and security headers implemented, so that the system is protected from abuse and common attacks.

#### Acceptance Criteria

1. WHEN a client makes requests to authentication endpoints, THE System SHALL limit requests to 5 per minute per IP address
2. WHEN a client makes requests to report submission endpoints, THE System SHALL limit requests to 10 per hour per authenticated user
3. WHEN a client makes requests to report listing endpoints, THE System SHALL limit requests to 100 per minute per authenticated user
4. THE System SHALL set X-Content-Type-Options header to "nosniff"
5. THE System SHALL set X-Frame-Options header to "DENY"
6. THE System SHALL set X-XSS-Protection header to "1; mode=block"
7. THE System SHALL set Strict-Transport-Security header for HTTPS connections

### Requirement 7: Facility Management

**User Story:** As a user, I want to find recycling facilities by state, so that I can locate nearby waste processing centers.

#### Acceptance Criteria

1. WHEN a user requests facilities for a state, THE System SHALL return all facilities matching that state
2. WHEN a facility is stored, THE System SHALL include state, total count, and array of recyclers
3. WHEN a recycler is stored, THE System SHALL include name, address, quantity, and rating
4. WHEN a user requests all facilities, THE System SHALL return facilities sorted by state alphabetically
5. THE System SHALL validate that facility state is a non-empty string
6. THE System SHALL validate that recycler rating is between 0 and 5

### Requirement 8: Points and Gamification System

**User Story:** As a user, I want to earn points for my contributions, so that I am motivated to participate in waste management activities.

#### Acceptance Criteria

1. WHEN a user creates a report with plastic waste classification, THE System SHALL add 10 points to the user's total
2. WHEN a user creates a report with biodegradable waste classification, THE System SHALL add 5 points to the user's total
3. WHEN a user creates a report with other waste classification, THE System SHALL add 0 points to the user's total
4. WHEN a user's points are updated, THE System SHALL persist the new total to the database
5. WHEN a user requests their profile, THE System SHALL include their current points total
6. THE System SHALL initialize new user accounts with 0 points

### Requirement 9: Authentication Middleware and Protected Routes

**User Story:** As a system administrator, I want protected routes to require valid authentication, so that unauthorized users cannot access sensitive functionality.

#### Acceptance Criteria

1. WHEN a request is made to a protected route without a JWT_Token, THE System SHALL reject the request with 401 Unauthorized status
2. WHEN a request is made to a protected route with an invalid JWT_Token, THE System SHALL reject the request with 401 Unauthorized status
3. WHEN a request is made to a protected route with an expired JWT_Token, THE System SHALL reject the request with 401 Unauthorized status
4. WHEN a request is made to a protected route with a valid JWT_Token, THE System SHALL extract the user ID and attach it to the request
5. WHEN a JWT_Token is validated, THE System SHALL verify the signature using the configured secret
6. THE System SHALL protect report submission endpoints with authentication middleware
7. THE System SHALL protect report listing endpoints with authentication middleware

### Requirement 10: Error Handling and Logging

**User Story:** As a system administrator, I want comprehensive error handling and logging, so that I can diagnose issues and maintain system reliability.

#### Acceptance Criteria

1. WHEN an error occurs during request processing, THE System SHALL return a consistent error response format with status code and message
2. WHEN a database operation fails, THE System SHALL log the error with timestamp and context
3. WHEN the AI_Classifier fails to process an image, THE System SHALL log the error and return a user-friendly message
4. WHEN authentication fails, THE System SHALL log the attempt with timestamp and IP address
5. WHEN file upload fails, THE System SHALL return a descriptive error message indicating the failure reason
6. THE System SHALL NOT expose internal error details or stack traces to clients in production
7. WHEN critical errors occur, THE System SHALL log them with "error" level severity

### Requirement 11: CORS and Cross-Origin Security

**User Story:** As a system administrator, I want CORS properly configured, so that only authorized origins can access the API.

#### Acceptance Criteria

1. WHEN a request is received from an origin, THE System SHALL validate it against the configured allowed origins
2. WHEN a request is received from an unauthorized origin, THE System SHALL reject the request
3. WHEN a preflight OPTIONS request is received, THE System SHALL respond with appropriate CORS headers
4. THE System SHALL allow credentials (cookies) for requests from authorized origins
5. THE System SHALL load allowed origins from environment variables
6. WHEN multiple origins are configured, THE System SHALL support comma-separated origin list

### Requirement 12: Database Schema Validation

**User Story:** As a developer, I want database schemas to enforce data integrity, so that invalid data cannot be persisted.

#### Acceptance Criteria

1. WHEN a User document is created, THE System SHALL require username, email, and password fields
2. WHEN a User document is created, THE System SHALL enforce unique constraints on username and email
3. WHEN a Report document is created, THE System SHALL require user reference and username fields
4. WHEN a Report document is created, THE System SHALL default status to "pending" if not provided
5. WHEN a Report document is created, THE System SHALL default points to 0 if not provided
6. WHEN a Facility document is created, THE System SHALL require state and total fields
7. WHEN timestamps are enabled on a model, THE System SHALL automatically set createdAt and updatedAt fields

### Requirement 13: Image Storage and Processing

**User Story:** As a user, I want my uploaded images stored securely and efficiently, so that they can be retrieved for report viewing.

#### Acceptance Criteria

1. WHEN a user uploads an image, THE System SHALL store it with a unique filename to prevent collisions
2. WHEN an image is stored, THE System SHALL save the file path in the Report document
3. WHEN an image is uploaded, THE System SHALL validate the file exists before processing
4. WHEN an image upload fails, THE System SHALL return an error and not create a partial report
5. THE System SHALL store uploaded images in a dedicated uploads directory
6. WHEN an image is processed by AI_Classifier, THE System SHALL preserve the original uploaded file

### Requirement 14: Report Status Management

**User Story:** As a Green_Champion, I want to update report statuses, so that I can track investigation and resolution progress.

#### Acceptance Criteria

1. WHEN a report is created, THE System SHALL set initial status to "pending"
2. THE System SHALL support status values: "pending", "investigating", "resolved", "verified"
3. WHEN a Green_Champion updates report status, THE System SHALL validate the new status is a valid value
4. WHEN a report status is updated, THE System SHALL update the updatedAt timestamp
5. WHEN a user views community reports, THE System SHALL display the current status for each report

### Requirement 15: User Profile and Points Tracking

**User Story:** As a user, I want to view my profile with accumulated points, so that I can track my contribution to waste management.

#### Acceptance Criteria

1. WHEN a user requests their profile, THE System SHALL return username, email, and total points
2. WHEN a user's points are updated, THE System SHALL ensure the total is never negative
3. WHEN a user creates multiple reports, THE System SHALL accumulate points from all reports
4. THE System SHALL NOT expose password hashes in profile responses
5. WHEN a user is deleted, THE System SHALL maintain referential integrity with their reports
