

//jshint ignore: start

const qs = (sel) => document.querySelector(sel);
window.onload = () => App.init();
const toEth = (bn) => Math.round(web3.fromWei(bn) * 10000, 4) / 10000;
const toWei = (eth) => web3.toWei(eth, 'ether');

const App = {
  
  alice:null,
  bob:null,
  
  async init() {
    await HelloMarketToken.init();
    
    const { accounts } = web3.eth;
    this.users = ['alice'];
    this.alice = accounts[0];
    
    if (accounts.length === 1) {
      qs('#bob').style.display = 'none';
    } else {
      this.users.push('bob');
      this.bob = accounts[1];
    }
    
    this.updateData();
    this.setEventListeners();
  },
  
  setEventListeners() {
    //setting the message
    qs('#talk-alice').onclick = async () => {
      try {
        const tx = await HelloMarketToken.contract.talk(qs('#msg-alice').value, {
          from: this.alice
        });
      } catch(e) {
        alert('Whoops, it looks like you are not allowed to do that, try buying the rights to talk!')
      }
      
      const msg = await HelloMarketToken.contract.message.call();
      console.log(msg);
    }
    
    qs('#talk-bob').onclick = async () => {
      try {
        const tx = await HelloMarketToken.contract.talk(qs('#msg-bob').value, {
          from: this.bob
        });
      } catch(e) {
        alert('Whoops, it looks like you are not allowed to do that, try buying the rights to talk!')
      }
      const msg = await HelloMarketToken.contract.message.call();
      console.log(msg);
    }
    
    //minting tokens
    qs('#mint').onclick = async () => {
      const tx = await HelloMarketToken.contract.mint(this.alice, qs('#mint-amount').value, {
        from: this.alice,
      });
      qs('#mint-amount').value = ''; //clear immediately
      setTimeout(() => this.updateData(), 1000);
    }
    
    qs('#transfer').onclick = async () => {
      const tx = await HelloMarketToken.contract.transfer(qs('#transfer-to').value, qs('#transfer-amount').value, {
        from: this.alice,
      });
      qs('#transfer-amount').value = ''; //clear immediately
      setTimeout(() => this.updateData(), 1000);
    }
    
  },
  
  async updateData(msg) {
    qs('#msg').innerHTML = msg ? msg : await HelloMarketToken.contract.message.call();
    qs('#total').innerHTML = await HelloMarketToken.contract.totalSupply.call();
    qs('#fund').innerHTML = await HelloMarketToken.contract.talkFund.call();
    //balances
    this.users.forEach(async (name) => {
      web3.eth.getBalance(this[name], (err, res) => qs('#balance-' + name).innerHTML = toEth(res));
      qs('#tokens-' + name).innerHTML = (await HelloMarketToken.contract.balances.call(this[name]));
    })
  }
  
};

