import type { HardhatUserConfig } from 'hardhat/config';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-web3';

process.env.DEVENV = 'hardhat';

export default <HardhatUserConfig> {
  paths: {
    sources: 'test-contracts',
  },
  solidity: '0.8.11',
};
