import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StakeERC20Module = buildModule("StakeERC20Module", (m) => {

    const tokenAddress = "0xF8e4687cd0841852A809Be3Bd8Ba9d8a3a59c91e" 

    const stakeERC20 = m.contract("StakeERC20", [tokenAddress]);

    return { stakeERC20 };
});

export default StakeERC20Module;

// MebellieModule#Mcbellie - 0xF8e4687cd0841852A809Be3Bd8Ba9d8a3a59c91e
// StakeERC20Module#StakeERC20 - 0x4286a2618e30dD84790E5DE19279ECDce0E8F811