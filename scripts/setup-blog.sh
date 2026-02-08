#!/bin/bash

# Setup script for blog implementation
# Copies blog markdown files to public directory

echo "Setting up MoltyDEX blog..."

# Create blog-content directory
mkdir -p frontend/public/blog-content

# Copy markdown files
echo "Copying blog post markdown files..."
cp blog/seo-optimized/*.md frontend/public/blog-content/

# Verify files
echo "Verifying files..."
if [ -f "frontend/public/blog-content/token-mismatch-problem-breaking-agent-automation.md" ]; then
    echo "✅ Blog files copied successfully!"
    echo ""
    echo "Blog posts ready:"
    ls -1 frontend/public/blog-content/*.md | wc -l
    echo "files copied"
else
    echo "❌ Error: Blog files not found"
    exit 1
fi

echo ""
echo "✅ Blog setup complete!"
echo ""
echo "Next steps:"
echo "1. Test blog pages: npm run dev (in frontend directory)"
echo "2. Visit: http://localhost:3000/blog"
echo "3. Check RSS feed: http://localhost:3000/blog/rss.xml"
echo ""
echo "To add markdown rendering (optional):"
echo "  cd frontend && npm install react-markdown remark-gfm"
