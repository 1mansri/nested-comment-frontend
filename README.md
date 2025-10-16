# NestedComments - Beautiful Nested Comment System

A modern, feature-rich nested comment system built with Next.js 15, TypeScript, Clerk authentication, and Framer Motion animations.

## ✨ Features

- 🔐 **Authentication**: Clerk integration with sign-in/sign-up
- 💬 **Nested Comments**: Unlimited depth comment threading
- 👍 **Upvote System**: Toggle upvotes on comments
- 🔄 **Sorting**: Sort by newest, oldest, or most upvoted
- 🎨 **Animations**: Smooth Framer Motion animations and micro-interactions
- 👤 **User Profiles**: View user details and all their posts
- ✍️ **Create Posts**: Rich post creation with cover images
- 🎯 **Admin Features**: Admin users can delete any content
- 📱 **Responsive Design**: Mobile-first, responsive UI
- 🌓 **Dark Mode**: Built-in theme switching

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create `.env.local` file:

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com

# Clerk (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Setup Clerk Webhook

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/) → Webhooks
2. Add endpoint: `https://your-backend-url.com/clerk-webhook`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`
4. Copy signing secret to backend `.env`

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features

### Nested Comments

- Unlimited nesting depth (default max: 5 levels)
- Lazy loading replies on demand
- Visual indentation hierarchy
- Real-time upvote toggle

### Sorting Options

- **Newest First**: Recent comments on top
- **Oldest First**: Original order
- **Most Upvoted**: Popular comments first

### Admin Features

- Delete any post/comment
- Admin badge display
- Soft delete (marked as deleted)

## 📁 Project Structure

```
app/
  (main)/              # Main app pages
    page.tsx           # Home - post list
    post/[id]/         # Individual post
    profile/           # User profile
    create-post/       # Create new post
  sign-in/             # Auth pages
  sign-up/
components/
  comments/            # Comment system
  post/                # Post components
  layout/              # Header, etc.
  ui/                  # Shadcn components
lib/
  api.ts               # API client
  types.ts             # TypeScript types
  hooks/               # Custom hooks
```

## 🔧 Tech Stack

- Next.js 15 (App Router + Turbopack)
- TypeScript
- Clerk Authentication
- Tailwind CSS v4
- Shadcn UI + Radix UI
- Framer Motion + GSAP
- Lucide Icons

## 🎨 Making Admin User

In Clerk Dashboard → Users → Select User → Metadata:

```json
{
  "role": "admin"
}
```

## 🐛 Troubleshooting

**User not syncing?**

- Check Clerk webhook configuration
- Verify signing secret in backend

**Comments not loading?**

- Verify `NEXT_PUBLIC_BACKEND_URL`
- Check backend is running
- Check browser console

## 🚀 Deploy

### Vercel (Recommended)

```bash
vercel
```

Add environment variables in Vercel dashboard.

## 📝 API Integration

See `backend-integration-guide.md` for complete API documentation.

## 📄 License

MIT License

---

Built with ❤️ using Next.js, Clerk, and Framer Motion
