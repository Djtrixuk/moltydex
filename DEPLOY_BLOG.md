# Deploy Blog to Production

## Files Ready to Commit

The following blog-related files need to be added and committed:

### Blog Pages & Components
- `frontend/pages/blog/index.tsx` - Blog homepage
- `frontend/pages/blog/[slug].tsx` - Individual blog post pages  
- `frontend/pages/blog/rss.xml.tsx` - RSS feed
- `frontend/components/BlogPostStructuredData.tsx` - Schema markup component

### Blog Content & Data
- `frontend/lib/blog-posts.ts` - Blog posts metadata
- `frontend/public/blog-content/*.md` - 6 blog post markdown files
- `frontend/public/sitemap.xml` - Updated sitemap

### Navigation Updates
- `frontend/pages/index.tsx` - Added blog link to desktop nav
- `frontend/components/MobileNav.tsx` - Added blog link to mobile nav

### Dependencies
- `frontend/package.json` - Added react-markdown and remark-gfm
- `frontend/package-lock.json` - Updated lock file

### Blog Source Files
- `blog/seo-optimized/*.md` - 6 SEO-optimized blog posts
- `scripts/setup-blog.sh` - Blog setup script
- `BLOG_IMPLEMENTATION_SUMMARY.md` - Implementation docs
- `BLOG_READY.md` - Ready status doc

## Commands to Run

### 1. Stage Blog Files
```bash
cd /Users/danielstephenson/agentdex

# Add blog pages and components
git add frontend/pages/blog/
git add frontend/components/BlogPostStructuredData.tsx
git add frontend/lib/blog-posts.ts

# Add blog content
git add frontend/public/blog-content/
git add frontend/public/sitemap.xml

# Add navigation updates
git add frontend/pages/index.tsx
git add frontend/components/MobileNav.tsx

# Add dependencies
git add frontend/package.json
git add frontend/package-lock.json

# Add blog source files
git add blog/
git add scripts/setup-blog.sh
git add BLOG_*.md
```

### 2. Commit Changes
```bash
git commit -m "feat: Add SEO-optimized blog with 6 posts for x402 payments and agent automation

- Add blog index page with categories and tags
- Add individual blog post pages with full SEO optimization
- Add 6 SEO-optimized blog posts (2000+ words each):
  * Token mismatch problem in x402 payments
  * Real-world use cases for MoltyDEX
  * Why MoltyDEX beats manual swapping
  * How MoltyDEX handles x402 payments automatically
  * Beta tester program with rewards
  * Why MoltyDEX offers 0% platform fees
- Add RSS feed for blog posts
- Add schema.org JSON-LD structured data for SEO
- Update sitemap with all blog posts
- Add blog link to navigation (desktop and mobile)
- Install react-markdown and remark-gfm for markdown rendering
- Add blog post metadata and content management system

SEO Features:
- Optimized meta tags (title, description, keywords)
- Open Graph and Twitter Card tags
- Canonical URLs
- Breadcrumb navigation
- Internal linking between related posts
- Focus on keywords: swaps, x402, token swapping, Solana DEX, agent automation"
```

### 3. Push to Repository
```bash
git push origin master
# or
git push origin main
```

## Deployment

### If Using Vercel (Auto-Deploy)
- Vercel will automatically detect the push and deploy
- Check your Vercel dashboard for deployment status
- Blog will be live at: https://moltydex.com/blog

### If Using Manual Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy according to your hosting setup

## Verify Deployment

After deployment, verify:

1. **Blog Index**: https://moltydex.com/blog
2. **Sample Post**: https://moltydex.com/blog/token-mismatch-problem-breaking-agent-automation
3. **RSS Feed**: https://moltydex.com/blog/rss.xml
4. **Sitemap**: https://moltydex.com/sitemap.xml

## SEO Verification

After deployment:

1. **Submit Sitemap to Google Search Console**
   - Go to: https://search.google.com/search-console
   - Add property: https://moltydex.com
   - Submit sitemap: https://moltydex.com/sitemap.xml

2. **Validate Schema Markup**
   - Visit: https://validator.schema.org/
   - Test a blog post URL

3. **Test Open Graph**
   - Visit: https://www.opengraph.xyz/
   - Test a blog post URL

4. **Check Mobile-Friendly**
   - Visit: https://search.google.com/test/mobile-friendly
   - Test blog pages

## Expected Results

- ✅ Blog live at /blog
- ✅ All 6 posts accessible
- ✅ RSS feed working
- ✅ SEO tags in place
- ✅ Navigation updated
- ✅ Sitemap includes blog posts

---

**Ready to deploy!** Run the commands above to push everything live.
