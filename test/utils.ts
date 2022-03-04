export const env = getDevEnv();

export const gasLimit = env === 'hardhat' ? 'gasLimit' : 'gas';

export function factory(contractName: string) {
  if (env === 'hardhat') {
    const { factory } = require('../src/hardhat-ethers') as typeof import('../src/hardhat-ethers');
    const f = factory(contractName);
    return {
      deploy: async (...args: any[]) => f.deploy(...args),
    };
  } else if (env === 'truffle') {
    const f = (global as any).artifacts.require(contractName);
    return {
      deploy: async (...args: any[]) => f.new(...args),
    };
  } else {
    throw new Error('Unknown dev env');
  }
}

function getDevEnv() {
  const env = process.env.DEVENV;
  if (env !== 'hardhat' && env !== 'truffle') {
    throw new Error('Missing env var DEVENV');
  }
  return env;
}
