const mongoose = require('../../database/index')
const GoalsSchema = mongoose.Schema({

  description: { type: String, default: ''},
  category: { type: String, default: ''},

  price: { type: Number, default: 0},

  conquestDate: { type: Date },

}, {id: false, timestamps: true})

module.exports = GoalsSchema
