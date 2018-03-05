let icoRoot_artifact = require('../../build/contracts/IcoRoot.json')
let Web3 = require('web3')
let contract = require('truffle-contract')
let IcoRoot = contract(icoRoot_artifact)
let logger = require('./logger').logger
let http = require('http')

exports.catchEvent = function () {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  };
// Bootstrap the MetaCoin abstraction for Use.
  IcoRoot.setProvider(web3.currentProvider)
  web3.eth.filter('latest').watch(function (log) {
    let heightOptions = {
      'method': 'POST',
      'hostname': '127.0.0.1',
      'port': '20334',
      'path': '/height',
      'headers': {
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
    let heightReq = http.request(heightOptions, function (res) {
      let chunks = []
      res.on('data', function (chunk) {
        chunks.push(chunk)
      })
      res.on('end', function () {
        let body = Buffer.concat(chunks)
        console.log(body.toString())
      })
    })
    heightReq.write(JSON.stringify({ Height: web3.eth.blockNumber }))
    heightReq.end()
  })
  IcoRoot.deployed().then(function (instance) {
    instance.Order({}, { fromBlock:0, toBlock:'latest' }).watch(function (error, event) {
      if (error === null) {
        logger.info(event)
        let orderOptions = {
          'method': 'POST',
          'hostname': '127.0.0.1',
          'port': '20334',
          'path': '/syncOrder',
          'headers': {
            'content-type': 'application/json',
            'cache-control': 'no-cache'
          }
        }
        let orderReq = http.request(orderOptions, function (res) {
          let chunks = []

          res.on('data', function (chunk) {
            chunks.push(chunk)
          })

          res.on('end', function () {
            let body = Buffer.concat(chunks)
            console.log(body.toString())
          })
        })
        console.log(`Order hash=`, event.transactionHash)
        let strx = JSON.stringify({
          TokenGet: event.args.tokenGet.toString(),
          AmountGet: event.args.amountGet.toString(),
          TokenGive: event.args.tokenGive.toString(),
          AmountGive: event.args.amountGive.toString(),
          Expires: Number(event.args.expires.toString()),
          Nonce: event.args.nonce.toString(),
          User: event.args.user.toString() })
        logger.info(`order =`, strx)
        orderReq.write(strx)
        orderReq.end()
      } else {
        logger.info(`Trade failed, err=`, error)
      }
    })
    instance.Trade({}, { fromBlock:0, toBlock:'latest' }).watch(function (error, event) {
      if (error === null) {
        let tradeOptions = {
          'method': 'POST',
          'hostname': '127.0.0.1',
          'port': '20334',
          'path': '/syncTrade',
          'headers': {
            'content-type': 'application/json',
            'cache-control': 'no-cache'
          }
        }
        let tradeReq = http.request(tradeOptions, function (res) {
          let chunks = []

          res.on('data', function (chunk) {
            chunks.push(chunk)
          })

          res.on('end', function () {
            let body = Buffer.concat(chunks)
            console.log(body.toString())
          })
        })
        console.log(`Trade hash=`, event.transactionHash)
        let strx = JSON.stringify({
          TokenGet: event.args.tokenGet.toString(),
          AmountGet: event.args.amountGet.toString(),
          TokenGive: event.args.tokenGive.toString(),
          AmountGive: event.args.amountGive.toString(),
          Expires: event.args.expires.toString(),
          Nonce: Number(event.args.nonce),
          User: event.args.nonce.toString(),
          Amount: event.args.amount.toString(),
          Sender: event.args.sender.toString() })
        logger.info(`trade =`, strx)
        tradeReq.write(strx)
        tradeReq.end()
        logger.info('Trade event=', event)
      } else {
        logger.info(`Trade failed, err=`, error)
      }
    })
    instance.Cancel({}, { fromBlock:0, toBlock:'latest' }).watch(function (error, event) {
      if (error === null) {
        let cancelOptions = {
          'method': 'POST',
          'hostname': '127.0.0.1',
          'port': '20334',
          'path': '/syncCancel',
          'headers': {
            'content-type': 'application/json',
            'cache-control': 'no-cache'
          }
        }
        let cancelReq = http.request(cancelOptions, function (res) {
          let chunks = []

          res.on('data', function (chunk) {
            chunks.push(chunk)
          })

          res.on('end', function () {
            let body = Buffer.concat(chunks)
            console.log(body.toString())
          })
        })
        console.log(`Cancel hash=`, event.transactionHash)
        let strx = JSON.stringify({
          TokenGet: event.args.tokenGet.toString(),
          AmountGet: event.args.amountGet.toString(),
          TokenGive: event.args.tokenGive.toString(),
          AmountGive: event.args.amountGive.toString(),
          Expires: Number(event.args.expires),
          Nonce: event.args.nonce.toString(),
          User: event.args.user.toString() })
        logger.info(`cancel =`, strx)
        cancelReq.write(strx)
        cancelReq.end()
        logger.info('Cancle event=', event)
      } else {
        logger.info(`Trade failed, err=`, error)
      }
    })
  })
}
