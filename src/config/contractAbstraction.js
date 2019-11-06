const { setEnvironment, getEnvironment } = require('./environment');

module.exports = {
  setContractAbstraction: setEnvironment,
  getContractAbstraction: getEnvironment,
};
