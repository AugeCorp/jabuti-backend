const AccessesSchema = new mongoose.Schema({

  lastAccess: { type: Date, default: Date.now() },
  allAccesses: { type: Array },

})

export default AccessesSchema
