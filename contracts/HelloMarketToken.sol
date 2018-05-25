

//jshint ignore: start

pragma solidity ^0.4.21;

import './SimpleToken.sol';

contract HelloMarketToken is SimpleToken {
  
  string public message;
  
  //token data
  uint256 public talkFund;
  
  //hello market functions
  constructor() public {
    owner = msg.sender;
  }
  
  event Talk(string _message, address _from);
  
  //modified talk function
  function talk(string _message) public {
    require(balances[msg.sender] >= 100);
    balances[msg.sender] -= 100;
    talkFund += 100;
    message = _message;
    emit Talk(_message, msg.sender);
  }
  
}

/**************************************
* TODO
*
* Advanced version where you can transfer the ownership and drain the fund
*
* Inheritence Version, break up contracts and refactor
*
* NFT Version with multiple message tokens that can be owned
**************************************/
  
