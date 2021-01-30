var NeuroIPFS = artifacts.require("./NeuroIPFS.sol");
var bs58 = require("bs58");
var web3 = require('web3-utils');
var ld = require('lodash');
var bsv = require('bsv');

function getIpfsHashFromBytes32(bytes32Hex1) {
  // Add our default ipfs values for first 2 bytes: function:0x12=sha2, size:0x20=256 bits and cut off leading "0x"
  const hashHex = "1220" + bytes32Hex1.toString().slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex');
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}

function GetValue(obj1, dataToRetrieve) {
  return dataToRetrieve
    .split('.') // split string based on `.`
    .reduce(function(o, k) {
      return o && o[k]; // get inner property if `o` is defined else get `o` and return
    }, obj1) // set initial value as object
}





contract("NeuroIPFS", function(accounts) {
  	var ipfs;

//**********************************************************************************************
// insertRecord()from training data
//**********************************************************************************************
const iused = 0
var igas = 0
it("it inserts observation from Training_Data_1", function() {
  return NeuroIPFS.deployed().then(function(instance) {
    var fs = require("fs");
    var text = fs.readFileSync("/Users/SaiBatchu/Desktop/training_data.txt").toString('utf-8');
    var textByLine = text.split("\n");
    var arrayLength = textByLine.length;
    console.log("CONTRACT CONTAINS".concat(" ", arrayLength.toString(10), " ", "ENTRIES"));
    for (var i = 0; i < arrayLength; i++) {
        var fields = textByLine[i].split("\t");
        console.log("inserted:".concat( "[ ", fields[0], " ", fields[1], " ", fields[2], " ", fields[3], " ", fields[4], " ", fields[5], " ]"));
        instance.insertRecord(fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]);
        const igas = instance.insertRecord.estimateGas(fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]);
        console.log(Number(igas));
    }
    return instance;
  }).then(function() {

        const iused = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`insert uses approximately ${Math.round(iused * 100) / 100} MB`);

      });
});
const qgas = 0
it("testing retrieval function ", function() {
  return NeuroIPFS.deployed().then(function(instance) {
  ipfs = instance;
  return ipfs.retrieveRecord.call("GBM", "306", "BCNU");

  }).then(function(structArray) {
        var structNumber = ld.size(structArray);
        for (var i = 0; i < structNumber; i++){
          console.log(ld.pick(structArray[i], ['ipfsHash']));
          var hexHash = GetValue(structArray[i], 'ipfsHash');
          console.log(getIpfsHashFromBytes32(hexHash));
        }
        //console.log(structArray);
        //var hash = getIpfsHashFromBytes32(ld.pick(structArray[0], ['ipfsHash']));
        console.log("ipfs hash for [GBM  306  BCNU]");
        const qused = (process.memoryUsage().heapUsed / 1024 / 1024) - iused;
        console.log(`query used ${Math.round(qused * 100) / 100} MB`);
    });
});

});
