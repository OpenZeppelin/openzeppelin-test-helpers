const { setWeb3Provider } = require('./src/config/web3');
const { setEnvironment } = require('./src/config/environment');

let loadedConfig;

function configure (config) {
  if (!config) {
    // if there already is a loaded config keep it
    if (!loadedConfig) {
      defaultConfigure();
      loadedConfig = 'default';
    }
  } else {
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
