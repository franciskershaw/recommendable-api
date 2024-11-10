# Recommendable API

## Overview

Recommendable API is a RESTful backend service that powers a recommendation tracking application. It allows users to store, manage, and organize recommendations they receive from friends across different categories like films, TV shows, music, events, and places.

## Features

### Authentication & Authorization

- Local authentication with email/password
- Google OAuth integration
- JWT-based authentication with access and refresh tokens
- Secure password hashing using bcrypt

### Recommendation Management

- Create, read, update, and delete recommendations
- Categorize recommendations (Films, TV, Music, Events, Places)
- Archive/unarchive recommendations
- User-specific recommendation lists
- Sort preferences for different categories

### Security Features

- CORS protection
- Helmet security headers
- HTTP-only cookies for refresh tokens
- Input validation using Joi
- Environment-based configuration

## Technical Stack

### Core Technologies

- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- Passport.js for authentication
- Docker for containerization

### Key Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `passport` - Authentication middleware
- `jsonwebtoken` - JWT implementation
- `joi` - Request validation
- `bcryptjs` - Password hashing
- `typescript` - Type safety and developer experience

## Project Structure

```
src/
├── config/ # Configuration files (DB, Passport)
├── controllers/ # Request handlers
├── middleware/ # Custom middleware
├── models/ # Mongoose models
├── routes/ # API routes
├── utils/ # Utility functions
├── joiSchemas/ # Input validation schemas
└── server.ts # Application entry point
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Recommendations

- `GET /api/recommends` - Get all recommendations
- `POST /api/recommends` - Create new recommendation
- `PUT /api/recommends/:id` - Update recommendation
- `DELETE /api/recommends/:id` - Delete recommendation
- `PUT /api/recommends/:id/archive` - Archive recommendation
- `PUT /api/recommends/:id/unarchive` - Unarchive recommendation

## Development Setup

1. Clone the repository
2. Install dependencies:

```
npm install
```

3. Create a `.env` file with required environment variables:

```
NODE_ENV=development
PORT=5400
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CORS_ORIGIN=your_frontend_url
```

4. Start development server:

```
npm run dev
```

## Docker Support

### Development

```
npm run docker:compose
```

### Production

```
npm run docker:build
npm run docker:prod
```

## Deployment

The project includes GitHub Actions workflows for automated deployment to DigitalOcean, including:

- Docker image building and pushing
- Nginx configuration
- SSL certificate management
- Health checks
- Automatic rollback on failure

## Error Handling

The API implements a centralized error handling system with custom error classes for different HTTP status codes. All errors are properly formatted and logged based on the environment.

## License

ISC

## Author

Francis Kershaw
