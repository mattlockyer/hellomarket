

//jshint ignore: start

pragma solidity ^0.4.21;

import './Owner.sol';

contract SimpleToken is Owner {
  
  uint256 public totalSupply;
  mapping(address => uint256) public balances;
  
  //token functions
  function mint(address _to, uint256 _amount) public onlyOwner returns (bool) {
    totalSupply += _amount;
    balances[_to] += _amount;
    return true;
  }
  
  function transfer(address _to, uint256 _amount) public returns (bool) {
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] -= _amount;
    balances[_to] += _amount;
    return true;
  }
}