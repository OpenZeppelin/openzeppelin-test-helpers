let singletonsConfig;

const defaultGas = 6e6;
const defaultSender = '';

function setSingletonsConfig (config) {
  singletonsConfig = config;
}

function setDefaultSingletonsConfig () {
  setSingletonsConfig({ defaultGas, defaultSender });
}

function getSingletonsConfig () {
  return singletonsConfig;
}

setSingletonsConfig.default = setDefaultSingletonsConfig;

module.exports = {
  setSingletonsConfig,
  getSingletonsConfig,
};
