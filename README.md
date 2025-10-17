# CoHub - Beautiful Nested Comment System

A modern, feature-rich nested comment system built with Next.js 15, TypeScript, Clerk authentication, and stunning Framer Motion animations. Experience Reddit-style nested discussions with an elegant, responsive UI.

## ✨ Features

- 🔐 **Authentication**: Seamless Clerk integration with modal sign-in/sign-up
- 💬 **Nested Comments**: Reddit-style nested threading with "Continue thread" UI (max 3 levels)
- 👍 **Upvote System**: Toggle upvotes with smooth animations
- 🔄 **Sorting Options**: Sort by newest, oldest, or most upvoted
- 🎨 **Smooth Animations**: Framer Motion powered micro-interactions and transitions
- 👤 **User Profiles**: View user details, avatar, join date, and all their posts
- ✍️ **Rich Post Creation**: Create posts with titles, content, and optional cover images
- 🎯 **Admin Features**: Admin users can delete any post/comment with permission checks
- 📱 **Fully Responsive**: Mobile-first design with horizontal scroll protection
- 🌓 **Dark Mode**: Beautiful dark/light theme with next-themes
- 🚀 **Optimized Performance**: Lazy-loading replies, user caching, and efficient rendering
- 🎭 **Beautiful Hero**: Animated landing page with infinite slider and blur effects

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create `.env` file in the root directory:

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com

# Clerk Authentication (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Setup Clerk Webhook (Backend)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/) → Webhooks
2. Add endpoint: `https://your-backend-url.com/clerk-webhook`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to your backend `.env` as `CLERK_WEBHOOK_SECRET`

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 Key Features in Detail

### 🏠 Landing Page

- Beautiful animated hero section with call-to-action buttons
- Infinite slider showcasing powered-by logos
- Progressive blur effects for polished design
- Responsive layout for all screen sizes

### 📝 Post System

- **Create Posts**: Rich text editor with title, body, and optional image URL
- **Post Feed**: Grid layout displaying recent posts with author info and comment counts
- **Post Details**: Full post view with cover image, author details, and nested comments
- **User Posts**: Profile page showing all posts by a specific user

### 💬 Advanced Comment System

- **Nested Threading**: Up to 3 levels of nesting with visual hierarchy
- **Continue Thread**: Reddit-style "Continue thread" button at max depth
- **Lazy Loading**: Replies load on demand to optimize performance
- **Real-time Upvotes**: Animated upvote button with instant feedback
- **Reply Count**: Shows total nested reply count for each comment
- **Sorting**: Sort comments by newest, oldest, or most upvoted
- **Delete Protection**: Only owners and admins can delete comments

### 👤 User System

- **Auto-sync**: Clerk users automatically sync to backend database
- **User Cache**: Efficient caching system for user data
- **Profile Page**: View user avatar, email, join date, and post count
- **Admin Badge**: Visual indicator for admin users

### 🎨 UI/UX Excellence

- **Framer Motion**: Smooth animations for comments, posts, and interactions
- **Scroll Areas**: Radix UI scroll areas with horizontal overflow protection
- **Skeleton Loaders**: Polished loading states for better UX
- **Dropdown Menus**: Context menus for comment actions
- **Responsive Header**: Fixed header with scroll effects and mobile menu
- **Theme Switcher**: Fixed bottom-right theme toggle button

## 📁 Project Structure

