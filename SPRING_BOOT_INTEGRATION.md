# SecureVault Frontend - Spring Boot Integration Guide

## Overview
This is a React frontend for the SecureVault nominee-based digital asset transfer platform. It connects to a Spring Boot backend via REST APIs.

## Environment Configuration

### Development (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Production (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-production-domain.com/api
```

## API Configuration

All API endpoints are defined in `lib/api-config.ts`. Update the `API_BASE_URL` to match your Spring Boot server.

### Authentication Endpoints
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/signup` - User registration
- **POST** `/api/auth/verify-otp` - OTP verification
- **POST** `/api/auth/logout` - Logout
- **POST** `/api/auth/refresh` - Refresh authentication token

### User Management
- **GET** `/api/users/profile` - Get user profile
- **PUT** `/api/users/profile` - Update profile
- **POST** `/api/users/password` - Change password
- **GET** `/api/users/plans` - Get available plans
- **POST** `/api/users/upgrade-plan` - Upgrade plan

### Digital Assets
- **GET** `/api/assets` - List user assets
- **POST** `/api/assets` - Create new asset
- **GET** `/api/assets/{id}` - Get asset details
- **PUT** `/api/assets/{id}` - Update asset
- **DELETE** `/api/assets/{id}` - Delete asset

### Nominees
- **GET** `/api/nominees` - List nominees
- **POST** `/api/nominees` - Add nominee
- **PUT** `/api/nominees/{id}` - Update nominee
- **DELETE** `/api/nominees/{id}` - Remove nominee
- **POST** `/api/nominees/verify` - Verify nominee (with token)

### Admin
- **POST** `/api/admin/login` - Admin login
- **GET** `/api/admin/verification-requests` - Get pending verification requests
- **POST** `/api/admin/verification-requests/{id}/approve` - Approve request
- **POST** `/api/admin/verification-requests/{id}/reject` - Reject request
- **GET** `/api/admin/users` - Get all users
- **GET** `/api/admin/logs` - Get activity logs

### Payments
- **POST** `/api/payments/create-order` - Create payment order
- **POST** `/api/payments/verify` - Verify payment

## Authentication Flow

1. User signs up at `/signup` → POST to `/api/auth/signup` → Receive OTP
2. User verifies OTP → POST to `/api/auth/verify-otp` → Get JWT token
3. Token stored in localStorage as `authToken`
4. All subsequent requests include `Authorization: Bearer {token}` header
5. On token expiration (401 response), user is redirected to `/login`

## JWT Token Structure

Expected response from login/signup:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "plan": "FREE"
  }
}
```

## Making API Requests

Use the helper functions from `lib/api-client.ts`:

```typescript
import { apiPost, apiGet } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/lib/api-config"

// POST request
const response = await apiPost(
  API_ENDPOINTS.auth.login,
  { email: "user@example.com", password: "password" }
)

// GET request
const assets = await apiGet(API_ENDPOINTS.assets.list)

// With error handling
if (response.success) {
  console.log("Success:", response.data)
} else {
  console.error("Error:", response.error)
}
```

## CORS Configuration

Your Spring Boot backend must allow CORS requests from the frontend URL:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000", "https://yourdomain.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## Building & Deployment

### Development
```bash
npm run dev
# Frontend runs on http://localhost:3000
# Backend must run on http://localhost:8080
```

### Production Build
```bash
npm run build
npm start
```

### Deploying with Spring Boot
To serve the frontend from Spring Boot:

1. Build frontend: `npm run build`
2. Copy `out/` folder contents to `src/main/resources/static/`
3. Start Spring Boot server

## Debugging

1. Check network requests in browser DevTools
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Ensure CORS is properly configured on backend
4. Check localStorage for `authToken` in browser DevTools

## File Structure

```
/app              # Next.js pages and layouts
  /login         # User login page
  /signup        # User signup page  
  /dashboard     # Protected dashboard pages
  /admin         # Admin pages (protected)
  /nominee       # Nominee verification pages
  /pricing       # Pricing/plans page

/components       # Reusable React components
  /ui           # shadcn/ui components
  /sections     # Landing page sections

/lib
  /api-config.ts    # API endpoint configuration
  /api-client.ts    # API request helpers
  /utils.ts         # Utility functions
```

## Notes
- All date/time handling should be in UTC
- Passwords are hashed with bcrypt on backend
- All sensitive data should be encrypted
- Use HTTPS in production
- Implement refresh token rotation for enhanced security
