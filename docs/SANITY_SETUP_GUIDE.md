# Sanity CMS Setup Guide for Beginners

## Complete Step-by-Step Guide to Add Blogs to Your Personal Website

This guide will walk you through setting up **Sanity Studio v6** (latest 2026 release) for your blog posts on `qasir.co.uk`. No prior CMS experience required!

> **Latest Update**: This guide uses Sanity Studio v6 (released June 11, 2026) with Vite 8 and the latest Next.js 16 integration.

---

## Table of Contents

1. [What is Sanity CMS?](#what-is-sanity-cms)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create a Sanity Account](#step-1-create-a-sanity-account)
4. [Step 2: Create a New Sanity Project](#step-2-create-a-new-sanity-project)
5. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
6. [Step 4: Configure CORS Settings](#step-4-configure-cors-settings)
7. [Step 5: Deploy Sanity Studio](#step-5-deploy-sanity-studio)
8. [Step 6: Create Your First Blog Post](#step-6-create-your-first-blog-post)
9. [Step 7: Test Locally](#step-7-test-locally)
10. [Step 8: Deploy to Vercel](#step-8-deploy-to-vercel)
11. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
12. [Adding Images to Blog Posts](#adding-images-to-blog-posts)
13. [SEO Best Practices](#seo-best-practices)
14. [Advanced Features](#advanced-features)

---

## What is Sanity CMS?

**Sanity Studio v6** is a modern headless CMS (Content Management System) that lets you create, edit, and manage blog posts through a visual interface without touching code. Your content is stored in the cloud and fetched by your Next.js website.

**Why Sanity?**
- 🆓 **Free tier**: 3 users, 500k API requests/month, 10GB bandwidth
- ⚡ **Vite 8**: 2-9× faster builds with the latest v6 release
- ✨ **Beautiful editing experience**: Rich text editor, image uploads, live preview
- 🚀 **Production-ready**: Used by Nike, Figma, Shopify
- 🔒 **Secure**: Built-in authentication and access control
- 🎯 **Modern**: Tasks, Comments, Content Releases (2026 features)

---

## Prerequisites

Before starting, make sure you have:
- ✅ A GitHub account (for version control)
- ✅ A Vercel account (for deployment)
- ✅ **Node.js v22.12 or newer** (required for Sanity v6)
- ✅ npm v7+ (comes with Node.js)
- ✅ Your project code (already set up)

> **Important**: Sanity Studio v6 requires Node.js 22.12+. Check your version: `node --version`

---

## Step 1: Create a Sanity Account

### 1.1 Sign Up for Sanity

1. Go to [sanity.io](https://www.sanity.io/)
2. Click **"Get Started Free"** in the top right
3. Sign up using one of these methods:
   - **GitHub** (recommended - fastest)
   - Google
   - Email/Password

![Sanity Sign Up](https://www.sanity.io/static/images/opengraph/social.png)

### 1.2 Verify Your Email

If you signed up with email, check your inbox for a verification email from Sanity.

---

## Step 2: Create a New Sanity Project

### 2.1 Check Node.js Version

First, verify you have Node.js 22.12 or newer:

```bash
node --version
```

If you see v22.12 or higher, you're good! Otherwise, [download the latest Node.js](https://nodejs.org/).

### 2.2 Initialize Sanity in Your Project

Navigate to your project folder:

```bash
cd /Users/qasirmehmood/Projects/qasir-proflle-2026/qasir-profile-auto1/qasir-profile
```

Run the **latest Sanity v6 initialization** command:

```bash
npx sanity@latest init
```

> **Note**: This is the new 2026 method. The old `npm install -g @sanity/cli` is no longer needed.

You'll be asked several questions:

**Question 1:** "Select project to use"
- Choose: **"Create new project"**

**Question 2:** "Your project name:"
- Enter: `qasir-profile-blog` (or any name you prefer)

**Question 3:** "Use the default dataset configuration?"
- Choose: **Yes** (this creates a "production" dataset)

**Question 4:** "Project output path:"
- Just press **Enter** (current directory)

**Question 5:** "Would you like to add configuration files for a Sanity project?"
- Choose: **Yes**

✅ **Success!** You should see:
```
✔ Bootstrapping files from template
✔ Resolving packages
✔ Installed dependencies

Success! Now what?

- Run "npm run dev" to start your Studio
- Your Project ID: abc12345
```

**⚠️ IMPORTANT**: Copy your **Project ID** from the terminal - you'll need it in the next step!

---

## Step 3: Configure Environment Variables

### 3.1 Create `.env.local` File

In your project root, create a file named `.env.local`:

```bash
touch .env.local
```

### 3.2 Add Your Sanity Credentials

Open `.env.local` and add the following (replace `YOUR_PROJECT_ID` with the ID from Step 2.2):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-01
```

Example:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-01
```

> **Note**: API version updated to `2026-06-01` for Sanity v6 compatibility.

### 3.3 Create an API Token (Optional - for draft previews)

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project (`qasir-profile-blog`)
3. Go to **API** → **Tokens**
4. Click **"Add API token"**
5. Set:
   - **Label**: `Next.js Preview Token`
   - **Permissions**: **Editor**
6. Click **"Save"**
7. Copy the token and add it to `.env.local`:

```env
SANITY_API_TOKEN=your_token_here
```

---

## Step 4: Configure CORS Settings

### 4.1 Why CORS is Important

When Sanity Studio runs in your browser, it needs permission to communicate with Sanity's API. This is done through CORS (Cross-Origin Resource Sharing) settings.

### 4.2 Add CORS Origins

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project (`qasir-profile-blog`)
3. Go to **API** → **CORS origins**
4. Click **"Add CORS origin"**

Add these two origins:

**For Local Development:**
- Origin: `http://localhost:3000`
- **Toggle "Allow credentials"** to **ON**
- Click **"Save"**

**For Production (after deployment):**
- Origin: `https://qasir.co.uk`
- **Toggle "Allow credentials"** to **ON**
- Click **"Save"**

✅ You should now have 2 CORS origins configured.

> **Important**: Without CORS configuration, you'll see authentication errors in Sanity Studio.

---

## Step 5: Deploy Sanity Studio

### 4.1 Start Development Server

Run your Next.js development server:

```bash
npm run dev
```

### 5.2 Access Sanity Studio

Open your browser and go to:

```
http://localhost:3000/studio
```

You should see the **Sanity Studio v6** login screen with the new Vite 8-powered interface!

### 5.3 Login to Studio

Click **"Sign in"** and use the same credentials you used to create your Sanity account (GitHub, Google, or Email).

🎉 **Success!** You're now in Sanity Studio v6, where you'll create and manage blog posts.

---

## Step 6: Create Your First Blog Post

### 5.1 Create an Author

Before creating blog posts, you need to create an author profile:

1. In Sanity Studio, click **"Author"** in the left sidebar
2. Click **"+ Create"** button
3. Fill in:
   - **Name**: `Qasir Mehmood`
   - **Slug**: Click **"Generate"** (it will create `qasir-mehmood`)
   - **Role**: `Senior Full-Stack Developer`
   - **Image**: Upload your profile photo (optional)
   - **Bio**: Write a short bio about yourself
   - **Social Links**: Add your LinkedIn, GitHub, Twitter (optional)
4. Click **"Publish"** in the bottom right

### 6.2 Create a Category

1. Click **"Category"** in the left sidebar
2. Click **"+ Create"**
3. Fill in:
   - **Title**: `React`
   - **Slug**: Click **"Generate"**
   - **Description**: `Articles about React and Next.js`
   - **Badge Color**: Choose `purple`
4. Click **"Publish"**

**Repeat** to create more categories:
- `Python` (green)
- `Cloud` (blue)
- `AI/ML` (cyan)
- `DevOps` (orange)

### 6.3 Create Your First Blog Post

1. Click **"Blog Post"** in the left sidebar
2. Click **"+ Create"**
3. Fill in the form:

#### Basic Information
- **Title**: `React Code Splitting: A Complete Guide`
- **Slug**: Click **"Generate"** → `react-code-splitting-a-complete-guide`
- **Excerpt**: 
  ```
  Learn how to optimize your React applications with code splitting techniques. Includes real production examples and performance benchmarks.
  ```

#### Content
- **Main Image**: 
  - Click **"Upload"** and select an image (1200x630px recommended)
  - **Alt Text**: `React code splitting diagram`

- **Categories**: Select `React`

- **Author**: Select `Qasir Mehmood`

- **Published at**: Select today's date and time

- **Read Time**: Enter `8` (minutes)

#### Blog Content (Body)
Click in the **Body** field and start writing. Use the toolbar to:
- **Add headings** (H1, H2, H3)
- **Format text** (bold, italic, code)
- **Add lists** (bullet points, numbered)
- **Insert images**
- **Add code blocks**
- **Insert links**

Example content structure:

```markdown
## Introduction

React code splitting is a powerful technique for optimizing your application's performance...

## What is Code Splitting?

Code splitting allows you to split your bundle into smaller chunks...

## Implementation

Here's how to implement dynamic imports:

[Add code block here]

## Conclusion

By implementing code splitting, you can significantly improve...
```

#### SEO (Optional but Recommended)
Scroll down to the **SEO** section:
- **Meta Title**: Leave empty (will use post title)
- **Meta Description**: Leave empty (will use excerpt)
- **Keywords**: Add tags like: `react`, `code-splitting`, `performance`, `optimization`

#### Featured Post
- Toggle **"Featured Post"** to **ON** if you want this to appear in the featured section

4. Click **"Publish"** in the bottom right

🎉 **Congratulations!** You've created your first blog post!

---

## Step 7: Test Locally

### 7.1 View Your Blog Listing

Go to:
```
http://localhost:3000/blogs
```

You should see your blog post appearing in a beautiful card with:
- The main image
- Title and excerpt
- Category badge
- Author info
- Read time

### 7.2 View Your Blog Post

Click on the blog post card. You should see:
- Full blog post with your content
- Formatted headings, images, code blocks
- Author section
- Related posts (if you create more posts)

### 7.3 Test Dark Mode

Click the moon/sun icon in the navigation to test dark mode. All components should look perfect in both themes!

---

## Step 8: Deploy to Vercel

### 8.1 Add Environment Variables to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project (`qasir-profile-auto1`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable from your `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `your_project_id`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2026-06-01`
   - `SANITY_API_TOKEN` = `your_token` (optional)
5. Click **"Save"**

### 8.2 Deploy with Git

Commit your changes:

```bash
git add .
git commit -m "Add Sanity CMS blog system"
git push
```

Vercel will automatically detect the changes and deploy your site!

### 8.3 Access Your Live Blog

Once deployed, visit:
```
https://qasir.co.uk/blogs
https://qasir.co.uk/blogs/react-code-splitting-a-complete-guide
```

🎉 **Your blog is now live!**

---

## Common Issues & Troubleshooting

### Issue 1: "Project ID not found"

**Problem**: The blog page shows an error about missing project ID.

**Solution**:
1. Check your `.env.local` file has the correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
2. Restart your dev server: `npm run dev`

### Issue 2: "Cannot access Studio"

**Problem**: `http://localhost:3000/studio` shows 404

**Solution**:
1. Check that `src/app/studio/[[...tool]]/page.tsx` exists
2. Clear `.next` folder: `rm -rf .next`
3. Restart dev server

### Issue 3: "Images not loading"

**Problem**: Blog post images show broken or don't load

**Solution**:
1. Check image was uploaded successfully in Sanity Studio
2. Add alternative text to all images
3. Clear browser cache

### Issue 4: "No blog posts showing"

**Problem**: The `/blogs` page is empty

**Solution**:
1. Go to Sanity Studio
2. Make sure you clicked **"Publish"** (not just saved draft)
3. Check that the author was created and published
4. Refresh the page

---

## Adding Images to Blog Posts

### Best Practices for Images

1. **Main Image** (Blog card thumbnail):
   - Recommended size: **1200 x 630 pixels**
   - Format: JPG or PNG
   - File size: Under 500KB
   - Always add alt text for accessibility

2. **Body Images** (In the blog content):
   - Click the **image icon** in the editor toolbar
   - Upload image
   - Add **alt text** (required)
   - Add **caption** (optional, appears below image)

3. **Optimization Tips**:
   - Use [TinyPNG](https://tinypng.com/) to compress images before uploading
   - Use descriptive filenames: `react-code-splitting-diagram.png` instead of `IMG_001.png`
   - Add alt text for SEO and accessibility

---

## SEO Best Practices

### Optimizing Blog Posts for Search Engines

1. **Title** (H1):
   - Keep it under 60 characters
   - Include primary keyword
   - Make it compelling

2. **Excerpt**:
   - 150-160 characters
   - Include keywords naturally
   - Write for humans, not robots

3. **URL Slug**:
   - Use lowercase
   - Separate words with hyphens
   - Include primary keyword
   - Example: `react-code-splitting-guide` (good) vs `post-1` (bad)

4. **Keywords**:
   - Add 5-10 relevant keywords
   - Mix primary and secondary keywords
   - Use tools like [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/)

5. **Content Structure**:
   - Use H2, H3 headings to organize content
   - Keep paragraphs short (2-4 sentences)
   - Add code examples where relevant
   - Include internal links to other blog posts

---

## Next Steps

### Publishing More Content

To migrate your existing Medium articles:

1. Copy the content from Medium
2. Create a new blog post in Sanity Studio
3. Paste and format the content
4. Add images
5. Update the published date to match the original
6. Publish!

### Custom Domain Setup

Your blog is already accessible at:
- `https://qasir.co.uk/blogs` (blog listing)
- `https://qasir.co.uk/blogs/[slug]` (individual posts)

No additional domain setup needed! 🎉

### Analytics

To track blog performance, you can add:
- **Google Analytics 4** (already integrated in your site)
- **Microsoft Clarity** (already integrated)

---

## Advanced Features

### New in Sanity v6 (2026)

Sanity Studio v6 introduces several powerful features for content teams:

#### 1. **Tasks** ([Documentation](https://www.sanity.io/docs/studio/tasks))
- Assign content creation and editing tasks to team members
- Set due dates and track progress
- Get notifications when tasks are completed

#### 2. **Comments** ([Documentation](https://www.sanity.io/docs/studio/comments))
- Leave comments on documents and specific fields
- Tag team members for collaboration
- Resolve discussions with threaded replies

#### 3. **Content Releases** ([Documentation](https://www.sanity.io/docs/user-guides/content-releases))
- Bundle multiple content changes together
- Schedule releases for future publication
- Coordinate launches across multiple documents

#### 4. **Document Version Comparison** ([Documentation](https://www.sanity.io/docs/studio/compare-document-versions))
- View side-by-side comparisons of document versions
- See what changed between drafts and published versions
- Roll back to previous versions if needed

#### 5. **Copy and Paste Fields** ([Documentation](https://www.sanity.io/docs/user-guides/field-copy-and-paste))
- Copy field values between documents
- Paste structured content across different schemas
- Speed up repetitive content entry

### Using These Features

To enable these features in your blog:

1. Go to Sanity Studio (`/studio`)
2. Click your user icon in the top right
3. Go to **Settings**
4. Enable the features you want to use

These are all **free** on the Sanity free tier! 🎉

---

## Support & Resources

### Official Documentation (2026)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity User Guides](https://www.sanity.io/docs/user-guides)
- [Embedding Studio in Next.js](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs)
- [Next.js + Sanity Integration](https://www.sanity.io/docs/nextjs/introduction)
- [Sanity Studio v6 Release Notes](https://www.sanity.io/docs/changelog/studio-NS4zMS4w)

### Sanity Community
- [Sanity Slack Community](https://slack.sanity.io/)
- [Sanity Community Forum](https://www.sanity.io/community)

### Video Tutorials
- [Sanity + Next.js Guide](https://www.youtube.com/watch?v=OcTPaUfay5I)
- [Portable Text Guide](https://www.youtube.com/watch?v=MoPU6dDWQwg)

---

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Access Sanity Studio v6
http://localhost:3000/studio

# Build for production
npm run build

# Deploy to Vercel (automatic via Git)
git push

# Upgrade Sanity to latest version
npm install sanity@latest

# View Sanity projects (requires @sanity/cli)
npx sanity@latest projects list

# View Sanity datasets
npx sanity@latest datasets list

# Backup dataset (export)
npx sanity@latest dataset export production backup.tar.gz

# Restore dataset (import)
npx sanity@latest dataset import backup.tar.gz production

# Check Sanity version
npm list sanity
```

---

## Congratulations! 🎉

You've successfully set up a production-grade blog system with **Sanity Studio v6 (2026)** for your personal website! Your blog posts will now be:

- ✅ Beautifully styled with your website's glassmorphic design
- ✅ Fully responsive on all devices
- ✅ SEO-optimized with proper meta tags
- ✅ Accessible with WCAG compliance
- ✅ Fast with Next.js static generation
- ✅ Easy to manage with Sanity Studio v6
- ✅ **Blazing fast** with Vite 8 (2-9× faster builds!)
- ✅ **Collaborative** with Tasks, Comments, and Content Releases

**Happy blogging!** 🚀

---

*Last updated: June 25, 2026 for Sanity Studio v6*

*Need help? Check the [latest Sanity documentation](https://www.sanity.io/docs/user-guides) or reach out to the Sanity community.*
