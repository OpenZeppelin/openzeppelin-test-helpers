const { setWeb3Provider } = require('./src/config/web3');
const { setContractAbstraction } = require('./src/config/contractAbstraction');
const { setSingletonsConfig } = require('./src/config/singletons');

const { deprecate } = require('util');

let configLoaded = false;

function configure (config) {
  if (!config) {
    // If there is a config already loaded keep it
    if (!configLoaded) {
      defaultConfigure();
      configLoaded = true;
    }
  } else {
    customConfigure(config);
    configLoaded = true;
  }
};

function defaultConfigure () {
  setWeb3Provider.default();
  setContractAbstraction.default();
  setSingletonsConfig.default();
}

function customConfigure (config) {
  defaultConfigure();

  if ('provider' in config) {
    // The provider may be either an URL to an HTTP endpoint, or a complete provider object
    setWeb3Provider(config.provider);
  }

  if ('contractAbstraction' in config) {
    setContractAbstraction(config.contractAbstraction);

  } else if ('environment' in config) {
    deprecate(
      () => setContractAbstraction(config.environment),
      'The \'environment\' configuration option is deprecated, use \'contractAbstraction\' instead.'
    )();
  }

  if ('singletons' in config) {
    setSingletonsConfig(config.singletons);
  }
}

module.exports = configure;
