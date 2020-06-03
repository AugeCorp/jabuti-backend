const IncomeSchema = new mongoose.Schema({

  description: {type: String, default: ''},
  type: {type: String, default: ''},

  value: {type: Number, default: 0},

}, {timestamps: true})

export default IncomeSchema
