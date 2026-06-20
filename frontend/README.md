# React + TypeScript + Vite

## Firebase Authentication & Authorization System

This application uses Firebase Authentication with Firestore for a complete SaaS-ready authentication system featuring:

### Features
- **Multi-tenant Architecture**: Organizations with isolated data
- **Role-Based Access Control**: Superadmin, Admin, Employee roles
- **Firebase Auth Integration**: Email/password authentication
- **Firestore Security Rules**: Granular permissions per collection
- **Real-time User Profiles**: Automatic profile synchronization

### User Roles
- **Superadmin**: Full system access, manages all organizations
- **Admin**: Manages users and data within their organization
- **Employee**: Read/write access to sales, products, customers

### Setup Instructions

1. **Create Superadmin User** (First-time setup):
   ```bash
   npm run create-superadmin admin@company.com password123
   ```

2. **Environment Variables** (`.env`):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

3. **Deploy Firestore Security Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Architecture Overview

```
Firebase Auth → AuthContext → Firestore Profiles
     ↓              ↓              ↓
   Login/Register → observeAuth → User Profiles
     ↓              ↓              ↓
   Role Guards → Organization → Data Access
```

### Collections Structure
- `users`: User profiles with roles and organization assignment
- `organizations`: Organization metadata and settings
- `products`, `customers`, `sales`, etc.: Business data (organization-scoped)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
