const PaymentTypeSchema = require('./SchemasInExpense/PaymentTypeSchema')

const ExpenseSchema = new mongoose.Schema({

  priority: {type: String, default: ''},
  description: {type: String, default: ''},
  category: {type: String, default: ''},
  type: {type:String, default: ''},

  price: {type: Number, default: 0},

  validity: {type: Date },

  paymentType: PaymentTypeSchema,

}, {timestamps: true})

export default ExpenseSchema
