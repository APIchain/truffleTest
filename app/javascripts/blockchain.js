// Ethereum javascript libraries needed
let logger = require('./logger').logger
var Web3 = require('web3')
var Tx = require('ethereumjs-tx')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
// Create an async function so I can use the "await" keyword to wait for things to finish
// const main = async () => {
exports.sendAsset = function (destAddress, transferAmount) {
  // destAddress, transferAmount
  // Who holds the token now?
  var myAddress = `0xa210Fb4Dc50dA7078015C10C3b2ec424Ca80A335`
  // Who are we trying to send this token to?
  // var destAddress = `0x00388aC2b00A280A2Fa46dEa7dd2E313e825685d`
  // var transferAmount = 1
  // Determine the nonce
  var count = web3.eth.getTransactionCount(myAddress)
  logger.info(`num transactions so far: ${count}`)
  var abiArray = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "total",
          "type": "uint256"
        }
      ],
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "remaining",
          "type": "uint256"
        }
      ],
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    }
  ]
  // The address of RNT
  var contractAddress = `0xFF603F43946A3A28DF5E6A73172555D8C8b02386`
  var contract = web3.eth.contract(abiArray).at(contractAddress)
  // How many tokens do I have before sending?
  var balance = contract.balanceOf(myAddress)
  logger.info(`Balance before send: ${balance} \n------------------------`);
  var data = contract.transfer.getData(destAddress, transferAmount, {from: myAddress});
  var gasPrice = web3.toHex(web3.eth.gasPrice)
  // web3.fromDecimal(gasPriceGwei * 1e9)
  var gasLimit = web3.toHex(3000000)
  var rawTransaction = {
    "from": myAddress,
    "nonce": web3.toHex(count),
    "gasPrice": gasPrice,
    "gasLimit": gasLimit,
    "to": contractAddress,
    "value": "0x0",
    "data": data,
    "chainId": 0x01
  }
  logger.info(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`)
  // The private key for myAddress in .env
  var privKey = new Buffer(`57ef251ea07ef8fc9c4b4ac8fea0a75a135ee728f538b0e42baf0f46ad47e652`, 'hex')
  var tx = new Tx(rawTransaction)
  tx.sign(privKey)
  var serializedTx = tx.serialize()
  logger.info(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`)
  // web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
  //   if (!err) {
  //     logger.info(`transaction hash=`, hash, `to=`, destAddress, `amount=`, transferAmount)
  //   } else {
  //     logger.info(err)
  //   }
  // })
}
// main()
