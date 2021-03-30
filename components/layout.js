import BreadCrumbs from './bread-crumbs'

export default function Layout({ children }) {
  return (
    <div className="page">
      <BreadCrumbs />
      {children}
    </div>
  )
}
