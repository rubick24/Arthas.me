import fs from 'fs'
import matter, { type GrayMatterFile } from 'gray-matter'
import { join, resolve } from 'path'

const postsDirectory = resolve(process.cwd(), 'src/data/posts')

export async function getPostBySlug(slug: string) {
  const fullPath = join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const { data, content } = matter(fileContents) as GrayMatterFile<string> & {
    data: { title: string; date: Date }
  }
  return {
    ...data,
    slug,
    content,
    date: data.date.getTime() + data.date.getTimezoneOffset() * 60 * 1000
  }
}

export async function getPostSlugs() {
  return fs.readdirSync(postsDirectory).map(v => ({
    slug: v.replace(/\.md$/, '')
  }))
}

export async function getAllPosts() {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(slugs.map(v => getPostBySlug(v.slug)))
  return posts.sort((a, b) => b.date - a.date)
}
