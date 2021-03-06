const mongoose = require('mongoose')
const { MongoDb } = require('../secure/secrets.json')

mongoose.connect(MongoDb.dbUrlProduction, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
})
mongoose.Promise = global.Promise

console.log('Mongodb connected...');

module.exports = mongoose
