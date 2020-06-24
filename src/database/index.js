const mongoose = require('mongoose')
const { MongoDb } = require('../secure/secrets.json')

const uri = process.env.NODE_ENV === 'production' ? MongoDb.dbUrlProduction : MongoDb.dbUrl
mongoose.connect(uri, { useNewUrlParser: true })

console.log('Mongodb connected...');

module.exports = mongoose
