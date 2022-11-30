// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "erc721a/contracts/ERC721A.sol";

contract MerkleProofsDemo is Ownable, ERC721A {
  bytes32 public rootHash;

  constructor(bytes32 _rootHash) ERC721A("Alchemists", "GOLD") {
    setRootHash(_rootHash);
  }

  function mint(uint256 _quantity, bytes32[] calldata _proof) external payable {
    if (!_verifyProof(msg.sender, _proof)) {
      revert InvalidProof();
    }
    _safeMint(msg.sender, _quantity);
  }

  function setRootHash(bytes32 _rootHash) public onlyOwner {
    rootHash = _rootHash;
  }

  function _verifyProof(address _addr, bytes32[] calldata _proof)
    internal
    view
    returns (bool _isValid)
  {
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(_addr))));
    _isValid = MerkleProof.verify(_proof, rootHash, leaf);
  }

  error InvalidProof();
}
