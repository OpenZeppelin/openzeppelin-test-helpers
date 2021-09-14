const { accounts, contract } = require('@openzeppelin/test-environment');

// Setup DEX Contracts
const ApeFactoryBuild = require('../build-apeswap/dex/contracts/ApeFactory.json');
const ApeFactory = contract.fromABI(ApeFactoryBuild.abi, ApeFactoryBuild.bytecode);
const ApePairBuild = require('../build-apeswap/dex/contracts/ApePair.json');
const ApePair = contract.fromABI(ApePairBuild.abi, ApePairBuild.bytecode);

// Setup Token Contracts
const ERC20MockBuild = require('../build-apeswap/token/contracts/ERC20Mock.json');
const ERC20Mock = contract.fromABI(ERC20MockBuild.abi, ERC20MockBuild.bytecode);


/**
 * @typedef {Object} DexDetails
 * @property {Contract} dexFactory The deployed ApeFactory contract.
 * @property {Contract} mockWBNB The deployed MockWBNB contract.
 * @property {Array(Contract)} mockTokens Array of deployed mock token contracts.
 * @property {Array(Contract)} dexPairs Array of deployed pair token contracts.
 */

/**
 * Deploy a mock dex.
 *
 * @param {Array(string)} accounts Pass in the accounts array provided from @openzeppelin/test-environment
 * @param {number} numPairs Number of pairs to create
 * @returns {DexDetails} 
 */
// NOTE: Currently does not create a BANANA/WBNB pair
async function deployMockDex([owner, feeTo, alice], numPairs = 2) {
    const BASE_BALANCE = String(1000 * 1e18);
    // Setup DEX factory
    dexFactory = await ApeFactory.new(feeTo, { from: owner });

    // Setup pairs
    const mockWBNB = await ERC20Mock.new('Wrapped Native', 'WNative', { from: owner });
    const mockTokens = [];
    const dexPairs = [];
    for (let index = 0; index < numPairs; index++) {
        const mockToken = await ERC20Mock.new(`Mock Token ${index}`, `MOCK${index}`, { from: owner });

        // Mint pair tokens
        await mockWBNB.mint(BASE_BALANCE, { from: owner });
        await mockToken.mint(BASE_BALANCE, { from: owner });

        // Create an initial pair
        await dexFactory.createPair(mockWBNB.address, mockToken.address);
        const pairCreated = await ApePair.at(await dexFactory.allPairs(index));

        // Obtain LP Tokens
        await mockWBNB.transfer(pairCreated.address, BASE_BALANCE, { from: owner });
        await mockToken.transfer(pairCreated.address, BASE_BALANCE, { from: owner });
        await pairCreated.mint(alice);

        dexPairs.push(pairCreated);
        mockTokens.push(mockToken);
    }

    return {
        dexFactory,
        mockWBNB,
        mockTokens,
        dexPairs
    }
}

module.exports = { deployMockDex }
