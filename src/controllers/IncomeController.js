const IncomeBusiness = require('../business/IncomeBusiness')

module.exports = class IncomeController extends IncomeBusiness {
  async create(req, res) {
    try {
      const {
        _id, value, description, type,
      } = req.body

      const response = await super.create({
        _id, value, description, type,
      })
      return res.status(200).json(response)
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
      const { incomeId } = req.params
      const response = await super.index({ incomeId })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async update(req, res) {
    try {
      const { incomeObject } = req.body
      const response = await super.update({ incomeObject })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async delete(req, res) {
    try {
      const { incomeId } = req.params
      const response = await super.delete({ incomeId })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }
}
