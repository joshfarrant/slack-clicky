# #Clicky for Slack

\#Clicky is a Chrome Extension designed to make sharing a link to Slack as quick and easy as possible. Share your current page to a Slack channel or user in a single click!

\#Clicky can also be found in the [Chrome Store!](https://chrome.google.com/webstore/detail/clicky-for-slack/bllgmdlgbbmijcoecbnmgeoekhebgmac)

## Manual Installation

\#Clicky can be installed either from the Chrome Store as above, or manually from this repo.

After cloning this repo, create a config file in the following format:

```js
export default {
  slack: {
    clientId: 'SLACK_CLIENT_ID',
    clientSecret: 'SLACK_CLIENT_SECRET',
    redirectUri: 'https://CHROME_EXTENSION_ID.chromiumapp.org',
    scope: 'identify,read,post,client',
  },
};
```

Finally, just run.

```
yarn
yarn start
```

Once installed you can then load \#Clicky into Chrome as an unpacked extension from the extensions page in settings (chrome://extensions/).

## Usage

Once installed, launch the extension in Chrome and follow the instructions to get set up.

## BrowserStack

BrowsersStack gives you instant access to all real mobile and desktop browsers completely within your web browser. #Clicky is proud to use BrowserStack to test functionality in older versions of Chrome, as well as Opera and Firefox. We are also looking at the possibility of porting #Clicky to Safari. BrowserStack will make this much easier by giving us the ability to test in multiple versions of Safari as we're developing.

If you've never tried BrowserStack then I definitely recommend giving it a try at [browserstack.com](https://www.browserstack.com/).

![BrowserStack](./assets/browserstack.png)