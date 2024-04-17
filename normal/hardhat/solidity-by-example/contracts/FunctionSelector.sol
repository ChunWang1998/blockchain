// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionSelector {
  event Log(bytes data);
  /*
    "transfer(address,uint256)"
    0xa9059cbb
    "transferFrom(address,address,uint256)"
    0x23b872dd
    */
  function getSelector(string calldata _func) external pure returns (bytes4) {
    return bytes4(keccak256(bytes(_func)));
  }

  function transfer(address _to, uint256 _amount) external {
    emit Log(msg.data);
  }
}
