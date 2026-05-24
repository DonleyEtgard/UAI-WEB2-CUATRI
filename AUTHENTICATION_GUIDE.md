# Professional Authentication System - Complete Documentation

## 🏗️ Architecture Overview

Este sistema de autenticación profesional utiliza:
- **Firebase Authentication**: Manejo de login/register
- **MongoDB + Mongoose**: Almacenamiento de usuarios y roles
- **Firebase ID Tokens**: Sin JWT propio
- **React Context + Axios Interceptors**: Estado global
- **Role-Based Access Control (RBAC)**: Protección de rutas

### Flujo de Autenticación

```
1. Usuario entra a /auth/login
   ↓
2. AuthContext.login() llama a Firebase Auth
   ↓
3. Firebase retorna User + ID Token
   ↓
4. Se guarda token en localStorage
   ↓
5. AuthContext obtiene perfil del usuario de MongoDB
   ↓
6. Se guarda user en localStorage
   ↓
7. Axios interceptor añade token a headers
   ↓
8. Backend verifica token con Firebase Admin SDK
   ↓
9. Backend busca usuario en MongoDB
   ↓
10. Usuario autenticado y autorizado
```

---

## 📁 Estructura de Carpetas (Frontend)

```
frontend/src/
├── context/
│   └── AuthContext.tsx          ← Estado global de autenticación
├── firebase/
│   ├── auth.ts                  ← Funciones de Firebase Auth
│   └── config.ts                ← Configuración de Firebase
├── config/
│   └── api.ts                   ← Axios instance con interceptores
├── components/
│   ├── RoleGuard.tsx            ← Protección de rutas
│   └── auth/
│       └── LogoutExample.tsx    ← Ejemplo de logout
├── pages/
│   └── auth/
│       ├── LoginPage.tsx        ← Página de login
│       └── RegisterPage.tsx     ← Página de registro
├── router/
│   └── AppRouter.tsx            ← React Router v7 setup
├── types/
│   └── auth.ts                  ← TypeScript types
└── main.tsx                     ← Punto de entrada
```

---

## 📁 Estructura de Carpetas (Backend)

```
src/
├── middlewares/
│   ├── authenticateFirebase.ts      ← Verificación de tokens
│   ├── authorizeSuperadminOnly.ts   ← Control de roles
│   └── authorizeAdminOrSuperadmin.ts ← Control de roles
├── models/
│   └── User.ts                      ← Modelo Mongoose
├── routes/
│   ├── index.ts                     ← Rutas principales
│   └── user/
│       ├── index.ts                 ← Rutas de usuarios
│       └── controllers-auth.ts      ← Controladores
├── firebase.ts                      ← Configuración Firebase Admin
└── index.ts                         ← Servidor Express
```

---

## 🔒 Implementación del Frontend

### 1. Setup inicial (main.tsx)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@/context/AuthContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

### 2. App.tsx

```tsx
import AppRouter from "@/router/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
```

### 3. Usar AuthContext en componentes

```tsx
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) return <p>Not logged in</p>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 4. Proteger rutas

```tsx
import { RoleGuard, AdminGuard, SuperAdminGuard, AuthGuard } from "@/components/RoleGuard";

<Routes>
  {/* Solo usuario autenticado */}
  <Route
    path="/dashboard"
    element={
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    }
  />

  {/* Solo admin y superadmin */}
  <Route
    path="/admin"
    element={
      <AdminGuard>
        <AdminPanel />
      </AdminGuard>
    }
  />

  {/* Solo superadmin */}
  <Route
    path="/superadmin"
    element={
      <SuperAdminGuard>
        <SuperAdminPanel />
      </SuperAdminGuard>
    }
  />

  {/* Roles personalizados */}
  <Route
    path="/custom"
    element={
      <RoleGuard requiredRoles={["admin", "employee"]}>
        <CustomPage />
      </RoleGuard>
    }
  />
</Routes>
```

### 5. Logout

```tsx
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
```

### 6. Verificar roles en componentes

```tsx
import { useAuth, useHasRole, useHasAnyRole } from "@/context/AuthContext";

export function PermissionCheck() {
  const isSuperAdmin = useHasRole("superadmin");
  const isAdminOrSuper = useHasAnyRole(["admin", "superadmin"]);

  return (
    <>
      {isSuperAdmin && <p>Only SuperAdmin sees this</p>}
      {isAdminOrSuper && <p>Admin or SuperAdmin see this</p>}
    </>
  );
}
```

---

## 🔐 Implementación del Backend

### 1. Middleware de autenticación

```typescript
// En tus rutas:
import { authenticateFirebase } from "@/middlewares/authenticateFirebase";

