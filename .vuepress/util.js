const { join, basename } = require('path');
const glob = require('glob');
const { readFileSync } = require('fs');
const { parseFrontmatter } = require('@vuepress/shared-utils')

const generateBlogSideBar = dir => {

  let files = glob.sync('**/*.md', { cwd: join(__dirname, '..', dir) })
    .filter(p => basename(p) !== 'README.md')
    .map(x => '/posts/' + x)

  files = files.map(file => {
    let frontmatter = parseFrontmatter(readFileSync(join(__dirname, '..', file), 'utf8').split('\n').map(l => l.trim()).join('\n'))
    return {
      file: file,
      date: new Date(frontmatter.data.date),
      title: frontmatter.data.title
    }
  })
  function comp(a, b) {
    if (a.date > b.date) {
      return -1;
    } else if (a.date < b.date) {
      return 1;
    } else {
      return 0;
    }
  }
  files.sort(comp)


  function groupByYear(files) {
    let years = []
    let res = [];
    files.forEach(x => {
      let year = x.date.getFullYear()
      if (years.includes(year)) {
        res[years.indexOf(year)].children.push([x.file.slice(0, -2) + 'html', x.title])
      } else {
        years.push(year)
        res.push({
          title: year,
          children: [[x.file.slice(0, -2) + 'html', x.title]]
        })
      }
    });
    return res;
  }

  return groupByYear(files)
};

//const posts = generateBlogSideBar('/posts')
//console.log(posts[0].children[0])

exports.generateBlogSideBar = generateBlogSideBar