```
app/
  page.tsx             # Landing hero page
  layout.tsx           # Root layout with Clerk & theme providers
  globals.css          # Global styles (Tailwind v4)
  (main)/              # Main app routes
    layout.tsx         # Inner layout with footer
    recent-posts/      # Post feed page
    post/[id]/         # Individual post detail page
    profile/           # User profile page
    create-post/       # New post creation page
  sign-in/             # Clerk sign-in page
  sign-up/             # Clerk sign-up page
components/
  header.tsx           # Animated header with navigation
  hero-section.tsx     # Landing page hero
  theme-switcher.tsx   # Dark/light mode toggle
  comments/
    CommentList.tsx    # Main comment list with sorting
    Comment.tsx        # Individual comment with nested replies
    CommentForm.tsx    # Comment/reply form
  post/
    PostCard.tsx       # Post card component
    PostCardSkeleton.tsx  # Loading skeleton
  ui/                  # Shadcn components
lib/
  api.ts               # API client with backend integration
  types.ts             # TypeScript type definitions
  userCache.ts         # User data caching utility
  date-utils.ts        # Date formatting helpers
  hooks/
    useUserSync.ts     # Clerk ↔ Backend sync hook
```

## 🔧 Tech Stack

### Core

- **Next.js 15**: App Router with Turbopack for blazing fast development
- **React 19**: Latest React features
- **TypeScript 5**: Type-safe development

### Authentication

- **Clerk**: Complete user authentication with webhooks
- **Clerk Themes**: Styled authentication UI

### Styling

- **Tailwind CSS v4**: Latest Tailwind with CSS-first configuration
- **Shadcn UI**: Beautiful, accessible component library
- **Radix UI**: Unstyled, accessible primitives
- **next-themes**: Dark/light mode theming

### Animation

- **Framer Motion 12**: Advanced animations and micro-interactions
- **GSAP 3**: Professional animation library

### UI Components

- **Lucide React**: Modern icon library
- **Geist Font**: Beautiful typography
- **CVA**: Class variance authority for component variants

### Development

- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **tw-animate-css**: Additional Tailwind animations

## 🎨 Making a User Admin

To grant admin privileges:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Users** → Select the user
3. Go to **Metadata** tab → **Public metadata**
4. Add the following JSON:

```json
{
  "role": "admin"
}
```

5. The role will sync to the backend via webhook
6. Admin users can now delete any post/comment and see admin badges

## 🐛 Troubleshooting

### User not syncing to backend?

- ✅ Verify Clerk webhook is configured correctly
- ✅ Check `CLERK_WEBHOOK_SECRET` in backend `.env`
- ✅ Ensure backend server is accessible from Clerk
- ✅ Check backend logs for webhook events

### Comments not loading?

- ✅ Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- ✅ Ensure backend server is running
- ✅ Check browser console for API errors
- ✅ Verify CORS is configured on backend

### Images not displaying?

- ✅ Use direct image URLs (not HTML pages)
- ✅ Check CORS settings for external images
- ✅ Verify image URL is accessible
- ✅ Next.js may need `remotePatterns` config for external domains

### Dark mode not working?

- ✅ Ensure `suppressHydrationWarning` is on `<html>` tag
- ✅ Check `ThemeProvider` is wrapping your app
- ✅ Clear browser cache and reload

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_BACKEND_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - Clerk redirect URLs
4. Deploy! 🚀

### Deploy Backend

Ensure your backend is deployed and accessible. Update webhook URL in Clerk Dashboard to point to production backend.

## 📝 API Integration

The frontend integrates with a backend API. See `backend-integration-guide.md` for complete API documentation including:

- User management endpoints
- Post CRUD operations
- Comment system with nesting
- Upvote functionality
- Admin operations
- Webhook handling

## 🔒 Security Features

- ✅ Clerk authentication with secure tokens
- ✅ Permission checks for delete operations
- ✅ Soft deletion (data preserved)
- ✅ User-owned content protection
- ✅ Admin role verification via Clerk metadata

## 🎭 UI Highlights

- **Smooth Transitions**: All page transitions and component animations
- **Responsive Grid**: Adaptive layouts for mobile, tablet, and desktop
- **Skeleton Loaders**: Professional loading states
- **Hover Effects**: Subtle hover animations on interactive elements
- **Scroll Indicators**: Visual feedback on scrollable content
- **Toast Notifications**: Error and success messages (ready to implement)

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Credits

Built with ❤️ using:

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motia.dev](https://motia.dev/)

---

**@CoHub** - A modern nested comment system for the web 🚀
