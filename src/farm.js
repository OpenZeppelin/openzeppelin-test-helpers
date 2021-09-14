const { contract } = require('@openzeppelin/test-environment');

// Setup Farm Contracts
const BananaTokenBuild = require('../build-apeswap/farm/contracts/BananaToken.json');
const BananaToken = contract.fromABI(BananaTokenBuild.abi, BananaTokenBuild.bytecode);
const BananaSplitBarBuild = require('../build-apeswap/farm/contracts/BananaSplitBar.json');
const BananaSplitBar = contract.fromABI(BananaSplitBarBuild.abi, BananaSplitBarBuild.bytecode);
const MasterApeBuild = require('../build-apeswap/farm/contracts/MasterApe.json');
const MasterApe = contract.fromABI(MasterApeBuild.abi, MasterApeBuild.bytecode);


/**
 * @typedef {Object} FarmDetails
 * @property {Contract} bananaToken The deployed BananaToken contract.
 * @property {Contract} bananaSplitBar The deployed BananaSplitBar contract.
 * @property {Contract} masterApe The deployed MasterApe contract.
 */

/**
 * Deploy a mock farm.
 *
 * @param {Array(string)} accounts Pass in the accounts array provided from @openzeppelin/test-environment
 * @returns {FarmDetails} 
 */
async function deployMockFarm([owner, feeTo]) {
    // Setup BananaToken
    const INITIAL_MINT = '25000' + '000000000000000000';
    const bananaToken = await BananaToken.new({ from: owner });
    await bananaToken.mint(owner, INITIAL_MINT, { from: owner });
    // Setup BananaSplitBar
    const bananaSplitBar = await BananaSplitBar.new(feeTo, { from: owner });

    // Setup MasterApe
    const masterApe = await MasterApe.new(
        bananaToken.address,
        bananaSplitBar.address,
        feeTo, // Dev fee getter
        '10' + '000000000000000000', // BANANA per block
        0, // Starting block number
        1, // multiplier
        { from: owner }
    );

    return {
        bananaToken,
        bananaSplitBar,
        masterApe,
    }
}

/**
 * Add tokens to farms with an allocation of 100.
 *
 * @param {Array(string)} accounts Pass in the accounts array provided from @openzeppelin/test-environment
 * @param {Contract} masterApe MasterApe contract to add pairs to
 * @param {Array(string)} dexPairs Array of pairs to add to the MasterApe
 */
async function addPoolsToFarm([owner], masterApe, dexPairs = []) {
    const BASE_ALLOCATION = 100;
    for (const dexPair of dexPairs) {
        await masterApe.add(BASE_ALLOCATION, dexPair.address, false, {from: owner});
    } 
}

module.exports = { deployMockFarm, addPoolsToFarm }
