

//jshint ignore: start

// contracts
const contracts = [
  { name: 'HelloMarket' }
];
contracts.forEach(c => c.artifact = artifacts.require('./' + c.name + '.sol'))

// tools for overloaded function calls
const web3Utils = require('web3-utils');

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
  
  let helloMarket,
    alice = accounts[0],
    bob = accounts[1];
  
  const aliceMessage = 'Hello World!';
  const bobMessage = 'Goodbye World!'
  
  it('should be deployed, ' + contracts[0].name, async () => {
    helloMarket = await contracts[0].artifact.deployed();
    assert(helloMarket !== undefined, contracts[0].name + ' was not deployed');
  });
  
  it('should let Alice set the message', async () => {
    const tx = await helloMarket.talk(aliceMessage);
    const message = await helloMarket.message.call();
    assert(message === aliceMessage, 'Alice could not set the message');
  });
  
  it('should NOT let Bob set the message', async () => {
    try {
      const tx = await helloMarket.talk(bobMessage, { from: bob });
      assert(true, 'Bob set the message, should NOT have');
    } catch (e) {
      const message = await helloMarket.message.call();
      assert(message === aliceMessage, 'Bob set the message, should NOT have');
    }
  });
  
  it('should let Bob buy ownership rights by sending value greater than 0', async () => {
    const tx = await helloMarket.buyRights({ from: bob, value: 1 });
    const owner = await helloMarket.owner.call();
    assert(owner === bob, 'Bob could not buy rights');
  });
  
  it('should let Bob set the message', async () => {
    const tx = await helloMarket.talk(bobMessage, { from: bob });
    const message = await helloMarket.message.call();
    assert(message === bobMessage, 'Bob could not set the message');
  });
  
  it('should NOT let Alice set the message', async () => {
    try {
      const tx = await helloMarket.talk(aliceMessage, { from: alice });
      assert(true, 'Alice set the message, should NOT have');
    } catch (e) {
      const message = await helloMarket.message.call();
      assert(message === bobMessage, 'Alice set the message, should NOT have');
    }
  });
  
});

//jshint ignore: end
