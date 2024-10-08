import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;

  a {
    padding: 10px 0px;
  }

  .github-stats {
    margin-top: 10px;

    & > span {
      display: inline-flex;
      align-items: center;
      margin: 0 7px;
    }
    svg {
      display: inline-block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }
`;

const TimeCapsuleLink = styled.a`
  text-decoration: none;
  position: relative;
  opacity: 0.8;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::before {
    content: '⏳';
    display: none;
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 9999;
    font-size: 24px;
    width: 24px;
    height: 24px;
    animation: clockRotate 2s linear infinite;
  }

  @keyframes clockRotate {
    0% {
      transform: translateX(-50%) rotate(0deg);
    }
    100% {
      transform: translateX(-50%) rotate(360deg);
    }
  }

  &:hover::before {
    display: block;
  }
`;

const Footer = () => {
  const data = new Date();
  const year = data.getFullYear();
  return (
    <StyledFooter>
      <StyledSocialLinks>
        <ul>
          {socialMedia &&
            socialMedia.map(({ name, url }, i) => (
              <li key={i}>
                <a href={url} aria-label={name}>
                  <Icon name={name} />
                </a>
              </li>
            ))}
        </ul>
      </StyledSocialLinks>

      <StyledCredit tabindex="-1">
        <div>
          © {year} Ehsanur Rahman Rhythm. All rights reserved. Designed by {''}
          <a href="https://github.com/bchiang7">Brittany Chiang</a>, enhanced by {''}
          <a href="https://github.com/errhythm">me</a>. <br />
          <TimeCapsuleLink
            href="https://timecapsule.errhythm.me/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8em' }}>
            Visit my old website!
          </TimeCapsuleLink>
        </div>
      </StyledCredit>
    </StyledFooter>
  );
};

export default Footer;
