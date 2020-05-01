const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const requireDir = require('require-dir')
const app = express();


mongoose.connect('mongodb://localhost:27017/jabuti', {
  useNewUrlParser: true,
})

requireDir('./src/models')

app.use(bodyParser.json())
app.use('/api', require('./src/routes/index.routes'))

app.listen(3000)