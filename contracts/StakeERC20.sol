// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakeERC20 {
    address owner;
    address tokenAddress;
    mapping(address => uint256) balances;

    struct Users {
        address user;
        uint256 amount;
        uint256 duration;
        bool isDone;
    }

    mapping(address => Users) users;

    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    event DepositSuccessful(address indexed _user, uint256 indexed _amount);
    event WithdrawSuccessful(address indexed _user, uint256 indexed _amount);
    event TransferSuccessful(address indexed _user, address _to, uint256 indexed _amount);
    event StakeSuccessful(address indexed _user, uint256 indexed _amount, uint256 duration);

    function stakingRewardPool(uint256 _amount) external onlyOwner {
        require(msg.sender != address(0), "Zero address detected");
        require(_amount > 0, "Zero can't be deposited");

        uint256 _tokenAddressBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        require(_tokenAddressBalance >= _amount, "Insufficient funds");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        balances[address(this)] += _amount;
    }

    function stakingERC20(uint256 _amount, uint256 _durationInMinutes) external {
        require(msg.sender != address(0), "Zero address detected");
        require(_amount > 0, "Zero can't be staked");
        require(_durationInMinutes > 0, "Duration can't be set to zero");

        uint256 _tokenAddressBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        require(_tokenAddressBalance >= _amount, "Insufficient funds");

        Users storage user = users[msg.sender];
        require(user.amount == 0, "You can only stake once"); // Check if the user has already staked

        uint256 durationInSeconds = _durationInMinutes * 60;

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        user.user = msg.sender;
        user.amount = _amount;
        user.duration = block.timestamp + durationInSeconds;
        user.isDone = false;

        balances[msg.sender] += _amount;

        emit StakeSuccessful(msg.sender, _amount, _durationInMinutes);
    }

    function withdrawStakedERC20(uint256 _amount) external {
        require(msg.sender != address(0), "Zero address detected");
        require(_amount > 0, "Zero can't be withdrawn");

        Users storage user = users[msg.sender];
        require(block.timestamp >= user.duration, "Staking period not completed");
        require(!user.isDone, "ERC20 already withdrawn");
        require(user.amount >= _amount, "Insufficient staked amount");

        uint256 reward = calculateReward(msg.sender);

        uint256 totalAmount = _amount + (reward * _amount / user.amount);
        require(balances[address(this)] >= totalAmount, "Insufficient reward pool");

        user.amount -= _amount;
        if (user.amount == 0) {
            user.isDone = true;
        }
        balances[address(this)] -= totalAmount;

        IERC20(tokenAddress).transfer(msg.sender, totalAmount);

        emit WithdrawSuccessful(msg.sender, totalAmount);
    }

    function calculateReward(address _user) private view returns (uint256) {
        Users memory user = users[_user];

        uint256 duration = block.timestamp - user.duration;
        // 10% annualized interest
        uint256 reward = (user.amount * duration * 10) / (365 * 1440 * 100);

        return reward;
    }

    function myBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function getAnyBalance(address _user) external view returns (uint256) {
        return balances[_user];
    }

    function getContractBalance() external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}
