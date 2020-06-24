const mongoose = require('mongoose')
const { MongoDb } = require('../secure/secrets.json')

const uri = process.env.NODE_ENV === 'production' ? MongoDb.dbUrlProduction : MongoDb.dbUrl
mongoose.connect(uri, { useNewUrlParser: true })
mongoose.connection.once('open', () => console.log('Good to go!')).on('error', (error) => {
  console.warn('Warning', error)
})

console.log('Mongodb connected...');

module.exports = mongoose
