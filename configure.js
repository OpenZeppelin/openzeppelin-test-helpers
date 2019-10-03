const { setWeb3Provider } = require('./src/config/web3');
const { setEnvironment } = require('./src/config/environment');

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
