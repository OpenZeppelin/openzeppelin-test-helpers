/* global web3 */

const { setWeb3 } = require('./src/configure-web3');

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

    require('openzeppelin-test-helpers/configure')({ web3: ... });
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
  if (typeof web3 === 'undefined') {
    throw new Error(`Cannot find a global Web3 instance. Please configure one manually:

    require('openzeppelin-test-helpers/configure')({ web3: ... });

`
    );
  }

  // use global web3
  setWeb3(web3);
}

function customConfigure (config) {
  setWeb3(config.web3);
}

module.exports = configure;
