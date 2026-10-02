# Horreco — Visual Time Tracking Jar App

A beautiful, interactive time-tracking app where you collect visual memories of your work. Track time invested in projects through themed "jars" that fill with falling items as you log hours.

## Features

- 🎨 **10 Beautiful Themes**: Flowers, Maple leaves, Water drops, Dandelion seeds, Feathers, Cranes, Envelopes, Oranges, Bamboo, and Plants
- 👤 **Multi-User Support**: Secure authentication with email/password via Supabase
- 📊 **Project Dashboard**: Create and manage multiple time-tracking projects
- 🎯 **Milestone Celebrations**: Special animations at 200-hour (400-item) milestones
- 💾 **Persistent Data**: All time entries saved to Supabase PostgreSQL database
- 🔒 **Row-Level Security**: User data isolation at the database level

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel
- **Animations**: Web Animations API

## Project Structure

```
.
├── welcome.html          # Landing page with auth modal
├── dashboard.html        # User's projects list
├── jar.html             # Dynamic jar loader
├── Time Jar - *.html    # 10 themed jar pages
├── styles.css           # Shared styling
├── support.js           # Utility functions
├── image-slot.js        # Image loading utilities
├── assets/              # Theme images and backgrounds
├── vercel.json          # Vercel routing config
└── README.md            # This file
```

## Setup Instructions

### 1. Database Setup

Run the SQL script in your Supabase dashboard to create tables and enable Row Level Security:

```sql
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

-- Enable Row Level Security
ALTER TABLE user_jars ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- User Jars Policies
CREATE POLICY "Users can see their own jars"
  ON user_jars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jars"
  ON user_jars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jars"
  ON user_jars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jars"
  ON user_jars FOR DELETE
  USING (auth.uid() = user_id);

-- Time Entries Policies
CREATE POLICY "Users can see their own time entries"
  ON time_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert time entries for their jars"
  ON time_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time entries"
  ON time_entries FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 3. Configure Environment

The app uses embedded Supabase credentials (public API key) which is safe for client-side use. The Supabase keys are already configured in the HTML files.

## Jar Themes Reference

| Type | Icon | Color Theme |
|------|------|-------------|
| flowers | 🌸 | Pink/Green |
| maple | 🍂 | Orange/Brown |
| water | 💧 | Blue |
| dandelion | 🌼 | Yellow |
| feathers | 🪶 | Gray/Beige |
| cranes | 🦅 | Brown/Blue |
| envelopes | ✉️ | Cream/White |
| orange | 🍊 | Orange |
| bamboo | 🌱 | Green |
| plant | 🌿 | Green |

## Troubleshooting

**Q: Auth modal not appearing**
- Check browser console for errors
- Verify Supabase credentials in welcome.html

**Q: Jars not loading**
- Ensure jar.html is being served correctly
- Check that jar theme files exist in root directory
- Verify URL parameters: `?type=flowers&id=xxx`

**Q: Time entries not saving**
- Verify Supabase RLS policies are enabled
- Check user authentication status
- Review browser console for database errors

## License

Created with ✨ by Horreco
