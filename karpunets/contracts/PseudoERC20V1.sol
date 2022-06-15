//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "hardhat/console.sol";

contract PseudoERC20V1 is IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    string private constant _name = "PseudoERC20";
    string private constant _symbol = "PSEUDO";

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        // not implemented yet
        return 0;
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        // not implemented yet
        return false;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        // not implemented yet
        return false;
    }

    function buy() payable public {
        require(msg.value > 0, 'PseudoERC20: zero msg value');
        _mint(msg.sender, msg.value * 100);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "PseudoERC20: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "PseudoERC20: transfer from the zero address");
        require(to != address(0), "PseudoERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];
        if (fromBalance >= amount) {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }
}