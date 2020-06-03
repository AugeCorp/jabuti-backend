const PaymentTypeSchema = new mongoose.Schema({

  cash: { type: Boolean, default: false},
  credit: { type: Boolean, default: false},
  parceledOut: {type: Boolean, default: false},

  installments: {type: Number, default: 1},

})

export default PaymentTypeSchema
