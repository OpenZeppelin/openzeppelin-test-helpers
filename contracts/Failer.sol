pragma solidity ^0.4.24;

contract Failer {
    uint256[] private array;

    function dontFail() public pure {
    }

    function failWithRevert() public pure {
        revert();
    }

    function failWithThrow() public pure {
        assert(false);
    }

    function failWithRevertReason() public pure {
        revert("Doomed to fail");
    }

    function failWithOutOfGas() public {
        for (uint256 i = 0; i < 2**200; ++i) {
            array.push(i);
        }
    }

    function failRequirement() public pure {
        require(false);
    }

    function failRequirementWithReason() public pure {
        require(false, "Unsatisfied");
    }
}
