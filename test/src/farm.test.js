const { accounts, contract } = require('@openzeppelin/test-environment');
const { farm, dex } = require('../../index');
const { expect, assert } = require('chai');


describe('MasterApe', function () {
    const [owner, feeTo, alice, bob, carol] = accounts;

    beforeEach(async () => {
        const {
            bananaToken,
            bananaSplitBar,
            masterApe,
        } = await farm.deployMockFarm(accounts); // accounts passed will be used in the deployment
        this.masterApe = masterApe;
    });

    it('should have proper pool length', async () => {
        assert.equal((await this.masterApe.poolLength()).toString(), '1');
    });
});