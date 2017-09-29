import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import EmailIcon from '../icons/EmailIcon';
import GithubIcon from '../icons/GithubIcon';
import HeartIcon from '../icons/HeartIcon';
import Link from '../Link';
import RouteWrapper from '../RouteWrapper';
import SectionTitle from '../SectionTitle';
import TwitterIcon from '../icons/TwitterIcon';
import StarIcon from '../icons/StarIcon';
import styles from './style.scss';

const About = ({ location }) => {
  const links = {
    donate: (
      <Link
        href="https://monzo.me/joshuafarrant?d=Cheers%20for%20%23Clicky!%20%F0%9F%8D%BB"
      >Buy me a coffee</Link>
    ),
    email: (
      <Link
        href="mailto:josh@farrant.me"
      >josh@farrant.me</Link>
    ),
    github: (
      <Link
        href="https://github.com/joshfarrant/slack-clicky"
      >GitHub</Link>
    ),
    monero: (
      <Link
        href="https://coinhive.com/#hash-rate"
      >Monero</Link>
    ),
    personal: (
      <Link
        href="https://josh.farrant.me"
      >Josh Farrant</Link>
    ),
    twitter: (
      <Link
        href="https://twitter.com/farpixel"
      >@FarPixel</Link>
    ),
    website: (
      <Link
        href="https://josh.farrant.me"
      >josh.farrant.me</Link>
    ),
  };

  return (
    <RouteWrapper location={location}>
      <SectionTitle title="About #Clicky" />
      <p styleName="paragraph" >
        #Clicky is an open-source project built and
        maintained by {links.personal} and can be
        found on {links.github}.
      </p>
      <p styleName="paragraph">
        If you have any questions, comments, or feedback
        then get in touch by tweeting {links.twitter} or
        emailing {links.email}.
      </p>
      <SectionTitle title="Love #Clicky?" />
      <p styleName="paragraph">
        Want to actively help support the development
        of #Clicky? {links.donate}!
      </p>
      <SectionTitle title="Links" />
      <ul styleName="link-list">
        <li styleName="link-item">
          <GithubIcon styleName="icon" />
          {links.github}
        </li>
        <li styleName="link-item">
          <TwitterIcon styleName="icon" />
          {links.twitter}
        </li>
        <li styleName="link-item">
          <EmailIcon styleName="icon" />
          {links.email}
        </li>
        <li styleName="link-item">
          <StarIcon styleName="icon" dark />
          {links.website}
        </li>
        <li styleName="link-item">
          <HeartIcon styleName="icon" dark />
          {links.donate}
        </li>
      </ul>
      <SectionTitle title="Supporting #Clicky" />
      <p styleName="paragraph">
        #Clicky is built and maintained in my spare time. I&#39;ve
        never charged for it and I don&#39;t ever want to. I&#39;d
        love to keep on improving #Clicky indefinitely and getting
        the word out to as many people as possible, as I believe
        it&#39;s a genuinely useful tool; hopefully you do too!
      </p>
      <p styleName="paragraph">
        Rather than selling your data to advertisers or serving
        you ads, #Clicky instead utilizes a tiny bit of your
        background computing power to mine {links.monero}. All
        this means is that, in the background, #Clicky is performing
        a few difficult calculations to generate a tiny amount of
        Monero. This allows you to support #Clicky without any
        noticiable impact.
      </p>
      <p styleName="paragraph">
        At the moment this is just an experiment, and it only
        runs if you&#39;re not running on battery. If you have
        any questions or concerns, please do get in touch; I&#39;d
        love to chat about this!
      </p>
    </RouteWrapper>
  );
};

About.propTypes = {
  location: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
};

export default CSSModules(About, styles);
