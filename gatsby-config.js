module.exports = {
  plugins: [
    `gatsby-plugin-styled-components`,
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
          {
            resolve: `gatsby-remark-katex`
          },
          {
            resolve: `gatsby-remark-vscode`,
            options: {
              colorTheme: {
                defaultTheme: 'Solarized Light',    // Required
                prefersDarkTheme: 'Dark+ (default dark)', // Optional: used with `prefers-color-scheme: dark`
                prefersLightTheme: 'Solarized Light'    // Optional: used with `prefers-color-scheme: light`
              }, // Read on for list of included themes. Also accepts object and function forms.
              wrapperClassName: 'code'
              // logLevel: 'warn'       // Set to 'warn' to debug if something looks wrong
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
              icon: `static/static/img/IO-l.png`,
              legacy: false
            },
          },
          {
            resolve: `gatsby-plugin-offline`,
            options: {
              // 
            }
          }
        ]
      }
    }
  ],
  siteMetadata: {}
}
