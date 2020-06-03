const mongoose = require('mongoose')
const AccessesSchema = require('./SchemasInUser/AccessesSchema')
const GoalsSchema = require('./SchemasInUser/GoalsSchema')
const EconomySchema = require('./SchemasInUser/EconomySchema')

const UserSchema = new mongoose.Schema({

  email:{ type: String, unique: true, required: true },
  password: { type: String, required: true },
  token: { type: String, default: '' },
  name: { type: String, default: '' },

  googleAccount: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },

  Accesses: AccessesSchema,
  Economy: EconomySchema,
  Goals: [GoalsSchema],

}, {timestamps: true })

mongoose.model('User', UserSchema)
