import { getAllPosts } from '@/lib/api'
import Link from 'next/link'

export default async function Posts() {
  const postList = await getAllPosts()
  return (
    <>
      <p>posts</p>
      {postList.map(p => {
        return (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`}>{p.title}</Link>
          </li>
        )
      })}
    </>
  )
}
