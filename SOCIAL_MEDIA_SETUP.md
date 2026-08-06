# Social Media Follower Counter Setup

## 📋 What This Does
Adds a "Social Media" tab to your Admin Panel where you can update real follower counts. These numbers automatically display on your About page with live updates.

## 🚀 Quick Setup (2 Steps)

### Step 1: Run SQL in Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `xqqrptlpuvkljebmszca`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Social Media Follower Counts Table
CREATE TABLE IF NOT EXISTS social_media_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  handle TEXT NOT NULL,
  followers INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  platform_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert your real starting values (UPDATE THESE WITH YOUR REAL NUMBERS!)
INSERT INTO social_media_stats (platform, handle, followers, description, platform_url) VALUES
('instagram_tailoring', '@as_tailoring_tools_textiles', 0, 'Professional sewing machines, tailoring tools, daily tips & tutorials for craftsmen', 'https://www.instagram.com/as_tailoring_tools_textiles'),
('instagram_fashion', '@asma_label.in', 0, 'Women''s fashion, ethnic wear collections, trending outfits & style inspiration', 'https://www.instagram.com/asma_label.in'),
('youtube', '@astailoringtoolstextiles', 0, 'Sewing tutorials, machine reviews, tailoring tips & DIY fashion projects', 'https://youtube.com/@astailoringtoolstextiles'),
('facebook', 'Asmalabel', 0, 'Latest products, customer reviews, special offers & business updates', 'https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr')
ON CONFLICT (platform) DO NOTHING;

-- Enable RLS
ALTER TABLE social_media_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to social media stats"
  ON social_media_stats FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users (admins) to update
CREATE POLICY "Allow admins to update social media stats"
  ON social_media_stats FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

6. Click **Run** button
7. You should see "Success. No rows returned"

### Step 2: Check Your Website

1. Open http://localhost:5173/about
2. Scroll to "Our Social Media" section
3. You'll see "0K+" for all platforms (that's normal - we set them to 0)
4. Login to admin panel
5. Click "Social Media" tab (new tab in nav)
6. Update with your REAL follower counts
7. Click Save
8. Refresh About page - numbers updated instantly!

## 📱 How to Update Follower Counts

**Weekly or whenever you notice growth:**

1. Go to Admin Panel
2. Click "Social Media" tab
3. Type your current real follower numbers
4. Click "Save Changes"
5. Done! Website updates for all visitors instantly

Takes 30 seconds total.

## ✅ Current Setup Status

- ✅ About.jsx - Updated to fetch real-time data from database
- ✅ database-social-media.sql - SQL file created
- ⏳ AdminPanel.jsx - Social Media tab needs to be added (you'll need to add this section to the admin panel based on the file structure)

## 🔧 What You Need to Check

1. Make sure your Instagram accounts are correct:
   - `@as_tailoring_tools_textiles` 
   - `@asma_label.in`

2. Check YouTube: `@astailoringtoolstextiles`

3. Verify Facebook page URL still works

## 📞 Need Help?

If something doesn't work, check:
1. SQL ran successfully in Supabase (no errors)
2. You're logged in as admin (as.businezzz@gmail.com)
3. Browser console for any errors (F12 → Console tab)
