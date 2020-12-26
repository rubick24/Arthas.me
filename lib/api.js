import fs from 'fs'
import { resolve, join } from 'path'
import matter from 'gray-matter'
import markdownToHtml from './markdownToHtml'

const postsDirectory = resolve(process.cwd(), 'data/posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export async function getPostBySlug(slug, fields) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const item = {}

  await Promise.all(fields.map(async f => {
    if (f === 'slug') {
      item[f] = realSlug
    } else if (f === 'content') {
      item[f] = await markdownToHtml(content || '')
    } else if (f === 'date') {
      item[f] = typeof data.date === 'object' ? data.date.getTime() : data.date
    } else if (data[f]) {
      item[f] = data[f]
    }
  }))
  return item
}

export async function getAllPosts(fields) {
  const slugs = getPostSlugs()
  const posts = await Promise.all(slugs.map(slug => getPostBySlug(slug, [...fields, 'date'])))
  return posts.sort((a, b) => b.date - a.date)
}