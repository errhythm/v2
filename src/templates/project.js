import React, { useEffect, useRef } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Layout } from '@components';
import { Icon } from '@components/icons';
import styled, { createGlobalStyle } from 'styled-components';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const GlobalStyle = createGlobalStyle`
  figure img, .gatsby-resp-image-wrapper {
    opacity: 0.01;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
`;

const StyledProjectContainer = styled.main`
  max-width: 1000px;
`;

const StyledProjectHeader = styled.header`
  margin-bottom: 50px;
  .tag {
    margin-right: 10px;
  }
  .project-links {
    display: flex;
    height: 20px;
    gap: 10px;
  }
`;

const StyledProjectContent = styled.div`
  margin-bottom: 100px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
    color: var(--light-slate);
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  code {
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
    border-radius: var(--border-radius);
    font-size: var(--fz-sm);
    padding: 0.2em 0.4em;
  }

  pre code {
    background-color: transparent;
    padding: 0;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 2em 0;
    overflow: hidden;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  th,
  td {
    padding: 1em;
    text-align: left;
    border-bottom: 1px solid var(--lightest-navy);
  }

  th {
    background-color: var(--navy);
    color: var(--lightest-slate);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:nth-child(even) {
    background-color: var(--light-navy);
  }

  tr:hover {
    background-color: var(--lightest-navy);
  }

  @media (max-width: 768px) {
    table {
      border: 0;
    }

    table caption {
      font-size: 1.3em;
    }

    table thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    table tr {
      border-bottom: 3px solid var(--lightest-navy);
      display: block;
      margin-bottom: 0.625em;
    }

    table td {
      border-bottom: 1px solid var(--lightest-navy);
      display: block;
      font-size: 0.8em;
      text-align: left;
      padding: 0.625em;
      position: relative;
    }

    table td::before {
      content: attr(data-label);
      font-weight: bold;
      display: block;
      margin-bottom: 0.5em;
      text-transform: uppercase;
      color: var(--lightest-slate);
    }

    table td:last-child {
      border-bottom: 0;
    }
  }

  figure {
    margin: 2em 0;
    position: relative;
    width: 100%;
    max-width: 800px;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: var(--border-radius);
      box-shadow: 0 10px 30px -15px var(--navy-shadow);
      transition: var(--transition);

      &[alt=''],
      &:not([alt]) {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    &:hover {
      img {
        box-shadow: 0 20px 30px -15px var(--navy-shadow);
        transform: translateY(-5px);
      }
    }

    figcaption {
      margin-top: 1em;
      text-align: center;
      color: var(--light-slate);
      font-style: italic;
      font-size: var(--fz-sm);
    }
  }

  .gatsby-resp-image-wrapper {
    margin: 2em 0;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    transition: var(--transition);

    &:hover {
      box-shadow: 0 20px 30px -15px var(--navy-shadow);
      transform: translateY(-5px);
    }
  }
`;

const StyledFeaturedImage = styled.div`
  margin: 50px auto;
  position: relative;
  width: 100%;
  max-width: 800px;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--border-radius);
    border: 2px solid var(--green);
    transition: var(--transition);
    opacity: 0.1;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: var(--border-radius);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    transition: var(--transition);
    opacity: 0;
    transform: translateY(20px);

    &.visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    &::before {
      top: 10px;
      left: 10px;
      opacity: 0.2;
    }

    img {
      box-shadow: 0 20px 30px -15px var(--navy-shadow);
      transform: translateY(-5px);
    }
  }

  @media (max-width: 768px) {
    margin: 40px auto;
  }
`;

const ProjectTemplate = ({ data, location }) => {
  const project = data.markdownRemark;
  const { frontmatter, html } = project;
  const { title, date, github, external, tech, image } = frontmatter;
  const [setElements, entries] = useIntersectionObserver({
    threshold: 0.25,
    rootMargin: '0px 0px -100px 0px',
  });

  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && imageRef.current) {
      const images = contentRef.current.querySelectorAll('figure img, .gatsby-resp-image-wrapper');
      setElements([imageRef.current, ...images]);
    }
  }, [setElements]);

  useEffect(() => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, [entries]);

  const processedContent = html.replace(
    /<p><img(.*?)alt="(.*?)"(.*?)><\/p>/g,
    (match, p1, p2, p3) => {
      if (p2.trim() !== '') {
        return `<figure><img${p1}alt="${p2}"${p3}><figcaption>${p2}</figcaption></figure>`;
      } else {
        return `<figure><img${p1}alt="${p2}"${p3}></figure>`;
      }
    },
  );

  return (
    <Layout location={location}>
      <GlobalStyle />
      <Helmet title={title}>
        <meta name="image" content={image} />
        <meta property="og:image" content={image} />
        <meta name="twitter:image" content={image} />
      </Helmet>

      <StyledProjectContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/projects">All Projects</Link>
        </span>

        <StyledProjectHeader>
          <h1 className="medium-heading">{title}</h1>
          <p className="subtitle">
            <time>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>&nbsp;&mdash;&nbsp;</span>
            {tech &&
              tech.length > 0 &&
              tech.map((tech, i) => (
                <span key={i} className="tag">
                  #{tech}
                </span>
              ))}
          </p>
          <div className="project-links">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Link">
                <Icon name="GitHub" />
              </a>
            )}
            {external && (
              <a
                href={external}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="External Link">
                <Icon name="External" />
              </a>
            )}
          </div>
        </StyledProjectHeader>

        {image && (
          <StyledFeaturedImage>
            <img src={image} alt={title} ref={imageRef} />
          </StyledFeaturedImage>
        )}

        <StyledProjectContent
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </StyledProjectContainer>
    </Layout>
  );
};

export default ProjectTemplate;

ProjectTemplate.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        github
        external
        tech
        image
      }
      fields {
        slug
      }
    }
  }
`;
