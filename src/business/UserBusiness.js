const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
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
      return { newUser }
    } catch (err) {
      await session.abortTransaction()
      throw { error: err }
    } finally {
      session.endSession()
    }
  }

  async show(params = {}) {
    try {
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

      return { user: response }
    } catch (err) {
      throw { error: err }
    }
  }

  async index() {
    try {
      const response = await User.find()
      return { users: response }
    } catch (err) {
      err.message = 'Error in database'
      throw { error: err }
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
      await session.abortTransaction()
      throw { error: err }
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
      await session.abortTransaction()
      throw { error: err }
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
      throw { error: err }
    }
  }

  async forgotPassword(params = {}) {
    try {
      let err

      const { email } = params

      if (!email) {
        err = { message: 'Email not passed' }
        throw err
      }

      const user = await User.findOne({ email })

      if (!user) {
        err = { message: 'User not found' }
        throw err
      }

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await User.findByIdAndUpdate(user._id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      })

      // TODO
      // ENVIO DE EMAIL
      return { user }
    } catch (err) {
      throw { error: err }
    }
  }

  async resetPassword(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let err

      const { email, password, token } = params

      if (!email) {
        err = { message: 'Email not passed' }
        throw err
      }

      if (!password) {
        err = { message: 'Password not passed' }
        throw err
      }

      if (!token) {
        err = { message: 'token not passed' }
        throw err
      }


      const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires')


      if (!user) {
        err = { message: 'User not found' }
        throw err
      }

      if (token !== user.passwordResetToken) {
        err = { message: 'Token is invalid' }
        throw err
      }

      const now = new Date()

      if (now > user.passwordResetExpires) {
        err = { message: 'token expired, generate a new one' }
        throw err
      }

      user.password = password
      await user.save()
      await session.commitTransaction()
      return { reset: true }
    } catch (err) {
      await session.abortTransaction()
      throw { error: err }
    } finally {
      session.endSession()
    }
  }
}

module.exports = UserBusiness
