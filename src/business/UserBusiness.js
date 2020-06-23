const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const mongoose = require('../database/index')
const authConfig = require('../secure/secrets.json')


class UserBusiness {
  async create(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { email, password } = params
      let err
      if (!email) {
        err = { message: 'Email not declared!' }
        throw err
      }

      if (!password) {
        err = { message: 'Password not declared!' }
        throw err
      }

      const exists = await User.findOne({ email })

      if (exists) {
        err = { message: 'User alredy exists!' }
        throw err
      }

      const cryptPassword = await bcrypt.hash(password, 10)

      const newUser = await User.create({ email, password: cryptPassword })

      const token = jwt.sign({ id: newUser._id }, authConfig.secret, {
        expiresIn: 86400,
      })

      newUser.token = token
      await newUser.save()
      await session.commitTransaction()
      return newUser
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      return err
    } finally {
      session.endSession()
    }
  }

  async show(params = {}) {
    let err
    const { email } = params
    if (!email) {
      err = { message: 'Email not passed' }
      throw err
    }

    const response = await User.findOne({ email })

    if (!response) {
      err = { message: 'email not exists' }
      throw err
    }

    return response
  }

  async index() {
    try {
      const response = await User.find()
      return response
    } catch (err) {
      err.message = 'Error in database'
      console.log(err)
      throw err
    }
  }

  async update(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { user } = params
      const { _id } = user
      let err;

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: '"_id" is not a valid Id!' }
        throw err
      }

      const response = await User.findOneAndUpdate({ _id }, user)


      if (!response) {
        err = { message: 'User not exists!' }
        throw err
      }
      await response.save()

      await session.commitTransaction()

      return { updatedUser: response }
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  async delete(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { _id } = params
      let err
      if (!_id) {
        err = { message: '_id not declared!' }
        throw err
      }

      const exists = await User.findByIdAndDelete({ _id })

      if (!exists) {
        err = { message: 'User does not exist!' }
        throw err
      }

      await session.commitTransaction()
      return { deleted: true }
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      return err
    } finally {
      session.endSession()
    }
  }

  async login(params = {}) {
    try {
      let err

      const { email, password } = params

      if (!email) {
        err = { message: 'Email not passed' }
        throw err
      }

      if (!password) {
        err = { message: 'Password not passed' }
        throw err
      }
      const user = await User.findOne({ email })

      if (!user) {
        err = { message: 'User not found' }
        throw err
      }

      if (!await bcrypt.compare(password, user.password)) {
        err = { message: ' Login was not successfull' }
        throw err
      }


      const token = jwt.sign({ id: user._id }, authConfig.secret, {
        expiresIn: 86400,
      })
      user.token = token

      await user.save()
      user.password = undefined
      return user
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

module.exports = UserBusiness
