import type {} from '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { lazyObject } from 'hardhat/plugins';
import type { ContractFactory } from 'ethers';

export function factory(name: string) {
  let f: ContractFactory | undefined;

  before(`load factory (${name})`, async function () {
    f = await ethers.getContractFactory(name);
  });

  return lazyObject(() => {
    if (f === undefined) {
      throw Error('Used factory outside of test');
    }
    return f;
  });
}
