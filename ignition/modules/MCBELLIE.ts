import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const McbellieModule = buildModule("MebellieModule", (m) => {

    const erc20 = m.contract("Mcbellie");

    return { erc20 };
});

export default McbellieModule;

// MebellieModule#Mcbellie - 0xF8e4687cd0841852A809Be3Bd8Ba9d8a3a59c91e