import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import moment from 'moment-timezone';
import Content, { HTMLContent } from '../components/Content'
import Layout from '../components/Layout'
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import ColorBar from '../img/color-bar.png'

import { connect } from "react-redux";

export const OpenInfraLiveTemplate = ({
  isLoggedUser,
  contentComponent,
  content,
  hero,
  episodes,
  footer,
}) => {
  const PageContent = contentComponent || Content

  const [today, setToday] = useState(moment().utc().unix())

  useEffect(() => {
    fetch(`https://timeintervalsince1970.appspot.com/`)
      .then(response => response.json())
      .then(resultData => {
        if (resultData.timestamp) {
          setToday(Math.trunc(resultData.timestamp) - 7200);
        }
      })
  }, [])

  const futureEpisodes = episodes.filter(e => e.hidden === false && moment(e.date).utc().unix() > today).sort((a, b) => moment(a.date).utc().unix() - moment(b.date).utc().unix());
  const pastEpisodes = episodes.filter(e => e.hidden === false && moment(e.date).utc().unix() < today).sort((a, b) => moment(b.date).utc().unix() - moment(a.date).utc().unix());

  return (
    <div>
      <div className="wrapper project-background">
        <TopBar />
        <Navbar isLoggedUser={isLoggedUser} />
      </div>

      <main className="main">
        <div className="content">
          <div className="container">
            <section className="live-hero">
              <figure className="logo">
                <img src="/img/OpenInfra-live-logo-RGB.svg" alt="OpenInfra Live" />
              </figure>
              <div className="text">
                <h1>{hero.title}</h1>
                <p className="fix-h5" dangerouslySetInnerHTML={{ __html: hero.description }} />
                <p className="fix-h5">
                  Subscribe to the <a href="https://www.openstack.org/community/email-signup">OpenInfra newsletter</a> to hear more about upcoming episodes.
                </p>
                <div className="platforms">
                  <a className="social-links" href="//youtube.com/c/OpenStackFoundation?sub_confirmation=1">
                    <img src="/img/socials/youtube.svg" className="social-icon youtube" alt="OpenInfra Live on YouTube" />
                    Subscribe on YouTube
                  </a>
                  <a className="social-links" href="//www.linkedin.com/company/open-infrastructure-foundation/">
                    <img src="/img/socials/linkedin.svg" className="social-icon" alt="OpenInfra Live on LinkedIn" />
                    Follow on LinkedIn
                  </a>
                  <a className="social-links" href="//www.facebook.com/openinfradev">
                    <img src="/img/socials/facebook.svg" className="social-icon" alt="OpenInfra Live on Facebook" />
                    Follow on Facebook
                  </a>
                  <a className="social-links" href="//twitter.com/hashtag/OpenInfraLive?src=hashtag_click">
                    <img src="/img/socials/twitter.svg" className="social-icon" alt="OpenInfra Live on Twitter" />
                    Join the Conversation
                  </a>
                </div>
              </div>
            </section>
          </div>
          <section className="live-section">
            <div className="container">
              {futureEpisodes.length > 0 &&
                <>
                  <h2 className="section-title">{moment(futureEpisodes[0].date).utc().unix() >= today && moment(futureEpisodes[0].date).utc().unix() <= today + 7200 ? 'OpenInfra Live is Airing!' : 'The Next Episode Is Airing Soon!'}</h2>
                  {/* Next episode */}
                  {futureEpisodes.map((episode, index) => {
                    if (index === 0) {
                      return (
                        <React.Fragment key={`featured-${index}`}>
                          <a href={episode.youtubeLink} className="up-next-highlight">Up Next: {moment.utc(episode.date).format("dddd, MMMM DD @ H:mm z")} {moment(episode.date).tz("America/Chicago").format("(HA CT)")}</a>
                          <section className="up-next-wrapper">
                            <div className="video">
                              <div className="videoWrapper">
                                <iframe width="560" height="315" src={episode.youtubeEmbed} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                              </div>
                            </div>
                            <div className="details">
                              <h2>{episode.episodeTitle}</h2>
                              <p className="fix-h5" dangerouslySetInnerHTML={{ __html: episode.episodeDescription }} />
                              {/* <p className="fix-h5">
                            Have a question for the panel? <a href="https://openinfrafoundation.formstack.com/forms/oil_questions_upgrades">Submit it ahead of the live show!</a>
                          </p> */}
                              <p className="guests">
                                {episode.episodeSpeakers &&
                                  <>
                                    <span>Featuring</span>
                                    {episode.episodeSpeakers}
                                  </>
                                }
                              </p>
                              <div className="platforms">
                                {episode.calendarInvite &&
                                  <a className="social-links" href={episode.calendarInvite.replace('/static', '')}>
                                    <img src="/img/socials/calendar.svg" className="social-icon" alt="Add OpenInfra Live to your calendar" />
                                    Add to Calendar
                                  </a>
                                }
                                {episode.youtubeLink &&
                                  <a className="social-links" href={episode.youtubeLink}>
                                    <img src="/img/socials/youtube.svg" className="social-icon" alt="OpenInfra Live on YouTube" />
                                    Watch on YouTube
                                  </a>
                                }
                                {episode.linkedinLink &&
                                  <a className="social-links" href={episode.linkedinLink}>
                                    <img src="/img/socials/linkedin.svg" className="social-icon" alt="OpenInfra Live on LinkedIn" />
                                    Watch on LinkedIn
                                  </a>
                                }
                                {episode.facebookLink &&
                                  <a className="social-links" href={episode.facebookLink}>
                                    <img src="/img/socials/facebook.svg" className="social-icon" alt="OpenInfra Live on Facebook" />
                                    Watch on Facebook
                                  </a>
                                }
                              </div>
                            </div>
                          </section>
                        </React.Fragment>
                      )
                    }
                  })}
                </>
              }
              <section className="more-recent-wrapper" style={{ padding: futureEpisodes.length === 0 ? '0px' : '' }}>
                <h2 className="section-title">
                  {futureEpisodes.length > 0 ? "While You’re Waiting, Here Are A Few Of The Most Recent Episodes" : "Check out the most recent episodes"}
                </h2>
                <div className="more-recent-episodes">
                  {pastEpisodes.map((episode, index) => {
                    if (index >= 0 && index < 2) {
                      return (
                        <div className={`more-recent-single-${index === 0 ? 'left' : 'right'}`} key={`recent-${index}`}>
                          <div className="date">{moment.utc(episode.date).format("dddd, MMMM DD, YYYY")}</div>
                          <div className="video">
                            <div className="videoWrapper">
                              <iframe width="560" height="315" src={episode.youtubeEmbed} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                          </div>
                          <div className="details">
                            <h2>{episode.episodeTitle}</h2>
                            <p className="description" dangerouslySetInnerHTML={{ __html: episode.episodeDescription }} />
                            <div className="platforms">
                              <a className="social-links" href={episode.youtubeLink}>
                                <img src="/img/socials/youtube.svg" className="social-icon" alt="OpenInfra Live on YouTube" />
                                Watch on YouTube
                              </a>
                              {episode.superuserRecap &&
                                <a className="social-links" href={episode.superuserRecap}>
                                  <img src="/img/socials/superuser.svg" className="social-icon" alt="Read the recap on Superuser" />
                                  Superuser Recap
                                </a>
                              }
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
                <a href="#all-episodes" className="schedule-link">
                  See All Previous Episodes
                  <img src="/img/icons/arrow-down.svg" className="link-icon" alt="See all previous episodes" />
                </a>
              </section>
            </div>
          </section>
          <section className="schedule-wrapper">
            <div className="container">
              <h2 className="section-title">Upcoming OpenInfra Live Episodes</h2>
              <div className="schedule-list">
                {/* Start single episode */}
                {futureEpisodes.map((episode, index) => {
                  return (
                    <div className="schedule-single" key={`future-${index}`}>
                      <div className="date">{moment.utc(episode.date).format("dddd, MMMM DD, Y @ H:mm z")} {moment(episode.date).tz("America/Chicago").format("(HA CT)")}</div>
                      <div className="details">
                        <h2>{episode.episodeTitle}</h2>
                        <p className="fix-h5" dangerouslySetInnerHTML={{ __html: episode.episodeDescription }} />
                        {/* <p className="fix-h5">
                          Have a question for the panel? <a href="https://openinfrafoundation.formstack.com/forms/oil_questions_upgrades">Submit it ahead of the live show!</a>
                        </p> */}
                        <p className="guests">
                          {episode.episodeSpeakers &&
                            <>
                              <span>Featuring</span>
                              {episode.episodeSpeakers}
                            </>
                          }
                        </p>
                        <div className="platforms">
                          {episode.calendarInvite &&
                            <a className="social-links" href={episode.calendarInvite.replace('/static', '')}>
                              <img src="/img/socials/calendar.svg" className="social-icon" alt="Add episode to your calendar" />
                              Add to calendar
                            </a>
                          }
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/* End single episode */}
              </div>
              <div className="ideas-banner">
                <div>
                  <h2>
                    <img src="/img/icons/bulb.svg" alt="Share ideas for OpenInfra Live" />
                    Have an idea for an episode of OpenInfra Live?
                  </h2>
                  <p>
                    If you have any topics you would like to propose for an upcoming episode, please share your ideas with us! If selected, we’ll reach out to you to discuss details. We look forward to hearing your ideas!
                  </p>
                </div>
                <div>
                  <a href="//openinfrafoundation.formstack.com/forms/openinfralive">
                    Share now
                  </a>
                </div>
                <img src={ColorBar} className="multi-color-border" alt="Color Bar" />
              </div>
            </div>
          </section>
          <section className="live-section">
            <div className="container">
              <h2 className="section-title" id="all-episodes">Watch Previous Episodes</h2>
              <div className="all-episode-list">
                {/* Start past episodes */}
                {pastEpisodes.map((episode, index) => {
                  return (
                    <div className="all-episode-single" key={`past-${index}`}>
                      <div className="video">
                        <div className="videoWrapper">
                          <iframe width="560" height="315" src={episode.youtubeEmbed} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                      </div>
                      <div className="details">
                        <div className="date">{moment.utc(episode.date).format("dddd, MMMM D, YYYY")}</div>
                        <h2>{episode.episodeTitle}</h2>
                        <p className="fix-h5" dangerouslySetInnerHTML={{ __html: episode.episodeDescription }} />
                        <p className="guests">
                          <span>Featuring</span>
                          {episode.episodeSpeakers}
                        </p>
                        <div className="platforms">
                          <a className="social-links" href={episode.youtubeLink}>
                            <img src="/img/socials/youtube.svg" className="social-icon" alt="OpenInfra Live on YouTube" />
                            Watch on YouTube
                          </a>
                          {episode.superuserRecap &&
                            <a className="social-links" href={episode.superuserRecap}>
                              <img src="/img/socials/superuser.svg" className="social-icon" alt="Read the recap on Superuser" />
                              Read the Superuser Recap
                            </a>
                          }
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/* End single episode */}
              </div>
            </div>
          </section>
          <PageContent content={content} />
          {footer &&
            <Hero content={footer} />
          }
        </div>
      </main>
    </div>
  )
}

const OpenInfraLivePage = ({ OpenInfraLivePage, data, isLoggedUser }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <SEO seo={post.frontmatter.seo ? post.frontmatter.seo : null} />
      <OpenInfraLiveTemplate
        OpenInfraLivePage={OpenInfraLivePage}
        contentComponent={HTMLContent}
        hero={post.frontmatter.hero}
        episodes={post.frontmatter.episodes}
        content={post.html}
        footer={post.frontmatter.footer}
        isLoggedUser={isLoggedUser}
      />
    </Layout>
  )
}

OpenInfraLivePage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default connect(state => ({
  isLoggedUser: state.loggedUserState.isLoggedUser
}), null)(OpenInfraLivePage)


export const OpenInfraLivePageQuery = graphql`
  query OpenInfraLivePage($id: String!) {
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
        hero {
          title
          description
        }
        episodes {
          date
          episodeTitle
          episodeDescription  
          episodeSpeakers
          youtubeEmbed
          youtubeLink
          facebookLink
          linkedinLink
          calendarInvite
          superuserRecap
          hidden
        }
        footer {
          title
          subTitle
          button
          buttonText
          display
        }
      }
    }
  }
`
