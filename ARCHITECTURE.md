# Professional Authentication Architecture Diagram

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENT                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   REACT APPLICATION                           │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  AuthProvider (Context)                             │    │   │
│  │  │  - Manages user state                               │    │   │
│  │  │  - Handles login/logout/register                    │    │   │
│  │  │  - Stores token in localStorage                     │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                         ↓                                    │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  Axios Interceptor                                  │    │   │
│  │  │  - Adds Bearer token to all requests                │    │   │
│  │  │  - Handles 401/403 errors                           │    │   │
│  │  │  - Redirects to login on auth error                 │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                         ↓                                    │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  Route Guards (RoleGuard, AuthGuard, etc)           │    │   │
│  │  │  - Protects routes based on authentication          │    │   │
│  │  │  - Checks user role/permissions                     │    │   │
│  │  │  - Redirects unauthorized users                     │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                                                               │   │
│  │  Pages: LoginPage, RegisterPage, Dashboard, Admin, etc.     │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│                             │                                        │
│                             │ HTTP/HTTPS                             │
│                             ↓                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    FIREBASE (Third Party)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Firebase Authentication                                    │    │
│  │  - Email/Password authentication                           │    │
│  │  - User creation and management                            │    │
│  │  - ID Token generation                                     │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER (Backend)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Routes                                                      │   │
│  │  - POST /api/users/register                                 │   │
│  │  - GET /api/users/me                                        │   │
│  │  - GET /api/users (admin only)                              │   │
│  │  - PATCH /api/users/:id                                     │   │
│  │  - DELETE /api/users/:id (superadmin only)                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Middleware Stack (in order)                                │   │
│  │  1. authenticateFirebase                                    │   │
│  │     - Extracts Bearer token from Authorization header       │   │
│  │     - Verifies token with Firebase Admin SDK                │   │
│  │     - Fetches user from MongoDB                             │   │
│  │     - Attaches req.firebaseUser and req.dbUser             │   │
│  │                                                              │   │
│  │  2. authorizeAdminOrSuperadmin / authorizeSuperadminOnly   │   │
│  │     - Checks user role                                      │   │
│  │     - Blocks unauthorized access                            │   │
│  │  └──────────────────────────────────────────────────────────┘   │
│                             ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Controllers                                                 │   │
│  │  - getMeController: Get user profile                        │   │
│  │  - registerController: Create user in MongoDB               │   │
│  │  - listUsersController: List all users                      │   │
│  │  - updateUserController: Update user data                   │   │
│  │  - deleteUserController: Delete user (soft delete)          │   │
│  │  └──────────────────────────────────────────────────────────┘   │
│                             ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Firebase Admin SDK                                         │   │
│  │  - admin.auth().verifyIdToken(token)                        │   │
│  │  - Verifies token signature and claims                      │   │
│  │  - Returns decoded token with uid and email                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     MONGODB (Database)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  User Collection                                            │    │
│  │  - _id: ObjectId                                            │    │
│  │  - firebaseUid: string (unique, linked to Firebase)         │    │
│  │  - email: string                                            │    │
│  │  - name: string                                             │    │
│  │  - lastName: string                                         │    │
│  │  - role: "superadmin" | "admin" | "employee"               │    │
│  │  - plan: "free" | "basic" | "active" | "suspended"         │    │
│  │  - isActive: boolean                                        │    │
│  │  - address: object                                          │    │
│  │  - createdAt: Date                                          │    │
│  │  - updatedAt: Date                                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow Detailed

```
1. USER LOGIN
   ┌─────────────────────────────────────────┐
   │  User enters email/password on           │
   │  /auth/login page                        │
   └─────────────────────┬───────────────────┘
                         ↓
2. FIREBASE AUTHENTICATION
   ┌─────────────────────────────────────────┐
   │  signInWithEmailAndPassword()            │
   │  Firebase validates credentials         │
   │  Returns User object + credentials      │
   └─────────────────────┬───────────────────┘
                         ↓
3. GET ID TOKEN
   ┌─────────────────────────────────────────┐
   │  getIdToken(user, true)                 │
   │  Returns Firebase ID Token (JWT)        │
   │  Valid for ~1 hour                      │
   └─────────────────────┬───────────────────┘
                         ↓
4. STORE LOCALLY
   ┌─────────────────────────────────────────┐
   │  localStorage.setItem("firebaseToken")  │
   │  localStorage.setItem("user")           │
   │  AuthContext.setUser()                  │
   │  AuthContext.setAuthenticated(true)     │
   └─────────────────────┬───────────────────┘
                         ↓
5. FETCH USER PROFILE
   ┌─────────────────────────────────────────┐
   │  apiClient.get("/users/me")             │
   │  Axios interceptor adds Bearer token    │
   │  to Authorization header                │
   └─────────────────────┬───────────────────┘
                         ↓
   ┌──────────────────────────────────────────────────┐
   │  BACKEND: Middleware Stack                       │
   │  1. authenticateFirebase middleware:             │
   │     - Extract token from header                  │
   │     - Call admin.auth().verifyIdToken(token)    │
   │     - Firebase validates signature               │
   │     - Get firebaseUid from token                 │
   │     - Query MongoDB: User.findOne({firebaseUid}) │
   │     - Return user document                       │
   │  2. Controller (getMeController):                │
   │     - Access req.firebaseUser (token decoded)    │
   │     - Access req.dbUser (from MongoDB)           │
   │     - Return user data                           │
   └──────────────────────┬───────────────────────────┘
                         ↓
6. UPDATE FRONTEND
   ┌─────────────────────────────────────────┐
   │  AuthContext updates state with user    │
   │  Profile from MongoDB                   │
   │  isLoading = false                      │
   │  isAuthenticated = true                 │
   └─────────────────────┬───────────────────┘
                         ↓
7. REDIRECT
   ┌─────────────────────────────────────────┐
   │  useNavigate() redirects to /dashboard  │
   │  RoleGuard checks role and grants       │
   │  access to protected content            │
   └─────────────────────────────────────────┘
```

