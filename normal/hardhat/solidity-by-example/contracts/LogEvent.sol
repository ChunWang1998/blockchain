// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogEvent {
  event LogHere(address sender, uint256 number);
  function testLogHere(address sender, uint256 number) public {
    emit LogHere(sender, number);
  }
}
