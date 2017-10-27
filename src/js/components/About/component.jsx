import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Button from '../Button';
import EmailIcon from '../icons/EmailIcon';
import GithubIcon from '../icons/GithubIcon';
import HeartIcon from '../icons/HeartIcon';
import Link from '../Link';
import RouteWrapper from '../RouteWrapper';
import SectionTitle from '../SectionTitle';
import TwitterIcon from '../icons/TwitterIcon';
import StarIcon from '../icons/StarIcon';
import { SKUS } from '../../helpers/constants';
import styles from './style.scss';
import '../../buy';

class About extends Component {
  static propTypes = {
    location: PropTypes.objectOf(
      PropTypes.string,
    ).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      hasPaidTier: true,
    };
  }

  componentDidMount() {
    // Check for paid tier
    google.payments.inapp.getPurchases({
      parameters: { env: 'prod' },
      success: (data) => {
        const products = data.response.details;
        // Is correct SKU, and is active
        const hasPaidTier = products.some(x => x.sku === SKUS.PAID_TIER && x.state === 'ACTIVE');
        this.setState({ hasPaidTier });
      },
      failure: () => {
        this.setState({ hasPaidTier: false });
      },
    });
  }

  render() {
    const { location } = this.props;
    const { hasPaidTier } = this.state;

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
        <SectionTitle title="Free vs Paid Tier" />
        <p styleName="paragraph">
          The free version of #Clicky is supported by ads, which help to support
          future development of #Clicky.
          Upgrading to the paid tier will completely disable all ads.
        </p>
        {hasPaidTier ? (
          <p styleName="paragraph">
            You&#39;re on the paid tier!
          </p>
        ) : (
          <Button
            onClick={() => {
              chrome.runtime.sendMessage({ type: 'BUY_PAID_TIER' });
            }}
          >
            Upgrade To Paid Tier
          </Button>
        )}
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
      </RouteWrapper>
    );
  }
}

export default CSSModules(About, styles);
