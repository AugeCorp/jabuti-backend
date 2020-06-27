const mongoose = require('../../../database/index')

const ExpenseSchema = mongoose.Schema({

  priority: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, default: '' },
  type: { type: String, default: '' },

  price: { type: Number, default: 0 },

  validity: { type: Date, default: Date.now() },
  payDate: { type: Date, default: Date.now() },

  paymentType: {
    cash: { type: Boolean, default: false },
    credit: { type: Boolean, default: false },
    parceledOut: { type: Boolean, default: false },

    installments: { type: Number, default: 1 },
  },

}, { id: false, timestamps: true })

module.exports = ExpenseSchema
