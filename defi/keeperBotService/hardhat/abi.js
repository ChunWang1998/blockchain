module.exports = {
  cometAbi: [
    "event Supply(address indexed from, address indexed dst, uint256 amount)",
    "function supply(address asset, uint amount)",
    "function withdraw(address asset, uint amount)",
    "function balanceOf(address account) returns (uint256)",
    "function borrowBalanceOf(address account) returns (uint256)",
    "function collateralBalanceOf(address account, address asset) external view returns (uint128)",
  ],
  wethAbi: [
    "function deposit() payable",
    "function balanceOf(address) returns (uint)",
    "function approve(address, uint) returns (bool)",
    "function transfer(address, uint)",
  ],
  stdErc20Abi: [
    "function approve(address, uint) returns (bool)",
    "function transfer(address, uint)",
    "function balanceOf(address) returns (uint)",
  ],
};
