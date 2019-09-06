const { generateBlogSideBar } = require('./util')

module.exports = {
  title: 'Arthas.me',
  description: 'Pengfei\'s personal site',
  host: '0.0.0.0',
  port: 8000,
  head: [
    ['link', { rel: 'icon', href: 'data:image/png;base64,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' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c'}]
  ],
  markdown: {
    config: md => {
      md.use(require("markdown-it-katex"))
    }
  },
  themeConfig: {
    nav: [
      { text: 'Blog', link: '/posts/' },
      { text: 'About', link: '/about/' }
    ],
    sidebar: [
      'posts/',
      ...generateBlogSideBar('/posts')
    ],
    sidebarDepth: 0
  },
  evergreen: true
}
