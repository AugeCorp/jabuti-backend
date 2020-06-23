const mongoose = require('../database/index')
const GoalsSchema = require('./SchemasInUser/GoalsSchema')
const IncomeSchema = require('./SchemasInUser/SchemasInEconomy/IncomeSchema')
const ExpenseSchema = require('./SchemasInUser/SchemasInEconomy/ExpenseSchema')

const { Schema } = mongoose

const UserSchema = new Schema({

  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  token: { type: String, default: '' },
  name: { type: String, default: '' },

  googleAccount: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  Accesses: {
    lastAccess: { type: Date, default: Date.now() },
    allAccesses: { type: Array, default: [] },
  },
  Goals: [GoalsSchema],
  Economy: {
    income: [IncomeSchema],
    expenses: [ExpenseSchema],
  },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User
