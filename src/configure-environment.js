/* global web3 */

let environment;

function setEnvironment (env) {
  environment = env;
}

setEnvironment.truffle = () => setEnvironment('truffle');
setEnvironment.web3 = () => setEnvironment('web3');

function setDefaultEnvironment () {
  // If there is a (truffle-injected) global web3 instance, assume we're in a truffle environment
  if (typeof web3 !== 'undefined') {
    setEnvironment.truffle();
  } else {
    setEnvironment.web3();
  }
}

function getEnviroment () {
  if (environment === null) {
    throw new Error('Runtime environment is not configured');
  }

  return environment;
}

setEnvironment.default = setDefaultEnvironment;

module.exports = {
  setEnvironment,
  getEnviroment,
};
