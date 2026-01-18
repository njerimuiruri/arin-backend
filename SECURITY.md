# Authentication Security Implementation

## Overview

This backend implements industry-standard JWT authentication with the following security measures:

## ✅ Security Features Implemented

### 1. **HttpOnly Cookies for JWT Storage**

- ✅ Access tokens stored in `arin_token` cookie (HttpOnly)
- ✅ Refresh tokens stored in `arin_refresh_token` cookie (HttpOnly)
- **Protection**: Prevents XSS attacks - JavaScript cannot access these cookies

### 2. **Short-Lived Access Tokens**

- ✅ Access tokens expire in **15 minutes**
- ✅ Reduces the window of opportunity if a token is compromised
- ✅ Automatically refreshed using refresh tokens

### 3. **Long-Lived Refresh Tokens**

- ✅ Refresh tokens expire in **7 days**
- ✅ Stored in separate HttpOnly cookie
- ✅ Used to obtain new access tokens without re-authentication

### 4. **CSRF Protection**

- ✅ `sameSite: 'lax'` cookie attribute
- ✅ Prevents cross-site request forgery attacks
- ✅ Cookies only sent with same-site requests

### 5. **Secure Cookie Options**

```typescript
{
  httpOnly: true,        // ✅ XSS Protection
  secure: production,    // ✅ HTTPS only in production
  sameSite: 'lax',      // ✅ CSRF Protection
  path: '/',            // ✅ Available across the app
}
```

### 6. **CORS Configuration**

- ✅ Credentials enabled for cookie transmission
- ✅ Specific origins whitelisted (localhost ports)
- ✅ No wildcard (\*) origins allowed

## 🔐 Authentication Flow

### Login Flow

1. User submits credentials to `/auth/login`
2. Backend validates credentials
3. Generates **access token** (15 min) and **refresh token** (7 days)
4. Sets both tokens as HttpOnly cookies
5. Returns user info (no tokens in response body)

### Protected Route Access

1. Frontend makes request with `credentials: 'include'`
2. Browser automatically sends `arin_token` cookie
3. JWT Strategy extracts token from cookie
4. Validates token and attaches user to request
5. Route handler accesses `req.user`

### Token Refresh Flow

1. Access token expires (15 minutes)
2. Frontend receives 401 Unauthorized
3. Frontend calls `/auth/refresh` endpoint
4. Backend validates refresh token from cookie
5. Issues new access and refresh tokens
6. Sets new cookies
7. Frontend retries original request

### Logout Flow

1. User clicks logout
2. Frontend calls `/auth/logout`
3. Backend clears both cookies
4. Redirects to login page

## 🛡️ Security Best Practices

### What We Do Right

✅ Tokens never exposed to JavaScript  
✅ Short token lifetimes reduce risk  
✅ Automatic token refresh improves UX  
✅ SameSite cookies prevent CSRF  
✅ Secure flag in production (HTTPS only)  
✅ Proper CORS configuration  
✅ Password hashing (bcrypt)  
✅ Credentials validation before token issuance

### Additional Recommendations for Production

1. **Use Environment Variables**

   ```bash
   JWT_SECRET=<strong-random-secret-here>
   NODE_ENV=production
   ```

2. **Enable HTTPS in Production**
   - Ensures `secure` cookie flag works
   - Prevents man-in-the-middle attacks

3. **Rate Limiting**
   - Consider adding rate limiting to login endpoint
   - Prevents brute force attacks

4. **Token Blacklisting (Optional)**
   - Store invalidated tokens in Redis
   - Check against blacklist on each request
   - Useful for immediate logout across devices

5. **Refresh Token Rotation**
   - Issue new refresh token on each refresh
   - Invalidate old refresh token
   - Detects token theft

## 📝 Endpoints

| Endpoint        | Method | Auth Required      | Description               |
| --------------- | ------ | ------------------ | ------------------------- |
| `/auth/login`   | POST   | No                 | Login with email/password |
| `/auth/logout`  | POST   | No                 | Clear auth cookies        |
| `/auth/me`      | GET    | Yes                | Get current user info     |
| `/auth/refresh` | POST   | No (refresh token) | Refresh access token      |
| `/auth/verify`  | GET    | Yes                | Verify authentication     |

## 🔍 Testing Authentication

### Test Login

```bash
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  -c cookies.txt
```

### Test Protected Route

```bash
curl http://localhost:5001/auth/me \
  -b cookies.txt
```

### Test Token Refresh

```bash
curl -X POST http://localhost:5001/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Test Logout

```bash
curl -X POST http://localhost:5001/auth/logout \
  -b cookies.txt
```

## 🐛 Debugging

Enable debug logs in the backend to see:

- Cookie detection
- Token extraction
- Payload validation

Check browser DevTools:

- Application → Cookies → localhost:5001
- Should see `arin_token` and `arin_refresh_token`
- Both should have HttpOnly flag enabled

## 📚 References

- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [SameSite Cookie Explanation](https://web.dev/samesite-cookies-explained/)
- [HttpOnly Cookie Security](https://owasp.org/www-community/HttpOnly)
