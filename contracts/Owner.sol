

//jshint ignore: start

pragma solidity ^0.4.21;

contract Owner {
  
  address public owner;
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
  function transferOwnership(address _to) public onlyOwner {
    owner = _to;
  }
  
}