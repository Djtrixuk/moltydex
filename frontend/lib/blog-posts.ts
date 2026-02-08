/**
 * Blog Posts Metadata
 * Centralized data for all blog posts
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
  date: string;
  category: string;
  tags: string[];
  canonical: string;
  content: string; // Will be loaded from markdown files
  optimized?: boolean; // Whether this is SEO-optimized version
}

// Import all posts from comprehensive list
import { blogPosts as allBlogPosts } from './blog-posts-all';

export const blogPosts: BlogPost[] = allBlogPosts;

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map(post => post.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(blogPosts.flatMap(post => post.tags)));
}
