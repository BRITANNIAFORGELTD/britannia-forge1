# Britannia Forge - Vercel Deployment Fix

## Issue Summary
The deployment is failing with path resolution error:
```
[vite]: Rollup failed to resolve import "@/components/ui/toaster" from "/vercel/path0/client/src/App.tsx"
```

## Root Cause
The `client/vite.config.ts` file uses `process.cwd()` which doesn't work correctly in Vercel's build environment when using `cd client && npx vite build`.

## Solution
Replace the `client/vite.config.ts` file with the corrected version below.

## File to Update: `client/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@shared': path.resolve('../shared')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    host: true
  }
})
```

## Alternative Configuration (if above doesn't work)

If path resolution still fails, use this more explicit version:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    host: true
  }
})
```

## Verification
After updating this file:
1. Commit and push to GitHub
2. Redeploy from Vercel dashboard
3. Both projects should build successfully
4. The build should transform 1800+ modules instead of just 4

## Expected Result
- Build will complete successfully
- Website will load without 404 errors
- All navigation will work properly