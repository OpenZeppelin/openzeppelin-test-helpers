module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*', // eslint-disable-line camelcase
    },
  },

  compilers: {
    solc: {
      version: '0.5.4',
    },
  },
};
