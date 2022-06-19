//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Proxy {
    address public implementation;
    address public owner;

    constructor(address _implementation) {
        implementation = _implementation;
        owner = msg.sender;
    }

    function setImplementation(address _implementation) external {
        require(msg.sender == owner);
        implementation = _implementation;
    }

    function _delegate(address _imp) internal virtual {
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), _imp, 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return (0, returndatasize())
            }
        }
    }

    fallback() external payable {
        _delegate(implementation);
    }
}

contract TokenV1 {
    string public name = "Khomin Token";
    string public symbol = "KHT";

    // BUG: should be uint256
    int256 public totalSupply = 1000;

    mapping(address => int256) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, int256 amount) external {
//        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) public view returns (int256) {
        return balances[account];
    }
}

contract TokenV2 {
    string public name = "Khomin Token";
    string public symbol = "KHT";

    uint256 public totalSupply = 1000;

    mapping(address => uint256) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}
