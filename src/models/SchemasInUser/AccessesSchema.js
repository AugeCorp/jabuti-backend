const AccessesSchema = new mongoose.Schema({

  lastAccess: { type: Date, default: Date.now() },
  allAccesses: { type: Array },

},{id: false })

export default AccessesSchema
