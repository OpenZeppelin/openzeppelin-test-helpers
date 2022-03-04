require('ts-node/register');

process.env.DEVENV = 'truffle';

module.exports = {
  contracts_directory: 'test-contracts',
  compilers: {
    solc: {
      version: '0.8.11',
    },
  },
  mocha: {
    timeout: 5000,
  },
};
