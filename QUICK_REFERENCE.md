# Professional Authentication System - Quick Reference

## 🚀 Quick Setup (5 minutes)

```bash
# 1. Setup environment variables
cp .env.example .env.local  # frontend
cp .env.example .env        # backend

# 2. Fill in Firebase credentials and MongoDB URI

# 3. Update main.tsx
# Add: <AuthProvider><App /></AuthProvider>

# 4. Update App.tsx
# Add: import AppRouter from "@/router/AppRouter"; return <AppRouter />

# 5. Start development
npm run dev  # frontend
npm run dev  # backend
```

---

## 📦 Files Created/Modified

### Frontend (11 files)
```
✅ src/types/auth.ts
✅ src/firebase/auth.ts (modified)
✅ src/config/api.ts (modified)  
✅ src/context/AuthContext.tsx
✅ src/pages/auth/LoginPage.tsx (modified)
✅ src/pages/auth/RegisterPage.tsx (modified)
✅ src/pages/auth/index.ts
✅ src/components/RoleGuard.tsx
✅ src/router/AppRouter.tsx
✅ src/components/auth/LogoutExample.tsx
✅ src/main-example.tsx
```

### Backend (5 files)
```
✅ src/middlewares/authenticateFirebase.ts (modified)
✅ src/middlewares/authorizeSuperadminOnly.ts
✅ src/middlewares/authorizeAdminOrSuperadmin.ts
✅ src/routes/user/controllers-auth.ts
✅ src/routes/user/index.ts (modified)
```

### Documentation (4 files)
```
✅ AUTHENTICATION_GUIDE.md
✅ USAGE_EXAMPLES.md
✅ .env.example
✅ PATH_ALIAS_CONFIG.ts
```

---

## 🔑 Key Hooks & Components

### Hooks
```tsx
// Get auth state & methods
const { user, isAuthenticated, isLoading, error, login, logout, register } = useAuth();

// Check roles
const isSuperAdmin = useHasRole("superadmin");
const isAdmin = useHasAnyRole(["admin", "superadmin"]);
const hasAll = useHasAllRoles(["admin", "employee"]);

// Clear errors
const { clearError } = useAuth();
```

### Components
```tsx
// Route Guards
<AuthGuard><Dashboard /></AuthGuard>
<AdminGuard><AdminPanel /></AdminGuard>
<SuperAdminGuard><SuperAdminPanel /></SuperAdminGuard>
<RoleGuard requiredRoles={["admin", "employee"]}><Page /></RoleGuard>
```

---

## 🔗 API Endpoints

```
POST   /api/users/register     - Register user in MongoDB
GET    /api/users/me           - Get current user profile
GET    /api/users              - List all users (admin only)
GET    /api/users/:id          - Get user by ID (admin only)
PATCH  /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user (superadmin only)
```

---

## 🎯 Common Patterns

### 1. Login Form
```tsx
const { login, isLoading, error } = useAuth();
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(email, password);
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  }
};
```

### 2. Protected Route
```tsx
<Route
  path="/admin"
  element={
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  }
/>
```

### 3. Conditional Rendering
```tsx
const { user } = useAuth();
{user?.role === "superadmin" && <SuperAdminPanel />}
{["admin", "superadmin"].includes(user?.role) && <AdminPanel />}
```

### 4. API Call
```tsx
const response = await apiClient.get("/users");
// Token added automatically by interceptor
```

### 5. Logout
```tsx
const { logout } = useAuth();
const handleLogout = async () => {
  await logout();
  navigate("/auth/login");
};
```

---

## 🔒 Middleware Usage

### Frontend - Routes
```tsx
// Requires authentication
<Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />

// Requires admin role
<Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />

// Requires superadmin role
<Route path="/superadmin" element={<SuperAdminGuard><SuperAdmin /></SuperAdminGuard>} />
```

### Backend - Routes
```typescript
// Any authenticated user
router.get("/me", authenticateFirebase, getMeController);

// Admin/SuperAdmin only
router.get("/", authenticateFirebase, authorizeAdminOrSuperadmin, listUsersController);

// SuperAdmin only
router.delete("/:id", authenticateFirebase, authorizeSuperadminOnly, deleteUserController);
```

---

## 📊 Auth Flow Diagram