router.get("/me", authenticateFirebase, getMeController);
```

### 2. Middleware de autorización

```typescript
import { authorizeSuperadminOnly } from "@/middlewares/authorizeSuperadminOnly";
import { authorizeAdminOrSuperadmin } from "@/middlewares/authorizeAdminOrSuperadmin";

// Solo superadmin
router.delete("/:id", authenticateFirebase, authorizeSuperadminOnly, deleteUserController);

// Admin o superadmin
router.get("/", authenticateFirebase, authorizeAdminOrSuperadmin, listUsersController);
```

### 3. Controladores

```typescript
// GET /api/users/me - Obtener perfil del usuario autenticado
export const getMeController = async (req: AuthRequest, res: Response) => {
  const user = await User.findOne({
    firebaseUid: req.firebaseUser?.uid,
  });
  return res.json({ success: true, data: { user } });
};

// POST /api/users/register - Registrar usuario en MongoDB
export const registerController = async (req: AuthRequest, res: Response) => {
  const { firebaseUid, email, name, lastName } = req.body;
  
  const newUser = new User({
    firebaseUid,
    email,
    name,
    lastName,
    role: "employee",
    // ... más campos
  });
  
  await newUser.save();
  return res.status(201).json({ success: true, data: { user: newUser } });
};
```

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/users/register    - Registrar usuario en MongoDB
GET    /api/users/me          - Obtener perfil del usuario autenticado
```

### Users (Admin/SuperAdmin)

```
GET    /api/users             - Listar todos los usuarios
GET    /api/users/:id         - Obtener usuario por ID
PATCH  /api/users/:id         - Actualizar usuario
DELETE /api/users/:id         - Eliminar usuario (soft delete)
```

---

## 📤 Request Headers

Todos los requests (excepto login/register) deben incluir:

```
Authorization: Bearer <Firebase ID Token>
```

El Axios interceptor lo añade automáticamente si existe token en localStorage.

---

## 🧪 Testing

### Test Login

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -d '{
    "firebaseUid": "user123",
    "email": "user@example.com",
    "name": "John",
    "lastName": "Doe"
  }'
```

### Test Get Me

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>"
```

---

## 📋 Checklist de Implementación

### Frontend

- [ ] Configurar variables de ambiente (VITE_FIREBASE_*)
- [ ] Crear AuthProvider en main.tsx
- [ ] Importar AuthProvider en App.tsx
- [ ] Crear rutas protegidas con RoleGuard
- [ ] Implementar componente de logout
- [ ] Probar login/register
- [ ] Verificar localStorage persiste sesión

### Backend

- [ ] Configurar Firebase Admin SDK
- [ ] Implementar middleware authenticateFirebase
- [ ] Implementar middlewares de autorización
- [ ] Crear controladores GET /api/users/me
- [ ] Crear controladores POST /api/users/register
- [ ] Actualizar User model con firebaseUid
- [ ] Probar endpoints con Postman

---

## 🔄 Flujo Completo de Login

### Frontend

1. Usuario entra email/password en LoginPage
2. onClick → `useAuth().login(email, password)`
3. AuthContext.login():
   - Llama `loginUser()` (Firebase Auth)
   - Obtiene `user.getIdToken()`
   - Guarda token en localStorage
   - Llama GET `/api/users/me`
   - Guarda user en localStorage
4. Axios interceptor añade token en headers
5. RoleGuard permite acceso

### Backend

1. Request llega con `Authorization: Bearer <token>`
2. Middleware `authenticateFirebase`:
   - Extrae token del header
   - Verifica con `admin.auth().verifyIdToken()`
   - Busca usuario en MongoDB
   - Adjunta `req.firebaseUser` y `req.dbUser`
3. Controlador procesa request
4. Response con datos del usuario

---

## 🚨 Errores Comunes

### Error: "No token provided"
- Verificar que localStorage tiene "firebaseToken"
- Verificar que Axios interceptor está configurado
- Verificar header Authorization

### Error: "Invalid or expired token"
- Token expiró (se renueva automáticamente en AuthContext)
- Firebase UID no coincide en MongoDB
- Configuración Firebase incorrecta

### Error: "User not found"
- Usuario no existe en MongoDB
- firebaseUid no coincide entre Firebase y MongoDB
- Ejecutar POST /api/users/register después del signup

---

## 📚 Recursos

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [React Router v7](https://reactrouter.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Express.js](https://expressjs.com/)
- [Axios](https://axios-http.com/)

---

## 💡 Mejoras Futuras

- [ ] Refresh token automático
- [ ] Two-factor authentication (2FA)
- [ ] OAuth con Google/GitHub
- [ ] Email verification
- [ ] Password reset flow
- [ ] Session timeout
- [ ] Audit logging
- [ ] Rate limiting mejorado

---

**Versión**: 1.0.0  
**Última actualización**: 2026-05-21  
**Autor**: Professional Auth System
