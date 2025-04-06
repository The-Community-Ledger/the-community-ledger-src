// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";


contract JournalCredit is ERC20, Ownable {
    address public minter;

    constructor(uint256 initialSupply) ERC20("JournalCredit", "JCR") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Not authorized to mint");
        _mint(to, amount);
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function getMinter() external view returns (address) {
        return minter;
    }
}

interface IJCRMinter {
    function getMinter() external view returns (address);
    function mint(address to, uint256 amount) external;
}