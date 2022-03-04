import { promisify } from 'util';
import crypto from 'crypto';

export const provider = getProvider();

export interface EthereumProvider {
  send(method: string, params?: unknown[]): Promise<unknown>;
}

function getProvider(): EthereumProvider {
  if ('hre' in global) {
    const { network } = require('hardhat') as typeof import('hardhat');
    return network.provider;
  } else if ('config' in global) {
    const { provider } = (global as any).config;
    const sendAsync = ('sendAsync' in provider ? provider.sendAsync : provider.send).bind(provider);
    const send = promisify(sendAsync);
    return {
      async send(method: string, params: unknown[]) {
        const id = crypto.randomBytes(4).toString('hex');
        const { result, error } = await send({ jsonrpc: '2.0', method, params, id });
        if (error) {
          throw new Error(error.message);
        } else {
          return result;
        }
      },
    };
  } else {
    throw new Error('Could not detect either Hardhat or Truffle');
  }
}