```
Login → Firebase Auth → Get ID Token → Store in localStorage
         ↓                                ↓
    Get User Profile → Store user in localStorage
         ↓
    Set isAuthenticated = true
         ↓
    Axios Interceptor adds Bearer token to all requests
         ↓
    Backend verifies token with Firebase Admin SDK
         ↓
    Backend finds user in MongoDB
         ↓
    Response with user data
```

---

## 🧪 Testing Checklist

```
[ ] Register new user
[ ] Login with valid credentials
[ ] Token stored in localStorage
[ ] Token added to API requests
[ ] Protected routes show correct content
[ ] Non-admin can't access admin routes
[ ] Non-superadmin can't access superadmin routes
[ ] Logout clears localStorage
[ ] Logout redirects to login
[ ] Session persists on page refresh
[ ] Expired token redirects to login
```

---

## 🐛 Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| "No token provided" | Missing Bearer token | Check localStorage, verify interceptor |
| "Invalid token" | Token expired or malformed | Re-login, check Firebase config |
| "User not found" | No user in MongoDB | Register in DB after Firebase signup |
| "Access denied" | Insufficient role | Check user role in MongoDB |
| "VITE_FIREBASE undefined" | Missing .env.local | Create .env.local with Firebase creds |

---

## 💾 Data Structures

### User Object
```typescript
{
  _id: string;
  firebaseUid: string;
  name: string;
  lastName: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  plan: "free" | "basic" | "active" | "suspended";
  isVerified: boolean;
  isActive: boolean;
  address: {
    street?: string;
    city?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Auth Context
```typescript
{
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email, password) => Promise<void>;
  register: (email, password, name, lastName) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}
```

---

## 🎨 UI Components Setup

### Login Page
- Location: `src/pages/auth/LoginPage.tsx`
- Dark theme with Tailwind CSS
- Email, password, demo login button

### Register Page
- Location: `src/pages/auth/RegisterPage.tsx`
- Form validation
- Password confirmation
- Terms & conditions ready

### Logout
- Location: `src/components/auth/LogoutExample.tsx`
- Button example
- User menu example

---

## 🔄 Token Management

### Automatic Token Refresh
AuthContext automatically calls `getIdToken(firebaseUser, true)` to refresh token before expiry.

### Manual Token Refresh
```tsx
const { refreshToken } = useAuth();
await refreshToken();
```

### Token Location
- Stored in: `localStorage.getItem("firebaseToken")`
- Used in: `Authorization: Bearer <token>` header
- Added by: Axios interceptor

---

## 📱 Mobile/Responsive

All components are fully responsive with Tailwind CSS:
- Mobile-first design
- Flex layouts
- Responsive text sizes
- Touch-friendly buttons

---

## ⚡ Performance

- Lazy loading routes with React.lazy()
- Axios request caching
- Token caching in memory
- Debounced API calls
- Memoized context values

---

## 🚀 Deployment Checklist

```
[ ] Firebase credentials in production env vars
[ ] MongoDB Atlas connection string in .env
[ ] CORS properly configured
[ ] HTTPS enabled
[ ] Rate limiting on auth endpoints
[ ] Error logs configured
[ ] Monitoring/alerting set up
[ ] Backup strategy in place
[ ] Load testing completed
```

---

## 📞 Common Issues & Solutions

### "CORS Error"
```typescript
// In Express server
import cors from 'cors';
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### "Token Always Undefined"
```tsx
// Make sure AuthProvider wraps App
<AuthProvider>
  <App />
</AuthProvider>
```

### "Axios Interceptor Not Working"
```tsx
// Check import in components
import { apiClient } from "@/config/api";
// Not: import axios from "axios"
```

### "Role Check Not Working"
```tsx
// Use useAuth() hook inside component
// Not at module level
const { user } = useAuth();
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Global auth state management |
| `LoginPage.tsx` | Login UI form |
| `RegisterPage.tsx` | Register UI form |
| `RoleGuard.tsx` | Route protection components |
| `authenticateFirebase.ts` | Firebase token verification |
| `controllers-auth.ts` | User CRUD operations |

---

## 🎓 Learning Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [React Router v7](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Express.js](https://expressjs.com/)

---

**Version**: 1.0.0 | **Last Updated**: 2026-05-21

For detailed guide, see: `AUTHENTICATION_GUIDE.md`  
For examples, see: `USAGE_EXAMPLES.md`  
For checklist, see: `IMPLEMENTATION_CHECKLIST.md`
