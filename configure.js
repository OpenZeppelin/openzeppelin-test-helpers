const { setWeb3 } = require('./src/configure-web3');

const Web3 = require('web3');

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
  setWeb3(new Web3(DEFAULT_PROVIDER_URL));
}

function customConfigure (config) {
  // The provider may be either an URL to an HTTP endpoint, or a complete provider object
  setWeb3(new Web3(config.provider));
}

module.exports = configure;
