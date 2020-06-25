const mongoose = require('mongoose')
const { MongoDb } = require('../secure/secrets.json')

mongoose.connect(MongoDb.dbUrlProduction, { useNewUrlParser: true, useUnifiedTopology: true })

console.log('Mongodb connected...');

module.exports = mongoose
