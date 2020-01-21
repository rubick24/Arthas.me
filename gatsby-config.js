module.exports = {
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/posts/`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 768,
              withWebp: true
            }
          },
          {
            resolve: `gatsby-remark-katex`
          },
          {
            resolve: `gatsby-remark-vscode`,
            options: {
              colorTheme: {
                defaultTheme: 'Solarized Light',
                prefersDarkTheme: 'Dark+ (default dark)'
              },
              wrapperClassName: 'code'
              // logLevel: 'warn'       // Set to 'warn' to debug if something looks wrong
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Arthas.me`,
        short_name: `Arthas.me`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#000000`,
        display: `standalone`,
        icon: `static/favicon.png`,
        legacy: false
      }
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        //
      }
    }
  ],
  siteMetadata: {
    title: `Arthas.me`,
    titleTemplate: `%s -Arthas.me`,
    description: `random shits`,
    url: `https://arthas.me`, // No trailing slash allowed!
    image: `/favicon.png`, // Path to your image you placed in the 'static' folder
    twitterUsername: "@deadalusmask",
  },
}