---

## 🛡️ Authorization Levels

```
┌──────────────────────────────────────────────────────────┐
│                    AUTHORIZATION LEVELS                  │
└──────────────────────────────────────────────────────────┘

Level 0: PUBLIC
┌────────────────────────────────┐
│ /auth/login                    │
│ /auth/register                 │
│ No authentication required     │
└────────────────────────────────┘
                ↓

Level 1: AUTHENTICATED
┌────────────────────────────────┐
│ /dashboard                     │
│ /profile                       │
│ Requires: isAuthenticated      │
│ Requires: AuthGuard            │
└────────────────────────────────┘
                ↓

Level 2: EMPLOYEE
┌────────────────────────────────┐
│ /products                      │
│ /sales                         │
│ Requires: role = "employee"    │
│ Requires: EmployeeGuard        │
└────────────────────────────────┘
                ↓

Level 3: ADMIN
┌────────────────────────────────┐
│ /admin                         │
│ /admin/users                   │
│ GET /api/users                 │
│ Requires: role = "admin"+      │
│ Requires: AdminGuard           │
└────────────────────────────────┘
                ↓

Level 4: SUPERADMIN
┌────────────────────────────────┐
│ /superadmin                    │
│ DELETE /api/users/:id          │
│ Requires: role = "superadmin"  │
│ Requires: SuperAdminGuard      │
└────────────────────────────────┘
```

---

## 💾 Data Flow Between Layers

```
┌──────────────┐
│   FIREBASE   │
│   (Auth)     │
└──────┬───────┘
       │ IDToken
       ↓
┌──────────────────────┐
│  BROWSER/FRONTEND    │
│  - localStorage      │
│  - AuthContext       │
│  - Axios Interceptor │
└──────┬───────────────┘
       │ Authorization: Bearer <IDToken>
       ↓
┌────────────────────────┐
│  EXPRESS SERVER        │
│  - authenticateFirebase│
│  - Middleware stack    │
│  - Controllers         │
└──────┬─────────────────┘
       │ Verify with Firebase Admin SDK
       ↓
┌──────────────────────┐
│   FIREBASE ADMIN SDK │
│   - verifyIdToken()  │
│   - Returns uid      │
└──────┬───────────────┘
       │ firebaseUid
       ↓
┌──────────────────────┐
│   MONGODB            │
│   - Find user by uid │
│   - Return user doc  │
└──────────────────────┘
```

---

## 🔐 Token Verification Process

```
CLIENT SENDS REQUEST
│
├─ Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc4YWE4OWE4...
│
↓ MIDDLEWARE: authenticateFirebase
│
├─ Extract token from header
│  └─ Split "Bearer " prefix
│
├─ Call admin.auth().verifyIdToken(token)
│  ├─ Fetch public key from Firebase
│  ├─ Verify JWT signature
│  ├─ Check expiration (exp claim)
│  ├─ Check issuer (iss claim)
│  └─ Extract payload
│
├─ Token Valid ✅
│  ├─ Get firebaseUid from payload
│  ├─ Query MongoDB: User.findOne({firebaseUid})
│  ├─ Attach req.firebaseUser = decodedToken
│  ├─ Attach req.dbUser = mongoUser
│  └─ Call next() → Continue to controller
│
└─ Token Invalid ❌
   ├─ Expired token
   ├─ Invalid signature
   ├─ Malformed token
   └─ Return 401 Unauthorized
```

---

## 📊 State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                  AUTHCONTEXT STATE                       │
└─────────────────────────────────────────────────────────┘

isLoading: boolean
├─ true → During login/logout/register
└─ false → Ready for user interaction

isAuthenticated: boolean
├─ true → User has valid token & profile
└─ false → User not logged in

user: AppUser | null
├─ { _id, firebaseUid, name, email, role, plan, ... }
└─ null when not authenticated

firebaseUser: FirebaseUser | null
├─ { uid, email, metadata, ... }
└─ null when not authenticated

error: string | null
├─ "Invalid credentials"
├─ "User not found"
└─ null when no error

Methods:
├─ login(email, password)
├─ register(email, password, name, lastName)
├─ logout()
├─ refreshToken()
└─ clearError()
```

---

## 🌐 Network Requests Summary

```
REQUEST TYPES:

1. UNAUTHENTICATED
   POST /auth/login
   POST /auth/register
   ├─ No Authorization header
   └─ Firebase handles auth

2. AUTHENTICATED (with Bearer Token)
   GET /api/users/me
   ├─ Authorization: Bearer <idToken>
   ├─ Axios interceptor adds header
   └─ Backend verifies with Firebase Admin SDK

3. ADMIN PROTECTED
   GET /api/users
   DELETE /api/users/:id
   ├─ Authorization: Bearer <idToken>
   ├─ Middleware verifies token
   ├─ Middleware checks role
   └─ Only admin+ can access

4. ERROR HANDLING
   401 Unauthorized
   ├─ Token missing or invalid
   ├─ Interceptor clears localStorage
   └─ Redirects to /auth/login

   403 Forbidden
   ├─ Token valid but role insufficient
   ├─ Interceptor redirects to /unauthorized
   └─ User can navigate back to dashboard
```

---

**Diagram Version**: 1.0 | Professional Authentication System Architecture
