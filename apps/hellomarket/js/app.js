

//jshint ignore: start

const qs = (sel) => document.querySelector(sel);
window.onload = () => App.init();
const toEth = (bn) => Math.round(web3.fromWei(bn) * 10000, 4) / 10000;
const toWei = (eth) => web3.toWei(eth, 'ether');

const App = {
  
  alice:null,
  bob:null,
  
  async init() {
    await HelloMarket.init();
    
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
        const tx = await HelloMarket.contract.talk(qs('#msg-alice').value, {
          from: this.alice
        });
      } catch(e) {
        alert('Whoops, it looks like you are not allowed to do that, try buying the rights to talk!')
      }
      
      const msg = await HelloMarket.contract.message.call();
      console.log(msg);
    }
    
    qs('#talk-bob').onclick = async () => {
      try {
        const tx = await HelloMarket.contract.talk(qs('#msg-bob').value, {
          from: this.bob
        });
      } catch(e) {
        alert('Whoops, it looks like you are not allowed to do that, try buying the rights to talk!')
      }
      const msg = await HelloMarket.contract.message.call();
      console.log(msg);
    }
    
    //buying rights
    qs('#buy-alice').onclick = async () => {
      const tx = await HelloMarket.contract.buyRights({
        from: this.alice,
        value: toWei(qs('#price-alice').value)
      });
      setTimeout(() => this.updateData(), 1000);
    }
    
    qs('#buy-bob').onclick = async () => {
      const tx = await HelloMarket.contract.buyRights({
        from: this.bob,
        value: toWei(qs('#price-bob').value)
      });
      setTimeout(() => this.updateData(), 1000);
    }
  },
  
  async updateData(msg) {
    qs('#msg').innerHTML = msg ? msg : await HelloMarket.contract.message.call();
    qs('#price').innerHTML = toEth(await HelloMarket.contract.price.call());
    if (this.users.length === 1) {
      qs('#owner').innerHTML = await HelloMarket.contract.owner.call();
    } else {
      qs('#owner').innerHTML = (await HelloMarket.contract.owner.call() == this.alice ? 'Alice' : 'Bob');
    }
    //balances
    this.users.forEach(async (name) => {
      web3.eth.getBalance(this[name], (err, res) => qs('#balance-' + name).innerHTML = toEth(res));
    })
  }
  
};

