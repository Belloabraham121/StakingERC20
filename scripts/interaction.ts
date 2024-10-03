import { ethers } from "hardhat";

async function main() {

    const [owner] = await ethers.getSigners()

    // Set token address and get the interface
    const TokenAddress = "0xF8e4687cd0841852A809Be3Bd8Ba9d8a3a59c91e";
    const token = await ethers.getContractAt("IERC20", TokenAddress);

    // Set multisig factory address and get the interface
    const StakeERC20ContractAddress = "0x4286a2618e30dD84790E5DE19279ECDce0E8F811";
    const stakeERC20 = await ethers.getContractAt("IStakeERC20", StakeERC20ContractAddress);

    // Transfer tokens to the StakeERC20 contract
    const transferAmount = ethers.parseUnits("1000", 18);
    const approveTx = await token.connect(owner).approve(StakeERC20ContractAddress, transferAmount);
    await approveTx.wait();
    console.log("Approval transaction:", approveTx.hash);

    
//     // Set the qurom and the valid signers
//     const quorum = 2;
//     const validSigners = [owner, signer1, signer2]

//     // Deploy the multisig clones, set the quorum and valid signers
//     const deployMultisigClones = await Multisig.createMultisigWallet(quorum, validSigners );
//     deployMultisigClones.wait()
    
//     const getClones = await Multisig.getMultiSigClones()


//     const getFirstClones=  await getClones[0];
//     console.log("Get first clone ::", getFirstClones);

//     const multisig = await ethers.getContractAt("IMultisig", getFirstClones)


//     const transferToken = await token.transfer(multisig, ethers.parseUnits("1000", 18))
//     transferToken.wait()
    
//     const transfarAmount = ethers.parseUnits("10",18)
//     const transferTx = await multisig.transfer(transfarAmount, signer2, token);
//     transferTx.wait();
    

//     await multisig.connect(signer1).approveTx(7)
    
//     const recipientBalance = await token.balanceOf(signer1);
//     console.log("Check recipient balance after approving transfer ::", recipientBalance);
    
//     const newQurom = 2
//     const Qurom = await multisig.updateNewQuorum(newQurom);
//     Qurom.wait()
//     console.log("New quorum ::", Qurom);


//     const approveQurom = await multisig.connect(signer1).approveNewQuorum(4);
//     console.log("Approve qurom update ::", approveQurom);
    

    

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});