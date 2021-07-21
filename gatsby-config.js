module.exports = {
  siteMetadata: {
    title: 'Open Infrastructure Foundation',
    description:
      'The Home of Open Infrastructure',
    url: 'https://openinfra.dev/'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                url
                site_url: url
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.seo.description,
                  date: edge.node.frontmatter.date,
                  url: edge.node.frontmatter.seo.url,
                  guid: edge.node.frontmatter.seo.url,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
                ) {
                  edges {
                    node {
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                        seo {
                          description
                          url
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Open Infrastructure Foundation RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/blog/",
            // optional configuration to specify external rss feed, such as feedburner
            // link: "https://feeds.feedburner.com/gatsby/blog",
          },
        ],
      },
    },
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static',
            },
          },
          {
            resolve: `gatsby-remark-classes`,
            options: {
              classMap: {
                "heading[depth=3]": "fix-h3",
                "heading[depth=2]": "fix-h2",
                paragraph: "fix-h5",
              }
            }
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/auth/*`, `/a/*`] },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-139234657-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "UA-139234657-1", // Google Analytics / GA          
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          // exclude: ["/preview/**", "/do-not-track/me/too/"],
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Open Infrastructure Foundation`,
        short_name: `Open Infrastructure Foundation`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#f15b3e`,
        icon: `src/img/icon.png`,
        display: `standalone`,
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
        // @see https://github.com/netlify/netlify-cms/issues/1690#issuecomment-465078677
        enableIdentityWidget: false
      },
    },
    {
      resolve: 'gatsby-plugin-purgecss', // purges all unused/unreferenced css rules
      options: {
        develop: true, // Activates purging in npm run develop        
        whitelistPatterns: [/^carousel/, /^projects-s/, /^company-level-/, /^more-recent-single-/],
        purgeOnly: ['/style'], // applies purging only on the bulma css file
      },
    }, // must be after other CSS plugins
    {
      resolve: 'gatsby-plugin-netlify', // make sure to keep it last in the array,
      options: {
        enableIdentityWidget: true,
        htmlTitle: `Open Infrastructure Foundation | Content Manager`,
        includeRobots: false,
      }
    },
    {
      resolve: 'gatsby-plugin-linkedin-insight',
      options: {
        partnerId: '2906612',
  
        // Include LinkedIn Insight in development.
        // Defaults to false meaning LinkedIn Insight will only be loaded in production.
        includeInDevelopment: true
      }
    }
  ],
}
