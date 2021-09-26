import { useRouter } from 'next/router'
import Link from 'next/link'

const routeTitles = {
  '/': 'Arthas.me',
  '/posts': 'Posts',
  '/demos': 'Demos',
  '/about': 'About',
  '/posts/[slug]': ''
}

export default function BreadCrumbs() {
  const router = useRouter()

  const routePath = (() => {
    const arr = router.route.split('/')
    arr.shift()
    return arr
  })()
  const level = routePath[0] === '' ? 0 : routePath.length

  return (
    <div className="header-wrapper">
      <div className={`page-heading h${level + 1}`} role="heading">
        {routePath.map((v, i) => {
          const href = `/${routePath.slice(0, i + 1).join('/')}`
          const title = routeTitles[href] ?? ''
          if (i === 0) {
            if (v === '') {
              return <span key={i}>Arthas.me</span>
            } else {
              return (
                <span key={i}>
                  <Link href="/">
                    <a>Arthas.me</a>
                  </Link>
                  {routePath.length === 1 ? (
                    ` / ${title}`
                  ) : (
                    <>
                      {' '}
                      /{' '}
                      <Link href={href}>
                        <a>{title}</a>
                      </Link>
                    </>
                  )}
                </span>
              )
            }
          }
          return i === routePath.length - 1 ? (
            ` / ${title}`
          ) : (
            <span key={i}>
              {' '}
              /{' '}
              <Link href={href}>
                <a>{title}</a>
              </Link>
            </span>
          )
        })}
      </div>
    </div>
  )
}
