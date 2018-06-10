# Hello Market

Hello Market is a Truffle and Frontend tutorial series for Introduction to Solidity, Ethereum and Decentralized Applications

## Installation

You will need to install the following tools globally
- concurrently
- livereload
- nws

And make sure you have these installed globally
- truffle
- ganache-cli

## Running Tests

You should be able to run tests by entering the truffle development console using:
```
truffle develop
// ... let console initialize ...
test
```
That should run the `test/hellomarket.js` and `test/hellomarkettoken.js` tests.

## Running the Frontend (locally)

In one console, enter the truffle development console, but this time run

`migrate --reset`

This will push your contracts to the local truffle ganache-cli blockchain that's running in the background.

In another console you can run the local webserver using `npm start`.

If you run into a watch exception ENOSPC (because the web server is using livereload) you can fix this by running `npm run watch`.

Now you should be able to go to

`http://localhost:3030/apps/hellomarket/`
or
`http://localhost:3030/apps/hellomarkettoken/`

And interact with the contract.

## Deploy and run remotely

This is a bit more tricky.

You will have to deploy your contracts to a test network.

For contracts using inheritence, you simply include all dependent contracts in the order of the inheritance in one file in the Remix editor and deploy using MetaMask from Remix directly.

You would compile the contract and then under the run tab, using "injected web3" you would deploy.

Pay for the transaction and wait for a contract address to be returned.

From there you can use Remix to interact with your contract, or go to the frontend.

But... you will need to tell the frontend to use your contract, and double check your MetaMask is still on the same test network.

Under `apps/` in both `hellomarket` and `hellomarkettoken` there is a `js` folder and files by the same name.

Each file has at the top of it:

```
const config = {
  host: 'http://127.0.0.1:9545/',
  //contractAddress:'0xa4ba9dd25fa9e7a6701058e10285a92c9bec7a63',
  contractAddress:null
}
```
You will need to change the contract address to your contract address that you deployed on the test network.

Don't worry about host, your injected web3 should put you on the right network and set the right web3 provider in your JS environment.

Happy coding!
