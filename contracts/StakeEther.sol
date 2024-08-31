// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract StakingEther {
    address owner;

    struct Users {
        address user;
        uint256 amount;
        uint256 duration;
        bool isDone;
    }

    mapping (address => Users) users;
    mapping (address => uint) balances;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function stakingRewardPool() external onlyOwner payable {
        require(msg.value > 0, "Can't deposit zero into the pool");
        balances[address(this)] += msg.value;
    }

    function stakingEther(uint256 _durationInMinutes) external payable {
        require(msg.sender != address(0), "Address zero detected");
        require(msg.value > 0, "Can't deposit zero into the pool");
        require(_durationInMinutes > 0, "Duration can't be set to zero");

        Users storage user = users[msg.sender];
        require(user.amount == 0, "You can only stake once"); // Check if the user has already staked

        uint256 durationInSeconds = _durationInMinutes * 60;

        user.user = msg.sender;
        user.amount = msg.value; // Set the amount (since it's the first time staking)
        user.duration = block.timestamp + durationInSeconds;
        user.isDone = false;

        balances[msg.sender] += msg.value;
    }

    function withdrawStakedEther(uint _amount) external {
        require(_amount > 0, "Can't withdraw zero");

        Users storage user = users[msg.sender];
        require(block.timestamp >= user.duration, "Staking period not completed");
        require(!user.isDone, "Ether already withdrawn");
        require(user.amount >= _amount, "Insufficient staked amount");

        uint256 reward = calculateReward(msg.sender);

        uint256 totalAmount = _amount + (reward * _amount / user.amount);
        require(balances[address(this)] >= totalAmount, "Insufficient reward pool");

        user.amount -= _amount; // Deduct the withdrawn amount from the user's balance
        if (user.amount == 0) {
        user.isDone = true; // Mark as withdrawn if the user has no remaining balance
    }
    balances[address(this)] -= totalAmount;

    (bool sent, ) = msg.sender.call{value: totalAmount}("");
    require(sent, "Failed to withdraw Ether");
}


    function calculateReward(address _user) private view returns (uint) {
        Users memory user = users[_user];

        uint256 duration = block.timestamp - user.duration;
        // Example reward calculation: 10% annualized interest

        uint256 reward = (user.amount * duration * 10) / (365 * 1440 * 100);

        return reward;
    }

    function getContractBalance() external view onlyOwner returns (uint) {
        return address(this).balance;
    }

    function myBalance() external view returns (uint) {
        return users[msg.sender].amount;
    }

    function myBalance1() external view returns (uint, uint) {
    Users memory user = users[msg.sender];
    uint reward = calculateReward(msg.sender);
    return (user.amount, reward);
}

}
