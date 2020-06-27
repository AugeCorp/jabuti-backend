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
      let err;

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: 'It is not a valid Id!' }
        throw err
      }

      if (!name) {
        err = { message: 'name not passed!' }
        throw err
      }

      if (!value) {
        err = { message: 'value not passed!' }
        throw err
      }

      if (!description) {
        err = { message: 'description not passed!' }
        throw err
      }

      const user = await User.findOne({ _id })

      user.name = name

      await user.save()
      await session.commitTransaction()

      const response = await super.create({
        _id, name, value, description, type,
      })

      response.user = user;

      return response
    } catch (err) {
      await session.abortTransaction()
      throw { error: err }
    } finally {
      session.endSession()
    }
  }
}
