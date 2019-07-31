# Changelog

## 0.4.2 (2019-07-31)
 * Upgraded web3-utils and truffle-contract dependencies to use the stable web3 release. ([#65](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/65))

## 0.4.1 (2019-07-26)
 * Added support for web3 ^1.2.0 (included by truffle v5.0.29). ([#63](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/63))

## 0.4.0 (2019-05-23)
 * Fixed `shouldFail.reverting.withMessage` on non-Ganache chains. ([#25](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/25))
 * Fixed `send.transaction` not working on contracts with a fallback function. ([#26](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/26))
 * Made `shouldFail.reverting.withMessage` fail if no error string was provided. ([#28](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/28))
 * Renamed `makeInterfaceId` to `makeInterfaceId.ERC165`, and added `makeInterfaceId.ERC1820`. ([#21](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/21))
 * Added possibility to configure a custom web3 instance. ([#38](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/38))
 * Replaced `shouldFail` with `expectRevert`, with an improved API. ([#39](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/39))
 * Fixed detection of Ganache pre-releases (such as those used by Ganache GUI v2.0.1). ([#46](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/46))

#### How to upgrade from 0.3
- Change all occurences of `makeInterfaceId` to `makeInterfaceId.ERC165`.
- The `shouldFail` module has been renamed to `expectRevert`, and `reverting.withMessage` is now the main module export.

| 0.3                                | 0.4                          |
| ---------------------------------- | ---------------------------- |
| `shouldFail.reverting.withMessage` | `expectRevert`               |
| `shouldFail.reverting`             | `expectRevert.unspecified`   |
| `shouldFail.throwing`              | `expectRevert.invalidOpcode` |
| `shouldFail.outOfGas`              | `expectRevert.outOfGas`      |

## 0.3.2 (2019-04-10)
 * Updated ERC1820Registry address. ([#26](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/26))

## 0.3.1 (2019-04-01)
 * Added support for environments using `web3-provider-engine`. ([#24](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/24))

## 0.3.0 (2019-03-19)
 * `chai` is no longer exported, and `should` is no longer automatically installed. ([#18](https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/18))

#### How to upgrade from 0.2
If you use Chai assertions in your project you should make sure to explicitly install it: `npm install chai`. If you need to access the `chai` instance you should now get it through `require('chai')`. If you use `should`-style assertions you should set it up manually now, by adding `require('chai/register-should')` in your tests, or e.g. in your Truffle config. Check out OpenZeppelin's upgrade commit in case it might be helpful: [`cf7375d`](https://github.com/OpenZeppelin/openzeppelin-solidity/commit/cf7375d6b873afc9f705e329db39e2ef389af9d2).
