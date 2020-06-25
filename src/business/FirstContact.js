const User = require('../models/User')
const IncomeBusiness = require('./IncomeBusiness')
const mongoose = require('../database')

module.exports = class FirstContact extends IncomeBusiness {
  async create(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const {
        _id, name, value, description, type,
      } = params

      const user = await User.findOne({ _id })

      user.name = name

      await user.save()
      await session.commitTransaction()

      const response = await super.create({
        _id, name, value, description, type,
      })

      return response
    } catch (err) {
      await session.abortTransaction()
      throw { error: err }
    } finally {
      session.endSession()
    }
  }
}
