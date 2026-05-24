// @ts-nocheck
// ============================================================================
// PATH ALIAS CONFIGURATION - tsconfig.json (Frontend)
// ============================================================================

/**
 * Make sure your frontend tsconfig.json has these path aliases:
 * This allows you to use @/components instead of ../../../components
 */

/*
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
*/

/**
 * Also update your vite.config.ts:
 */

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
