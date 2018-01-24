var express = require('express')
var Web3 = require('web3')
var abi = require('./abi');

var adminAddress = '0x951803ab7fba9e8f9d6c3ac06b1fd2400e56d0bf';
var contractAddress = '0x6bCfd6181a6A4C9C9ad243637A43337058bbC64f';

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.defaultAccount = adminAddress;
var contract = web3.eth.contract(abi.abiArray).at(contractAddress);

// RESTful API

var app = express();
app.listen(3000);

// General getters

app.get('/name', function(req, res) {
  res.json(contract.name.call());
})
app.get('/total_supply', function(req, res) {
  res.json(contract.totalSupply.call());
})
app.get('/decimals', function(req, res) {
  res.json(contract.decimals.call());
})
app.get('/users', function(req, res) {
  res.json(contract.users.call());
})
app.get('/balances', function(req, res) {
  res.json(contract.balances.call());
})
app.get('/number_of_users', function(req, res) {
  res.json(contract.numberOfUsers.call())
})
app.get('/symbol', function(req, res) {
  res.json(contract.symbol.call());
})
app.get('/delta_credit_award_factor', function(req, res) {
  res.json(contract.deltaCreditAwardFactor.call());
})
app.get('/registration_credits', function(req, res) {
  res.json(contract.registrationCredits.call());
})

// General setters

app.get('/delta_credit_award_factor/:factor', function(req, res) {
  var factor = req.params.factor;
  res.json(contract.setDeltaCreditAwardFactor.call(factor));
})
app.get('/user/assign_credits', function(req, res) {
  res.json(contract.assignCredits.call());
})
app.get('/registration_credits/:amount', function(req, res) {
  var amount = req.params.amount;
  res.json(contract.setRegistrationCreditsAmount.call(amount));
})

// User getters.

app.get('/user/:address/balance', function(req, res) {
  var address = req.params.address;
  res.json(contract.balanceOf.call(address));
})

// User setters

app.get('/user/:address/register', function(req, res) {
  var address = req.params.address;
  res.json(contract.registerNewUser.call(address));
})
app.get('/user/:address/transfer?toAddress=:toAddress&amount=:amount', function(req, res) {
  var fromAddress = req.params.address;
  var toAddress = req.params.toAddress;
  var amount = req.params.amount;
  res.json(contract.transfer.call(toAddress, amount, fromAddress));
})
app.get('/user/:address/admin?set=:set', function(req, res) {
  var set = req.params.set;
  res.json(contract.appointAdministrator.call(address, set))
})
app.get('/user/:address/pos_vals?amount=:amount', function(req, res) {
  var address = req.params.address;
  var amount = req.params.amount;
  res.json(contract.positiveValues.call(address, amount))
})
app.get('/user/:address/neg_vals?amount=:amount', function(req, res) {
  var address = req.params.address;
  var amount = req.params.amount;
  res.json(contract.negativeValues.call(address, amount))
})
app.get('/user/:address/make_owner', function(req, res) {
  var address = req.params.address;
  res.json(contract.transferOwnership.call(address))
})
