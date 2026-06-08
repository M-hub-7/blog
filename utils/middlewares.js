const logger = require('./logger')
const requestLogger = (request, response, next) => {
  logger.info('method:', request.method)
  logger.info('path:', request.path)
  logger.info('body:', request.body)
  logger.info('---')
  next()
}
const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknow endpoint' })
}

const errorHandle = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
module.exports = {
  requestLogger,
  unknowEndpoint,
  errorHandle,
}
