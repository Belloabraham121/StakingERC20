import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { token } from "../typechain-types/factories/@openzeppelin/contracts";
import { StakeERC20__factory } from "../typechain-types";

describe ("StakeERC20", function(){
  async function deployStakeERC20Fixture() {
    const [owner, account, account1, account2] = await ethers.getSigners();
    
    // Pass the ERC20 Mcbellie contract name
    const Mcbellie = await ethers.getContractFactory("Mcbellie");
    // 
    const token = await Mcbellie.deploy();
    
    // Pass the contract name
    const StakeERC20 = await ethers.getContractFactory("StakeERC20");

    // Deploy the contract passing the NFT contract address
    const stakeERC20 = await StakeERC20.deploy(token);
    return { stakeERC20, token, owner, account, account1, account2};
  }

   describe("Deployment", function () {
    it("Should check owner and token address", async function () {
      const { stakeERC20, owner, token } = await loadFixture(deployStakeERC20Fixture);
      
      // Check if owner == owner and token address == token address
      expect(await stakeERC20.owner()).to.equal(owner);
      expect(await stakeERC20.tokenAddress()).to.equal(token);
    });

    describe("Staking ERC20", function () {
    it("Should revert if address zero is detected", async function () {
      const { stakeERC20, owner } = await loadFixture(deployStakeERC20Fixture);
      
      // Create a fake signer with address zero
      const zeroAddressSigner = await ethers.getImpersonatedSigner(ethers.ZeroAddress);
      
      // Fund the zero address signer
      await owner.sendTransaction({
        to: ethers.ZeroAddress,
        value: ethers.parseEther("1.0")  // Send 1 ETH
      });

      // Attempt to call testZeroAddressCheck from the zero address
      await expect(stakeERC20.connect(zeroAddressSigner).testZeroAddressCheck())
        .to.be.revertedWith("address zero found");
    });

    it("Should revert if amount is zero", async function () {
      const { stakeERC20, owner, token, account } = await loadFixture(deployStakeERC20Fixture);

      // const tsfAmount = ethers.parseUnits("10000", 18);

      // await token.transfer(account, tsfAmount);

      // const stakeAmount = ethers.parseUnits("100", 18)

      await expect(stakeERC20.connect(account).stakingERC20(0, 2))
      .to.be.revertedWith("Zero can't be staked")
    })

    it("Should revert if time is zero", async function () {
      const { stakeERC20, owner, token, account } = await loadFixture(deployStakeERC20Fixture);

      // const tsfAmount = ethers.parseUnits("10000", 18);

      // await token.transfer(account, tsfAmount);

      // const stakeAmount = ethers.parseUnits("100", 18)

      await expect(stakeERC20.connect(account).stakingERC20(2, 0))
      .to.be.revertedWith("Duration can't be set to zero")
    })

    it("Should revert with 'Insufficient funds' if balance is less than staking amount", async function() {
      const { stakeERC20, token, account } = await loadFixture(deployStakeERC20Fixture);

      // Set up: Give the account some tokens, but less than what we'll try to stake
      const initialBalance = ethers.parseUnits("50", 18);
      await token.transfer(account, initialBalance);

      // Approve the StakeERC20 contract to spend tokens
      await token.connect(account).approve(await stakeERC20, ethers.parseUnits("100", 18));

      // Try to stake more than the account's balance
      const stakeAmount = ethers.parseUnits("100", 18);
      await expect(stakeERC20.connect(account).stakingERC20(stakeAmount, 60))
        .to.be.revertedWith("Insufficient funds");
    });

    it("Should revert if user tries to stake more than once", async function () {
      const { stakeERC20, token, account } = await loadFixture(deployStakeERC20Fixture);

      
      const initialBalance = ethers.parseUnits("100", 18);
      await token.transfer(account, initialBalance);


      await token.connect(account).approve(await stakeERC20, ethers.parseUnits("100", 18));

      const stakeAmount = ethers.parseUnits("50", 18);
      await stakeERC20.connect(account).stakingERC20(stakeAmount, 60)
      await expect(stakeERC20.connect(account).stakingERC20(stakeAmount, 60))
      .to.be.revertedWith("You can only stake once")
        
    })

    it("Should stake ERC20", async function () {
      const { stakeERC20, token, account } = await loadFixture(deployStakeERC20Fixture);

      
      const amount = ethers.parseUnits("100", 18);
      await token.transfer(account, amount);


      await token.connect(account).approve(stakeERC20, ethers.parseUnits("100", 18));

      const stakeAmount = ethers.parseUnits("50", 18)
      await stakeERC20.connect(account).stakingERC20(stakeAmount, 60)
    
        
    })

    it("Should emit  StakeSuccessful", async function () {
      const { stakeERC20, token, account } = await loadFixture(deployStakeERC20Fixture);

      
      const amount = ethers.parseUnits("100", 18);
      await token.transfer(account, amount);


      await token.connect(account).approve(stakeERC20, ethers.parseUnits("100", 18));

      const stakeAmount = ethers.parseUnits("50", 18)
      await expect(stakeERC20.connect(account).stakingERC20(stakeAmount, 60))
      .to.emit(stakeERC20, "StakeSuccessful")
      .withArgs(account, stakeAmount, 60)
        
    })
  });
  })


  
})