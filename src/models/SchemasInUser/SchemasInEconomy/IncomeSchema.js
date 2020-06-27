const mongoose = require('../../../database/index')

const IncomeSchema = mongoose.Schema({

  description: { type: String, default: '' },
  type: { type: String, default: '' },

  value: { type: Number, default: 0 },

  receiptDate: { type: Date, default: Date.now() },
}, { id: false, timestamps: true })

module.exports = IncomeSchema
