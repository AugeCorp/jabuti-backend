const mongoose = require('mongoose')
const { MongoDb } = require('../secure/secrets.json')

const dbUrl = process.env.NODE_ENV === 'production' ? MongoDb.dbUrlProduction : MongoDb.dbUrl
console.log(dbUrl)
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

console.log('Mongodb connected...');

module.exports = mongoose
