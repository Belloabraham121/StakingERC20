import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StakingEtherModule = buildModule("StakingEtherModule", (m) => {

    

    const StakingEther = m.contract("StakingEther");

    return { StakingEther };
});

export default StakingEtherModule;

// MebellieModule#Mcbellie - 0xF8e4687cd0841852A809Be3Bd8Ba9d8a3a59c91e
// StakeERC20Module#StakeERC20 - 0x4286a2618e30dD84790E5DE19279ECDce0E8F811
// StakingEtherModule#StakingEther - 0xC3d9e8De686d3D956B0A66044e384B1E77792325