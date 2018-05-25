

//jshint ignore: start

// contracts
const contracts = [
  { name: 'HelloMarketToken' }
];
contracts.forEach(c => c.artifact = artifacts.require('./' + c.name + '.sol'))

// tools for overloaded function calls
//const web3Utils = require('web3-utils');

/**************************************
* Helpers
**************************************/

const logEvent = (func) => {
  const event = func({ _from: web3.eth.coinbase }, { fromBlock: 0, toBlock: 'latest' });
  event.watch(function(error, result){
    console.log(' * ' + result.event);
    if (result.args._from) console.log(result.args._from);
    if (result.args._to) console.log(result.args._to);
    if (result.args._tokenId) console.log(result.args._tokenId.toNumber());
    if (result.args._nftpContract) console.log(result.args._nftpContract);
    if (result.args._nftpTokenId) console.log(result.args._nftpTokenId.toNumber());
    if (result.args._data) console.log(result.args._data);
  });
}
const promisify = (inner) => new Promise((resolve, reject) =>
  inner((err, res) => {
    if (err) { reject(err) }
    resolve(res);
  })
);
const getBalance = (account, at) => promisify(cb => web3.eth.getBalance(account, at, cb));
const timeout = ms => new Promise(res => setTimeout(res, ms))

/**************************************
* Tests
**************************************/

contract(contracts[0].name, function(accounts) {
  
  let helloMarketToken,
    alice = accounts[0],
    bob = accounts[1];
  
  const aliceMessage = 'Hello World!';
  const bobMessage = 'Goodbye World!'
  
  it('should be deployed, ' + contracts[0].name, async () => {
    helloMarketToken = await contracts[0].artifact.deployed();
    assert(helloMarketToken !== undefined, contracts[0].name + ' was not deployed');
  });
  
  it('should NOT let Alice set the message', async () => {
    try {
      const tx = await helloMarketToken.talk(aliceMessage, { from: alice });
      assert(true, 'Alice set the message, should NOT have');
    } catch (e) {
      const message = await helloMarketToken.message.call();
      assert(message === '', 'Alice set the message, should NOT have');
    }
  });
  
  it('should let Alice (owner) mint tokens, for herself', async () => {
    const tx = await helloMarketToken.mint(alice, 1000);
    const balance = await helloMarketToken.balances.call(alice);
    assert(balance.equals(1000), 'Alice could not mint tokens');
  });
  
  it('should let Alice set the message', async () => {
    const tx = await helloMarketToken.talk(aliceMessage);
    const message = await helloMarketToken.message.call();
    assert(message === aliceMessage, 'Alice could not set the message');
  });
  
  it('should have decremented Alice\'s tokens', async () => {
    const balance = await helloMarketToken.balances.call(alice);
    assert(balance.equals(900), 'Alice\'s balance was not decremented after talking');
  });
  
  it('should NOT let Bob set the message', async () => {
    try {
      const tx = await helloMarketToken.talk(bobMessage, { from: bob });
      assert(true, 'Bob set the message, should NOT have');
    } catch (e) {
      const message = await helloMarketToken.message.call();
      assert(message === aliceMessage, 'Bob set the message, should NOT have');
    }
  });
  
  // it('should let Alice transfer tokens to Bob', async () => {
  //   const tx = await helloMarketToken.transfer(bob, 400, { from: alice });
  //   const balance = await helloMarketToken.balances.call(bob);
  //   assert(balance.equals(400), 'Alice could not transfer tokens to Bob');
  // });
  
  
  it('should let Alice transfer minting power to bob', async () => {
    const tx = await helloMarketToken.transferOwnership(bob, { from: alice });
    const owner = await helloMarketToken.owner.call();
    assert(owner === bob, 'Alice could not transfer ownership to Bob');
  });
  
  
  it('should let Bob (owner) mint tokens, for herself', async () => {
    const tx = await helloMarketToken.mint(bob, 400, { from:bob });
    const balance = await helloMarketToken.balances.call(bob);
    assert(balance.equals(400), 'Alice could not mint tokens');
  });
  
  it('should let Bob set the message', async () => {
    const tx = await helloMarketToken.talk(bobMessage, { from: bob });
    const message = await helloMarketToken.message.call();
    assert(message === bobMessage, 'Bob could not set the message');
  });
  
  it('should have decremented Bob\'s tokens', async () => {
    const balance = await helloMarketToken.balances.call(bob);
    assert(balance.equals(300), 'Bob\'s balance was not decremented after talking');
  });
  
  
});

//jshint ignore: end
