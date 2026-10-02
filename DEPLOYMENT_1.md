# Horreco Deployment Guide

Your Horreco project is ready to deploy! Follow these 3 steps to get live.

## Step 1: Push to GitHub

### 1.1 Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repo `horreco` (or whatever you prefer)
3. Choose "Public" for Vercel to access it
4. Click "Create repository"

### 1.2 Push Your Code

Copy this project directory and push it:

```bash
cd /path/to/horreco-complete

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/horreco.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Deploy to Vercel

### 2.1 Connect Vercel to GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub `horreco` repository
4. Click "Import"

### 2.2 Configure & Deploy

1. **Project Name**: `horreco` (or your choice)
2. **Framework**: Leave as "Other" (it's static HTML)
3. **Root Directory**: Leave as `./`
4. Click "Deploy"

Vercel will automatically build and deploy your site. You'll get a live URL like `https://horreco-xxx.vercel.app`

## Step 3: Set Up Supabase Database

### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/create account
2. Click "New Project"
3. Fill in:
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to you
4. Wait for it to provision (2-3 minutes)

### 3.2 Run the SQL Schema

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "+ New Query"
3. Paste the entire SQL script below:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Jars Table
CREATE TABLE user_jars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jar_name TEXT NOT NULL,
  jar_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time Entries Table
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jar_id UUID NOT NULL REFERENCES user_jars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_user_jars_user_id ON user_jars(user_id);
CREATE INDEX idx_time_entries_jar_id ON time_entries(jar_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);

-- Enable Row Level Security
ALTER TABLE user_jars ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- User Jars Policies
CREATE POLICY "Users can see their own jars"
  ON user_jars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create jars"
  ON user_jars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jars"
  ON user_jars FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jars"
  ON user_jars FOR DELETE
  USING (auth.uid() = user_id);

-- Time Entries Policies
CREATE POLICY "Users can see their own time entries"
  ON time_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create time entries"
  ON time_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time entries"
  ON time_entries FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click "Run" (the play button)
5. You should see "Success" ✓

### 3.3 Verify Supabase Setup

1. In Supabase, go to **Authentication** → **Providers**
2. Make sure "Email" is enabled (it should be by default)
3. Your Supabase URL and API key are already embedded in the HTML files at:
   - URL: `https://rkyawxfzfueqfgzgkkkt.supabase.co`
   - Key: (already in welcome.html, dashboard.html, jar.html)

## Step 4: Test Your App

1. Open your Vercel URL (e.g., `https://horreco-xxx.vercel.app`)
2. Click "Sign Up" and create an account
3. After signing in, you should see the dashboard
4. Click "+ Create New Project"
5. Choose a theme (e.g., Flowers)
6. Enter a project name (e.g., "Deep Work")
7. Click "Create Jar"
8. Start tracking time! 🎉

## Troubleshooting

### Auth Modal Not Showing
- Check browser console (F12) for errors
- Verify Supabase credentials are correct in `welcome.html`

### Can't Create Jars
- Verify Supabase database tables exist
- Check browser console for error messages
- Confirm you're signed in

### Time Entries Not Saving
- Verify RLS policies are enabled
- Check Supabase SQL Editor for table creation errors
- Review browser console network tab for API errors

### Pages Not Loading
- Ensure Vercel deployment completed successfully
- Check that all files were uploaded to GitHub
- Verify `vercel.json` routing configuration

## File Structure

```
horreco/
├── welcome.html              # Landing page + auth
├── dashboard.html            # Projects list
├── jar.html                  # Dynamic jar loader
├── Time Jar - [Theme].html   # 10 jar pages
├── assets/                   # Images for each theme
├── styles.css               # Shared styles
├── support.js               # Utility functions
├── image-slot.js            # Image utilities
├── vercel.json              # Vercel config
├── README.md                # Project info
└── DEPLOYMENT.md            # This file
```

## Supabase Credentials

These are already configured in the HTML files:
- **URL**: `https://rkyawxfzfueqfgzgkkkt.supabase.co`
- **API Key** (public/anon): Embedded in HTML files
- **Database Tables**: `user_jars`, `time_entries`
- **Auth**: Email/password via Supabase Auth

## Available Jar Themes

When creating a project, you can choose from:

| Emoji | Theme | Filename |
|-------|-------|----------|
| 🌸 | Flowers | Time Jar - Flowers.html |
| 🍂 | Maple | Time Jar - Maple.html |
| 💧 | Water | Time Jar - Water.html |
| 🌼 | Dandelion | Time Jar - Dandelion.html |
| 🪶 | Feathers | Time Jar - Feathers.html |
| 🦅 | Cranes | Time Jar - Cranes.html |
| ✉️ | Envelopes | Time Jar - Envelopes.html |
| 🍊 | Orange | Time Jar - Orange.html |
| 🌱 | Bamboo | Time Jar - Bamboo.html |
| 🌿 | Plant | Time Jar - Plant.html |

## Next Steps

After deployment:
1. Share your app with friends and teammates
2. Create different jars for different projects
3. Track time invested in each project
4. Celebrate milestones at 200 hours (400 items)!

---

**Need help?** Check the README.md for more details or review browser console errors (F12).

Good luck with Horreco! ✨
