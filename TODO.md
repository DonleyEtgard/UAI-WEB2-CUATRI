# TODO

## Fix "useAuth must be used within an AuthProvider" on /login and /register

- [ ] Identify mismatch between AuthContext imports (frontend/src/context/AuthContext.tsx vs frontend/src/features/auth/AuthContext.tsx)
- [ ] Update pages/components that import the wrong AuthContext so they all use the same AuthProvider (the one actually mounted in frontend/src/main.tsx)
- [ ] Verify router paths used in RoleGuard redirects (/auth/login vs /login) are consistent (optional)
- [ ] Run frontend dev build/tests (npm run dev / npm run build) and confirm no runtime error

