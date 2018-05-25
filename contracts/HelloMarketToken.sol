

//jshint ignore: start

pragma solidity ^0.4.21;

contract HelloMarketToken {
  
  address public owner;
  string public message;
  
  //token data
  uint256 public talkFund;
  uint256 public totalSupply;
  mapping(address => uint256) public balances;
  
  //hello market functions
  constructor() public {
    owner = msg.sender;
  }
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
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

/**************************************
* TODO
*
* Advanced version where you can transfer the ownership and drain the fund
*
* Inheritence Version, break up contracts and refactor
*
* NFT Version with multiple message tokens that can be owned
**************************************/
  
