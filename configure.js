const { setWeb3Provider } = require('./src/configure-web3');

const DEFAULT_PROVIDER_URL = 'http://localhost:7545';

let loadedConfig;

function configure (config) {
  if (!config) {
    // if there already is a loaded config keep it
    if (!loadedConfig) {
      defaultConfigure();
      loadedConfig = 'default';
    }
  } else {
    if (loadedConfig) {
      let errorMessage = 'Cannot configure openzeppelin-test-helpers a second time.';

      if (loadedConfig === 'default') {
        errorMessage += `

A configuration has been loaded by default. Make sure to do custom configuration before importing the library.

    require('openzeppelin-test-helpers/configure')({ provider: ... });
    const { expectEvent } = require('openzeppelin-test-helpers');

`;
      }

      throw new Error(errorMessage);
    }

    customConfigure(config);
    loadedConfig = 'custom';
  }
};

function defaultConfigure () {
  // If there is a (truffle-injected) global web3 instance, use that. Otherwise, use the default provider
  if (typeof web3 !== 'undefined') {
    setWeb3Provider(web3.currentProvider);
  } else {
    setWeb3Provider(DEFAULT_PROVIDER_URL);
  }
}

function customConfigure (config) {
  // The provider may be either an URL to an HTTP endpoint, or a complete provider object
  setWeb3Provider(config.provider);
}

module.exports = configure;
