const { setWeb3Provider } = require('./src/configure-web3');
const { setEnvironment } = require('./src/configure-environment');

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
  setWeb3Provider.default();
  setEnvironment.default();
}

function customConfigure (config) {
  defaultConfigure();

  if ('provider' in config) {
    // The provider may be either an URL to an HTTP endpoint, or a complete provider object
    setWeb3Provider(config.provider);
  }

  if ('environment' in config) {
    setEnvironment(config.environment);
  }
}

module.exports = configure;
