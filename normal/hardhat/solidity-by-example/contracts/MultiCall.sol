// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultiCall {
  function multiCall(address[] calldata targets, bytes[] calldata data) external view returns (bytes[] memory) {
    require(targets.length == data.length, "target length != data length");

    bytes[] memory results = new bytes[](data.length);

    for (uint256 i; i < targets.length; i++) {
      // use staticcall since this function is "view" function(it's just a query function)
      // if you want to send tx, use call
      (bool success, bytes memory result) = targets[i].staticcall(data[i]);
      require(success, "call failed");
      results[i] = result;
    }

    return results;
  }
}

contract TestMultiCall {
  function test1() external view returns (uint, uint) {
    return (1, block.timestamp);
  }
  function test2() external view returns (uint, uint) {
    return (1, block.timestamp);
  }

  function getData1() external pure returns (bytes memory) {
    return abi.encodeWithSelector(this.test1.selector);
  }

  function getData2() external pure returns (bytes memory) {
    return abi.encodeWithSelector(this.test2.selector);
  }
}
