import { parseFrontmatter } from '../utils/markdown'

// Dynamically import all .md files from the content/posts directory
// Using updated query syntax to avoid depreciation warnings: load raw content
const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true })

export const posts = Object.keys(modules).map((path) => {
  // Extract slug from filename: "../content/posts/my-post.md" -> "my-post"
  const slug = path.split('/').pop().replace('.md', '')

  const fileContent = modules[path]
  const { metadata, content } = parseFrontmatter(fileContent)

  return {
    slug,
    ...metadata,
    content
  }
}).sort((a, b) => {
  // Numeric or string descend sort for date (newest first)
  return b.date > a.date ? 1 : -1
})

export function getPostBySlug(slug) {
  return posts.find(post => post.slug === slug)
}

export function getAllPosts() {
  return posts
}
