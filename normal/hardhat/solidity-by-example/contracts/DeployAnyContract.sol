// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeployAnyContractProxy {
  event Deploy(address);

  // when we call other contract, another contract may send some eth back
  receive() external payable {}

  function deploy(bytes memory _code) external payable returns (address addr) {
    assembly {
      // create(v, p, n)
      // v = amount of ETH to send (callvalue() is msg.value in assembly)
      // p = pointer in memory to start of code
      // (the actual code starts after 32 bytes(size of code), 0x20: hex 32, )
      // n = size of code(store in the first 32 bytes)
      addr := create(callvalue(), add(_code, 0x20), mload(_code))
    }
    // return address 0 on error
    require(addr != address(0), "deploy failed");

    emit Deploy(addr);
  }

  function execute(address _target, bytes memory _data) external payable {
    (bool success, ) = _target.call{ value: msg.value }(_data);
    require(success, "failed");
  }
}

contract TestContract1 {
  address public owner = msg.sender;

  function setOwner(address _owner) public {
    require(msg.sender == owner, "not owner");
    owner = _owner;
  }
}

contract TestContract2 {
  address public owner = msg.sender;
  uint256 public value = msg.value;
  uint256 public x;
  uint256 public y;

  constructor(uint256 _x, uint256 _y) payable {
    x = _x;
    y = _y;
  }
}

contract Helper {
  function getBytecode1() external pure returns (bytes memory) {
    bytes memory bytecode = type(TestContract1).creationCode;
    return bytecode;
  }

  function getBytecode2(uint256 _x, uint256 _y) external pure returns (bytes memory) {
    bytes memory bytecode = type(TestContract2).creationCode;
    // append input to bytecode
    return abi.encodePacked(bytecode, abi.encode(_x, _y));
  }

  // tell solidity to call setOwner()
  function getCalldata(address _owner) external pure returns (bytes memory) {
    return abi.encodeWithSignature("setOwner(address)", _owner);
  }
}
