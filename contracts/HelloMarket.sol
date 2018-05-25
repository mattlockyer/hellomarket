

//jshint ignore: start

pragma solidity ^0.4.21;


import './Owner.sol';


contract HelloMarket is Owner {
  
  uint256 public price;
  string public message;
  
  constructor() public {
    owner = msg.sender;
  }
  
  event Talk(string _message, address _from);
  
  function talk(string _message) public onlyOwner {
    message = _message;
    emit Talk(_message, msg.sender);
  }
  
  function buyRights() payable public returns (bool) {
    if (msg.value > price) {
        owner = msg.sender;
        price = msg.value;
        return true;
    }
    return false;
  }
}
  
