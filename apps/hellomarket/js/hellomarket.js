

//jshint ignore: start

//Kovan Address: 0xa4ba9dd25fa9e7a6701058e10285a92c9bec7a63

const config = {
  host: 'http://127.0.0.1:9545/',
  contractAddress:'0xa4ba9dd25fa9e7a6701058e10285a92c9bec7a63'
}

const HelloMarket = {
  
  contractName: 'HelloMarket',
  contract: null,
  currentUser: null,
  block: null,
  /**************************************
  * initializing the contract
  **************************************/
  async init() {
    console.log(this.contractName + ' initialized');
    Helpers.getWeb3(config.host);
    this.block = 0;
    //this.block = web3.eth.blockNumber(console.log);
    web3.eth.getAccounts((err, accounts) => {
      this.currentUser = accounts[0];
    });
    const json = await fetch('../../build/contracts/' + this.contractName + '.json').then((res) => res.json());
    this.contract = await Helpers.getContract(json, config.contractAddress);
    this.setEventListeners();
  },
  /**************************************
  * event listeners
  **************************************/
  setEventListeners() {
    const { contract, block } = this;
    const event = contract.allEvents({ fromBlock: block, toBlock: 'latest' });
    event.watch((err, res) => {
      if (err) console.log('watch error', err);
      if (this[res.event] && typeof this[res.event] === 'function') this[res.event](res);
    });
  },
  //events
  async Talk({ args }) {
    App.updateData(args._message);
  }
};
