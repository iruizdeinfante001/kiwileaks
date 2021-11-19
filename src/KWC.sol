// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @author Iker Ruiz de Infante Gonzalez (iruizdeinfante001@ikasle.ehu.eus)
/// @title Kiwicoin
/**
 * @notice Contract created for the Ethereum programming course
 * of the Blockchain Technology and Cryptocurrencies master's degree
 * at the University of the Basque Country.
 */
contract KWC is ERC20 {
    constructor() ERC20("Kiwicoin token", "KWC") {
        _mint(msg.sender, 21000000 * 10**uint(decimals()));
    }
}
