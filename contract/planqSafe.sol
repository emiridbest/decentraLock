// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PlanqSafe {
    struct TokenBalance {
        uint256 planqBalance;
        uint256 depositTime;
    }

    mapping(address => TokenBalance) public balances;
    uint256 public lockDuration = 1 weeks;
    address private constant PLANQ_TOKEN_ADDRESS = address(0);

    event Deposited(address indexed depositor, uint256 amount);
    event Withdrawn(address indexed withdrawer, uint256 amount);

    receive() external payable {
        deposit(msg.value);
    }

    function deposit(uint256 amount) public {
        require(amount > 0, "PLANQ deposit amount must be greater than 0");
        TokenBalance storage planqBalance = balances[msg.sender];
        planqBalance.planqBalance += amount;
        planqBalance.depositTime = block.timestamp;
        emit Deposited(msg.sender, amount);
    }

    function timeSinceDeposit(address depositor) public view returns (uint256) {
        return block.timestamp - balances[depositor].depositTime;
    }

    function canWithdraw(address depositor) public view returns (bool) {
        TokenBalance storage tokenBalance = balances[depositor];
        return (
            (tokenBalance.planqBalance > 0 &&
                timeSinceDeposit(depositor) >= lockDuration)
        );
    }

    function withdraw() public {
        require(
            canWithdraw(msg.sender),
            "Cannot withdraw before lock duration or no tokens deposited"
        );

        TokenBalance storage tokenBalance = balances[msg.sender];
        uint256 amount;
        amount = tokenBalance.planqBalance;
        tokenBalance.planqBalance = 0;
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getBalance(address account) public view returns (uint256) {
        TokenBalance storage tokenBalance = balances[account];

        return tokenBalance.planqBalance;
    }
}
