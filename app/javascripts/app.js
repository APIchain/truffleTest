var logger = require('./logger').logger
var eventCatch = require('./eventCatch')

logger.info('program start.')

eventCatch.catchEvent()
