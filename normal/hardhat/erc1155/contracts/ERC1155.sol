// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract Erc1155Base is ERC1155, Ownable, ERC1155Supply {
    uint256 public constant MAX_SUPPLY = 10000;
    mapping(uint256 => uint256) public totalNFTSupply;
    string public ipfsString = "ipfs://bafybeicvazv5jzf2k7gpmxzz4k7g4rxsfdtw54j2ylfbhg3zhcsp7wxxxy/1.json";

    string public name = "example name";

    constructor(address initialOwner) ERC1155(ipfsString) Ownable(initialOwner) {}

    function mintNFT(address account, uint256 id, uint256 amount, bytes memory data) public {
        require(totalNFTSupply[id] + amount <= MAX_SUPPLY, "exceed max balance");
        _mint(account, id, amount, data);
        totalNFTSupply[id] += amount;
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}
