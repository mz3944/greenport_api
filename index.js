var express = require('express')
var Web3 = require('web3')
var abi = require('./abi');

var app = express()

app.get('/notes', function(req, res) {
  res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
})

app.listen(3000)





if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}



var coinbase = web3.eth.coinbase;
console.log(web3.eth);
var balance = web3.eth.getBalance(coinbase);
console.log(coinbase);
console.log( balance);
console.log('balance: ' + balance);
console.log(web3.eth.getTransactionCount(coinbase));





var account = '0x40e92f00187f5a48fb09cb1a32c3eae1325fb5e0'; // Dev
var contractAddress = '0x58b671784f4fa6b02e3dcac9f9dd215b66b5669b';

//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

web3.eth.defaultAccount = account;

// Assemble function hashes

console.log(abi.abiArray)

var functionHashes = getFunctionHashes(abi.abiArray);

// Get hold of contract instance

var contract = web3.eth.contract(abi.abiArray).at(contractAddress);
console.dir(contract.getCoinAccount.call());
var coinBalance = contract.getCoinAccount.call();
console.dir('banana: ' + coinBalance);
var banana = contract.buyEnergy.call(0.2);
console.dir('banana: ' + banana);
var banana = contract.owner.call();
console.dir('banana: ' + banana);
var banana = web3.eth.hashrate;
console.dir('banana: ' + banana);
var banana = contract.setRate.call(22);
console.dir('banana: ' + banana);
var banana = web3.eth.hashrate;
console.dir('banana: ' + banana);
var banana = web3.eth.getTransactionCount(coinbase);
console.dir('banana: ' + banana);
// for (var index = 1; index <= web3.eth.blockNumber; index++) {
//   var block = web3.eth.getBlock(index);
//   if (block.transactions.length > 0) {
//     console.log('block #' + block.number);
//     console.log('block transactions count' + block.transactions.length);
//     console.log('block transactions count' + block.transactions[0]);
//   }
// }
var block = web3.eth.getBlock(6);
console.log('block #' + block.number);
console.log('block transactions count' + block.transactions.length);
console.log('block transactions count' + block.transactions[0]);
console.log("ASDA");

// Setup filter to watch transactions

var filter = web3.eth.filter('latest');

filter.watch(function(error, result){
  if (error) return;

  var block = web3.eth.getBlock(result, true);
  console.log('block #' + block.number);

  console.dir(block.transactions);

  for (var index = 0; index < block.transactions.length; index++) {
    var t = block.transactions[index];

    // Decode from
    var from = t.from==account ? "me" : t.from;

    // Decode function
    var func = findFunctionByHash(functionHashes, t.input);

    if (func == 'sellEnergy') {
      // This is the sellEnergy() method
      var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
      console.dir(inputData);
      // $('#transactions').append('<tr><td>' + t.blockNumber +
      //   '</td><td>' + from +
      //   '</td><td>' + "ApolloTrade" +
      //   '</td><td>sellEnergy(' + inputData[0].toString() + ')</td></tr>');
    } else if (func == 'buyEnergy') {
      // This is the buyEnergy() method
      var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
      console.dir(inputData);
      // $('#transactions').append('<tr><td>' + t.blockNumber +
      //   '</td><td>' + from +
      //   '</td><td>' + "ApolloTrade" +
      //   '</td><td>buyEnergy(' + inputData[0].toString() + ')</td></tr>');
    } else {
      // Default log
      // $('#transactions').append('<tr><td>' + t.blockNumber + '</td><td>' + from + '</td><td>' + t.to + '</td><td>' + t.input + '</td></tr>')
    }
  }
});

// Update labels every second

setInterval(function() {

  // Account balance in Ether
  var balanceWei = web3.eth.getBalance(account).toNumber();
  var balance = web3.fromWei(balanceWei, 'ether');
  // $('#label1').text(balance);
  console.dir('Balance: ' + balance);

  // Block number
  var number = web3.eth.blockNumber;
  // if ($('#label2').text() != number)
  //   $('#label2').text(number).effect("highlight");
  console.dir('Block: ' + number);

  // Contract coin balance: call (not state changing)
  var coinBalance = contract.getCoinAccount.call();
  // $('#label3').text(coinBalance);
  console.dir('Contract coin balance: ' + coinBalance);

  // Contract energy balance: call (not state changing)
  var energyBalance = contract.getEnergyAccount.call();
  // $('#label4').text(energyBalance);
  console.dir('Contract energy balance:' + energyBalance);

}, 1000);

// Get function hashes
// TODO: also extract input parameter types for later decoding

function getFunctionHashes(abi) {
  var hashes = [];
  for (var i=0; i<abi.length; i++) {
    var item = abi[i];
    if (item.type != "function") continue;
    var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
    var hash = web3.sha3(signature);
    console.log(item.name + '=' + hash);
    hashes.push({name: item.name, hash: hash});
  }
  return hashes;
}

function findFunctionByHash(hashes, functionHash) {
  for (var i=0; i<hashes.length; i++) {
    if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10))
      return hashes[i].name;
  }
  return null;
}
