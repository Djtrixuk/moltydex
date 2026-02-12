# How to Find Root Directory Setting in Vercel

## Option 1: Scroll Down on General Page

The Root Directory setting is usually **below** the sections you're seeing. On the General settings page:

1. **Scroll down** past:
   - Project Name
   - Project ID  
   - Vercel Toolbar
   - Preview Deployment Suffix

2. Look for a section called **"Root Directory"** or **"Project Root"**

3. It should show something like:
   - Current value: `/` (root) or blank
   - Input field to change it
   - Description: "The directory within your repository that contains your project"

## Option 2: Check Build and Deployment Section

If you don't see it on General:

1. Click **"Build and Deployment"** in the left sidebar (I can see it in your navigation)
2. Look for **"Root Directory"** setting there
3. It's usually near the top of that page

## What to Set It To

Once you find it:
- **Change from**: `/` (or blank/root)
- **Change to**: `frontend`

Then click **Save**.

## If You Still Can't Find It

The Root Directory setting might be:
- Hidden if the project was created with a different method
- Only visible on certain Vercel plans
- Located in a different section

**Alternative**: You can also configure it via the Vercel CLI or by ensuring the `vercel.json` file I created is correct (which it should be).

---

**Quick Check**: Can you scroll down on the General page and see if there's a "Root Directory" section below what you're currently viewing?
