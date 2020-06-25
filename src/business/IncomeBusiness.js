const Moment = require('moment')
const User = require('../models/User')
const mongoose = require('../database/index')

class IncomeBusiness {
  async create(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let err

      for (const [key, value] of Object.entries(params)) {
        if (value == null || value === undefined) {
          err = { message: `"${key}" is ${value}!` }
          throw err
        }
      }
      const {
        _id, value, description, type, receiptDate,
      } = params

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: 'It is not a valid Id!' }
        throw err
      }

      if (!Number.isInteger(value)) {
        err = { message: '"Price" is not a Integer!' }
        throw err
      }

      const user = await User.findById({ _id: mongoose.Types.ObjectId(_id) })

      user.Economy.income.push({
        value, description, type, receiptDate: Moment(receiptDate).utc(-3).toISOString(),
      })

      await user.save()
      await session.commitTransaction()
      return { newIncome: params }
    } catch (err) {
      await session.abortTransaction()
      throw { error: err }
    } finally {
      session.endSession()
    }
  }

  async show(params = {}) {
    try {
      const { _id } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: 'It is not a valid Id!' }
        throw err
      }

      const response = await User
        .aggregate([{ $match: { _id: mongoose.Types.ObjectId(_id) } }])
        .project({ incomes: '$Economy.income', _id: false })

      if (response.length === 0) {
        err = { message: 'User not exists!' }
        throw err
      }

      return { incomes: response[0] }
    } catch (err) {
      throw { error: err }
    }
  }

  async index(params = {}) {
    try {
      const { incomeId } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(incomeId)) {
        err = { message: '"incomeId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ 'Economy.income': { $elemMatch: { _id: mongoose.Types.ObjectId(incomeId) } } }, { 'Economy.income.$': true })

      if (!response) {
        err = { message: 'Income not exists!' }
        throw err
      }
      const income = response.Economy.income[0]

      return { income }
    } catch (err) {
      throw { error: err }
    }
  }

  async update(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { incomeObject } = params
      const { _id } = incomeObject
      let err;

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: '"expenseId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ 'Economy.income': { $elemMatch: { _id: mongoose.Types.ObjectId(_id) } } })

      if (!response) {
        err = { message: 'Income not exists!' }
        throw err
      }

      const found = response.Economy.income
        .findIndex((income) => String(income._id) === String(_id));

      response.Economy.income[found] = incomeObject

      await response.save()
      await session.commitTransaction()

      return { updatedIncome: response.Economy.income[found] }
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
      const { incomeId } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(incomeId)) {
        err = { message: '"incomeId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ 'Economy.income': { $elemMatch: { _id: mongoose.Types.ObjectId(incomeId) } } })

      if (!response) {
        err = { message: 'Income not exists!' }
        throw err
      }

      const found = response.Economy.income
        .findIndex((income) => String(income._id) === String(incomeId));

      if (found === 0) await response.Economy.income.shift()

      else if (response.Economy.income.length - 1 === found) await response.Economy.income.pop()

      else await response.Economy.income.splice(found, 1)

      await response.save()
      await session.commitTransaction()

      return { deleted: true }
    } catch (err) {
      await session.abortTransaction()
      throw { error: err }
    } finally {
      session.endSession()
    }
  }
}

module.exports = IncomeBusiness
