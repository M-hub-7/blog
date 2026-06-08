const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middlewares')
const noteRouter = require('./controllers/blog')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connect to MongoDB'))
  .catch((error) => {
    logger.error('error connection to mongoDB', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', noteRouter)

app.use(middleware.unknowEndpoint)
app.use(middleware.errorHandle)

module.exports = app
