const User = require('../models/User')
const IncomeBusiness = require('./IncomeBusiness');
const mongoose = require('../database');

module.exports = class FirstContact extends IncomeBusiness {
  async create(params = {}) {
    try {
      const { _id, name } = params

      const session = await mongoose.startSession()
      session.startTransaction()

      const user = await User.findOne({ _id })

      user.name = name

      await user.save()
      await session.commitTransaction()

      const response = await super.create({ id: _id, ...params })

      return response
    } catch (err) {
      return err.message
    }
  }
}
