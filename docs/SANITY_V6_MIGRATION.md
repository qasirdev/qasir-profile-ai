# Sanity Studio v6 Migration Checklist

## ✅ Updated Files for Sanity v6 (June 2026)

### 1. Package Dependencies
- ✅ **package.json**: Updated `sanity` from `^3.99.0` to `^6.0.0`
- ✅ **next-sanity** upgraded to `^13.1.1` (Next.js 16 peer dependency compatible)
- ✅ Kept `@sanity/client` at `^7.23.0` (latest)
- ✅ Kept `styled-components` at `^6.4.3` (required peer dependency)

### 2. Configuration Files
- ✅ **sanity.config.ts**: Added `'use client'` directive (required for v6)
- ✅ Using `structureTool()` plugin
- ✅ Configured `basePath: "/studio"` for embedded Studio

### 3. API Client
- ✅ **src/sanity/lib/client.ts**: Updated API version from `2024-01-01` to `2026-06-01`
- ✅ Using `next-sanity` createClient with proper caching
- ✅ Graceful fallback when project ID is missing

### 4. Studio Embedding
- ✅ **src/app/studio/[[...tool]]/page.tsx**: Using `NextStudio` component
- ✅ Catch-all route `[[...tool]]` for Studio routing
- ✅ Marked as client component with `'use client'`

## 🎯 Sanity v6 Features

### What's New in v6 (Released June 11, 2026)
- ⚡ **Vite 8**: 2-9× faster builds
- 🚀 **React Strict Mode**: Enabled by default
- 📦 **Better Tree Shaking**: Smaller bundle sizes
- 🔧 **Node.js 22.12+**: Minimum version requirement
- 🎨 **Improved Studio Performance**: Faster editing experience

### Available Features (Free Tier)
- ✅ Tasks & Comments
- ✅ Content Releases
- ✅ Version Comparison
- ✅ Copy & Paste Fields
- ✅ Media Library
- ✅ Content Agent

## 📋 Installation Steps

### For New Setup
```bash
# Install dependencies (already done)
npm install

# Set environment variables in .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-01

# Start development
npm run dev

# Access Studio
http://localhost:3000/studio
```

### For Upgrading Existing Project
```bash
# Update Sanity to v6
npm install sanity@latest

# Update peer dependencies if needed
npm install styled-components@latest

# Rebuild
npm run build
```

## ⚠️ Breaking Changes from v3 to v6

### Node.js Version
- **Old**: Node.js 20+
- **New**: Node.js 22.12+ (REQUIRED)
- **Action**: Upgrade Node.js if needed

### React Strict Mode
- **New**: Enabled by default in v6
- **Impact**: Catches potential issues in development
- **Action**: None required (improves code quality)

### API Version
- **Old**: `2024-01-01`
- **New**: `2026-06-01`
- **Action**: ✅ Already updated in client.ts

### `'use client'` Directive
- **Required**: Must be added to `sanity.config.ts`
- **Reason**: Sanity Studio is a client-side React app
- **Action**: ✅ Already added

## 🔍 Verification Steps

To verify everything is working:

```bash
# 1. Check Sanity version
npm list sanity
# Should show: sanity@6.x.x

# 2. Check build succeeds
npm run build
# Should complete without errors

# 3. Start dev server
npm run dev

# 4. Access Studio
# Navigate to http://localhost:3000/studio
# Should load Sanity Studio v6 interface
```

## 🌐 CORS Configuration

**IMPORTANT**: Add CORS origins at [sanity.io/manage](https://www.sanity.io/manage):

1. **Local Development**:
   - Origin: `http://localhost:3000`
   - Allow credentials: ✅ ON

2. **Production**:
   - Origin: `https://qasir.co.uk`
   - Allow credentials: ✅ ON

Without CORS, Studio will show authentication errors!

## 📚 Documentation References

- [Sanity v6 Release Notes](https://www.sanity.io/docs/changelog/studio-NS4zMS4w)
- [Sanity v6 Blog Post](https://www.sanity.io/blog/sanity-studio-v6)
- [Embedding Studio in Next.js](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs)
- [Next.js + Sanity Integration](https://www.sanity.io/docs/nextjs/introduction)
- [Sanity User Guides](https://www.sanity.io/docs/user-guides)

## ✨ Ready to Go!

All files are now updated for **Sanity Studio v6** with 2026 best practices!

🚀 Start creating amazing blog content at `https://qasir.co.uk/studio`

---

*Last Updated: June 25, 2026*
*Sanity Studio Version: v6.0.0*
*Next.js Version: 16.2.6*
