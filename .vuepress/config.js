const { generateBlogSideBar } = require('./util')

module.exports = {
  title: 'Arthas.me',
  description: 'Pengfei\'s personal site',
  host: 'localhost',
  port: 8000,
  markdown: {
    config: md => {
      md.use(require("markdown-it-katex"));
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
  }
}