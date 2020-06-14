const GoalBusiness = require('../business/GoalBusiness')

module.exports = class GoalController extends GoalBusiness {
  async create(req, res) {
    try {
      const {
        _id, price, description, category, conquestDate,
      } = req.body

      const response = await super.create({
        _id, price, description, category, conquestDate,
      })
      return res.status(201).json(response)
    } catch (err) {
      return res.status(400).json(err)
    }
  }

  async show(req, res) {
    try {
      const { _id } = req.params
      const response = await super.show({ _id })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async index(req, res) {
    try {
      const { goalId } = req.params
      const response = await super.index({ goalId })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async update(req, res) {
    try {
      const { goalObject } = req.body
      const response = await super.update({ goalObject })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async delete(req, res) {
    try {
      const { goalId } = req.params
      const response = await super.delete({ goalId })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }
}
