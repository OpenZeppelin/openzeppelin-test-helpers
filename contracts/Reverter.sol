pragma solidity ^0.5.0;

contract Reverter {
    uint256[] private array;

    function dontRevert() public pure {
    }

    function revertFromRevert() public pure {
        revert();
    }

    function revertFromRevertWithReason() public pure {
        revert("Call to revert");
    }

    function revertFromRequire() public pure {
        require(false);
    }

    function revertFromRequireWithReason() public pure {
        require(false, "Failed requirement");
    }

    function revertFromAssert() public pure {
        assert(false);
    }

    function revertFromOutOfGas() public {
        for (uint256 i = 0; i < 2**200; ++i) {
            array.push(i);
        }
    }
}
