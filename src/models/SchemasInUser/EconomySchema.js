const IncomeSchema = require('./SchemasInEconomy/IncomeSchema')
const ExpenseSchema = require('./SchemasInEconomy/ExpenseSchema')

const EconomySchema = new mongoose.Schema({

  income: [IncomeSchema],
  expenses: [ExpenseSchema],

}, {timestamps: true})

export default EconomySchema
