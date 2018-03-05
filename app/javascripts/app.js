var restify = require('restify')
let blockchain = require('./blockchain')
let logger = require('./logger').logger

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/echo/:addr/:amount', function (req, res, next) {
  logger.info(`/////////////////////////////////////////////////////////////////////////////////////////////`)
  // let strx = `Addr=` + req.params.addr + `,Amount=` + req.params.amount
  // logger.info(`request received,`, strx)
  blockchain.sendAsset(req.params.addr, req.params.amount, res)
  // blockchain.sendAsset()
  // res.send(hash)
  return next()
})

server.post('/sendAsset', function (req, res, next) {
  blockchain.sendAsset(req.params.addr, req.params.amount, res)
  return next()
})

server.post('/sendMany', function (req, res, next) {
  let strx = JSON.stringify(req.body)
  var javascriptObject = JSON.parse(strx)
  blockchain.sendMany(javascriptObject.addr, javascriptObject.amount, res)
  return next()
})

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})
