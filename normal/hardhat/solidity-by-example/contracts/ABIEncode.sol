// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
  function transfer(address, uint256) external;
}

contract Token {
  function transfer(address, uint256) external {}
}

contract AbiEncode {
  function test(address _contract, bytes calldata data) external {
    (bool ok, ) = _contract.call(data);
    require(ok, "call failed");
  }

  function encodeWithSignature(address to, uint256 amount) external pure returns (bytes memory) {
    // Typo is not checked - "transfer(address, uint)"
    // -> uint will still pass
    return abi.encodeWithSignature("transfer(address,uint256)", to, amount);
  }

  function encodeWithSelector(address to, uint256 amount) external pure returns (bytes memory) {
    // Type is not checked - (IERC20.transfer.selector, true, amount)
    // -> (IERC20.transfer.selector, amount) still pass
    return abi.encodeWithSelector(IERC20.transfer.selector, to, amount);
  }

  function encodeCall(address to, uint256 amount) external pure returns (bytes memory) {
    // Typo and type errors will not compile
    // -> safest way to encode
    return abi.encodeCall(IERC20.transfer, (to, amount));
  }
}
