const mongoose = require('mongoose')
const dbUrl = require('secure/secrets.json').MongoDb.dbURL

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise

module.exports = mongoose
