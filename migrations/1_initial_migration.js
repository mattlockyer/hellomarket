

var Migrations = artifacts.require("./Migrations.sol");
var HelloMarket = artifacts.require("./HelloMarket.sol");
var HelloMarketToken = artifacts.require("./HelloMarketToken.sol");

module.exports = function(deployer) {
  deployer.deploy(HelloMarket);
  deployer.deploy(HelloMarketToken);
  deployer.deploy(Migrations);
};
