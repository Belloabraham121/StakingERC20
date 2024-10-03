// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.23;


interface IStakeERC20 {
     
     function stakingRewardPool(uint256 _amount) external;

     function stakingERC20(uint256 _amount, uint256 _durationInMinutes) external;

     function withdrawStakedERC20(uint256 _amount) external;

     function calculateReward(address _user) external view returns (uint256);

     function myBalance() external view returns (uint256);

     function getAnyBalance(address _user) external view returns (uint256) ;

     function getContractBalance() external view returns (uint256);

}
