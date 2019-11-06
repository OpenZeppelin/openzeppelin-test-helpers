const { setEnvironment, getEnvironment } = require('./src/config/environment');

module.exports = {
  setContractAbstraction: setEnvironment,
  getContractAbstraction: getEnvironment,
};
