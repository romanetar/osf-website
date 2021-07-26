import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Content, { HTMLContent } from '../components/Content'
import Layout from '../components/Layout'
import Header from '../components/Header'
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import BecomeSponsor from '../components/BecomeSponsor'
import SEO from '../components/SEO'

import { connect } from "react-redux";

export const CompaniesPageTemplate = ({
  isLoggedUser,
  header,
  companies,
  content,
  contentComponent
}) => {
  const PageContent = contentComponent || Content

  return (
    <div>
      <div className="wrapper project-background">
        <TopBar />
        <Navbar isLoggedUser={isLoggedUser} />
        <Header title={header.title} subTitle={header.subTitle} link={header.link} />
      </div>

      <main className="main">
        <div className="content">
          <div className="container">
            <section className="companies-s1-main">
              {companies.map((tier, index) => {
                return (
                  <div className="companies-s1-container" key={index}>
                    <div className="companies-s1-columns">
                      <div className="companies-s1-column1">
                        <div className="fix-h3">{tier.title}</div>
                        <div className="fix-h5" dangerouslySetInnerHTML={{ __html: tier.text }}>
                        </div>
                      </div>
                      <div className="companies-s1-1-container">
                        <div className={`company-level-${tier.level}`}>
                          {tier.companyList && tier.companyList.filter((company) => company.hasOwnProperty('image')).map((company, index) => {
                            return (
                              <img
                                src={
                                (company.image.extension === 'svg' || company.image.extension === 'gif') && !company.image.childImageSharp ?
                                  company.image.publicURL
                                  :
                                  !!company.image.childImageSharp ? company.image.childImageSharp.fluid.src : company.image
                                }
                                alt={company.alt}
                                width={company.width ? company.width : null}
                                key={index}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>
          </div>
          <PageContent content={content} />
          <BecomeSponsor />
        </div>
      </main>
    </div>
  )
}

CompaniesPageTemplate.propTypes = {
  header: PropTypes.object,
  companies: PropTypes.array,
}

const CompaniesPage = ({ isLoggedUser, data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <SEO seo={post.frontmatter.seo ? post.frontmatter.seo : null} />
      <CompaniesPageTemplate
        isLoggedUser={isLoggedUser}
        contentComponent={HTMLContent}        
        header={post.frontmatter.header}
        companies={post.frontmatter.companies}
      />
    </Layout>
  )
}

CompaniesPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default connect(state => ({
  isLoggedUser: state.loggedUserState.isLoggedUser
}), null)(CompaniesPage)

export const companiesPageQuery = graphql`
  query CompaniesPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        seo {
          title
          description
          url
          image {
            childImageSharp {
              fluid(maxWidth: 640, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
            publicURL
          }
          twitterUsername
        }
        header {
          title
          subTitle
          link {
            url
            text
          }
        }        
        companies {
          title
          text
          level
          companyList {  
            image {
              childImageSharp {
                fluid(maxWidth: 640, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
              extension
              publicURL
            }
            alt
          }
        }        
      }
    }
  }
`
