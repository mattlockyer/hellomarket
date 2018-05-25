

//jshint ignore: start

pragma solidity ^0.4.21;

contract HelloMarket {
  
  address public owner;
  uint256 public price;
  string public message;
  
  constructor() public {
    owner = msg.sender;
  }
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
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
  
