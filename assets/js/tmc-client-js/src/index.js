try {
  /* eslint-disable global-require */
  require('fetch-polyfill');
  require('babel-polyfill');
  /* eslint-enable global-require */
} catch (e) {
  console.warn('Could not require some of the dependencies.');
}

import TmcClient from './tmc-client';

export default TmcClient;
