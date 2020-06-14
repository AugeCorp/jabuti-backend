const User = require('../models/User')
const mongoose = require('../database/index')

class GoalBusiness {
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
        _id, price, description, category, conquestDate,
      } = params

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: 'It is not a valid Id!' }
        throw err
      }

      if (!Number.isInteger(price)) {
        err = { message: '"Price" is not a Integer!' }
        throw err
      }

      const user = await User.findById({ _id: mongoose.Types.ObjectId(_id) })

      user.Goals.push({
        price, description, category, conquestDate,
      })

      await user.save()
      await session.commitTransaction()
      return { newGoal: params }
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      return err
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
        .project({ goals: '$Goals', _id: false })

      if (response.length === 0) {
        err = { message: 'User not exists!' }
        throw err
      }

      return { goals: response[0] }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async index(params = {}) {
    try {
      const { goalId } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(goalId)) {
        err = { message: '"goalId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ Goals: { $elemMatch: { _id: mongoose.Types.ObjectId(goalId) } } }, { 'Goals.$': true })

      if (!response) {
        err = { message: 'Goals not exists!' }
        throw err
      }
      const goal = response.Goals[0]

      return { goal }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async update(params = {}) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { goalObject } = params
      const { _id } = goalObject
      let err;

      if (!mongoose.mongo.ObjectId.isValid(_id)) {
        err = { message: '"goalId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ Goals: { $elemMatch: { _id: mongoose.Types.ObjectId(_id) } } })

      if (!response) {
        err = { message: 'Goal not exists!' }
        throw err
      }

      const found = response.Goals
        .findIndex((goal) => String(goal._id) === String(_id));

      response.Goals[found] = goalObject
      await response.save()
      await session.commitTransaction()

      return { updatedGoal: response.Goals[found] }
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
      const { goalId } = params
      let err;

      if (!mongoose.mongo.ObjectId.isValid(goalId)) {
        err = { message: '"goalId" is not a valid Id!' }
        throw err
      }

      const response = await User
        .findOne({ Goals: { $elemMatch: { _id: mongoose.Types.ObjectId(goalId) } } })

      if (!response) {
        err = { message: 'Goal not exists!' }
        throw err
      }

      const found = response.Goals
        .findIndex((goal) => String(goal._id) === String(goalId));

      if (found === 0) await response.Goals.shift()

      else if (response.Goals.length - 1 === found) await response.Goals.pop()

      else await response.Goals.splice(found, 1)

      await response.save()
      await session.commitTransaction()

      return { deleted: true }
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }
}

module.exports = GoalBusiness
