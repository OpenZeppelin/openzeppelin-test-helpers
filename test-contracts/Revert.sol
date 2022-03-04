// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Revert {
    uint public k;

    function revertWithoutReason() public {
        k++; // not pure
        revert();
    }

    function revertWithStringReason(string memory reason) public {
        k++; // not pure
        revert(reason);
    }

    error CustomError(uint x, string b);

    function revertWithCustomError() public {
        k++; // not pure
        revert CustomError(42, "the answer");
    }

    function outOfGas() public {
        while (true) {
            k++;
        }
    }
}
