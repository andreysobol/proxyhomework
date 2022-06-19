//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract Contract2 is ERC20Upgradeable {

    mapping(address => uint) public balances;

    function initialize() initializer public {
        __ERC20_init("Contract1", "CTR12");
    }

    function deposit() public payable {
        balances[msg.sender] = msg.value;
    }

    function withdraw() public {
        uint balance = balances[msg.sender];

        require(balance > 0);

        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: balance}("");
        if (!success) {
            balances[msg.sender] = balance;
            revert("Failed to send Ether");
        }
    }

    function balance() public view returns(uint) {
        return address(this).balance;
    }
}