const User = require('../models/User')
const mongoose = require('../database/index')

module.exports = class ExpenseBusiness {
  async create(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let err
      const {
        _id, paymentType, priority, description, price, category, validity, type,
      } = params

      for (const [key, value] of Object.entries(params)) {
        if (value == null || value === undefined) {
          err = { message: `"${key}" is ${value}!` }
          throw err
        }
      }

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: 'It is not a valid Id!' }
        throw err
      }

      if (!Number.isInteger(price)) {
        err = { message: '"Price" is not a Integer!' }
        throw err
      }

      const user = await User.findById({ _id: mongoose.Types.ObjectId(_id) })

      user.Economy.expenses.push({
        paymentType, priority, price, description, category, validity, type,
      })

      await user.save()
      await session.commitTransaction()
      return params
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      return err
    } finally {
      session.endSession()
    }
  }

  async getExpenses(params = {}) {
    try {
      const { _id } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: 'It is not a valid Id!' }
        throw err
      }

      const response = await User
        .aggregate([{ $match: { _id: mongoose.Types.ObjectId(_id) } }])
        .project({ expenses: '$Economy.expenses', _id: false })

      if (response.length === 0) {
        err = { message: 'User not exists!' }
        throw err
      }

      return response[0]
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getExpense(params = {}) {
    try {
      const { expenseId } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(expenseId)) {
        err = { message: '"expenseId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ 'Economy.expenses': { $elemMatch: { _id: mongoose.Types.ObjectId(expenseId) } } }, { 'Economy.expenses.$': true })

      if (!response) {
        err = { message: 'Expense not exists!' }
        throw err
      }
      const expense = response.Economy.expenses[0]

      return expense
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async delete(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { expenseId } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(expenseId)) {
        err = { message: '"expenseId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ 'Economy.expenses': { $elemMatch: { _id: mongoose.Types.ObjectId(expenseId) } } })

      if (!response) {
        err = { message: 'Expense not exists!' }
        throw err
      }

      const found = response.Economy.expenses
        .findIndex((expense) => String(expense._id) === String(expenseId));

      if (found === 0) await response.Economy.expenses.shift()

      else if (response.Economy.expenses.length - 1 === found) await response.Economy.expenses.pop()

      else await response.Economy.expenses.splice(found, 1)

      await response.save()
      await session.commitTransaction()

      return { success: 'expense is deleted!' }
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  async update(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { expenseObject } = params
      const { _id } = expenseObject
      let err;

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: '"expenseId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ 'Economy.expenses': { $elemMatch: { _id: mongoose.Types.ObjectId(_id) } } })

      if (!response) {
        err = { message: 'Expense not exists!' }
        throw err
      }

      const found = response.Economy.expenses
        .findIndex((expense) => String(expense._id) === String(_id));

      response.Economy.expenses[found - 1] = expenseObject
      await response.save()
      await session.commitTransaction()

      return { expense: response.Economy.expenses[found - 1] }
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }
}
