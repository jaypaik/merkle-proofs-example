import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {StandardMerkleTree} from "@openzeppelin/merkle-tree";
import {expect} from "chai";
import {ethers} from "hardhat";

const OTHER_ADDRESSES = [
  "0x0000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000002",
  "0x0000000000000000000000000000000000000003",
  "0x0000000000000000000000000000000000000004",
  "0x0000000000000000000000000000000000000005",
  "0x0000000000000000000000000000000000000006",
  "0x0000000000000000000000000000000000000007",
  "0x0000000000000000000000000000000000000008",
  "0x0000000000000000000000000000000000000009",
  "0x0000000000000000000000000000000000000010",
];

describe("MerkleProofsDemo", function () {
  async function deployContractFixture() {
    const [owner] = await ethers.getSigners();
    const MerkleProofsDemo = await ethers.getContractFactory(
      "MerkleProofsDemo",
    );
    const tree = generateMerkleTree([owner.address, ...OTHER_ADDRESSES]);
    const contract = await MerkleProofsDemo.deploy(tree.root);
    return {
      contract,
      owner,
      tree,
    };
  }

  function generateMerkleTree(addresses: string[]) {
    return StandardMerkleTree.of(
      addresses.map((address) => [address.toLowerCase()]),
      ["address"],
    );
  }

  describe("Mint", function () {
    it("Should mint given quantity for a valid proof", async function () {
      const {owner, contract, tree} = await loadFixture(deployContractFixture);
      const proof = tree.getProof([owner.address]);
      const quantity = 2;
      await contract.mint(quantity, proof);
      expect(await contract.balanceOf(owner.address)).to.equal(quantity);
    });
  });
});
