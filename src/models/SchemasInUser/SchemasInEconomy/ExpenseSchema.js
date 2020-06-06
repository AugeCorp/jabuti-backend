const mongoose = require('mongoose')
const PaymentTypeSchema = require('./SchemasInExpense/PaymentTypeSchema')

const ExpenseSchema = new mongoose.Schema({

  priority: {type: String, default: ''},
  description: {type: String, default: ''},
  category: {type: String, default: ''},
  type: {type:String, default: ''},

  price: {type: Number, default: 0},

  validity: {type: Date },

  paymentType: PaymentTypeSchema,

}, {id: false, timestamps: true})

module.exports = ExpenseSchema
