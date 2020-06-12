const ExpenseBusiness = require('../business/ExpenseBusiness')

module.exports = class ExpenseController extends ExpenseBusiness {
  async show(req, res) {
    try {
      const { _id } = req.params
      const response = await super.getExpenses({ _id })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async index(req, res) {
    try {
      const { expenseId } = req.params
      const response = await super.getExpense({ expenseId })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async create(req, res) {
    try {
      const {
        _id, paymentType, priority, description, price, category, validity, type,
      } = req.body

      const response = await super.create({
        _id, paymentType, priority, description, price, category, validity, type,
      })
      return res.status(200).json(response)
    } catch (err) {
      return res.status(400).json(err)
    }
  }

  async delete(req, res) {
    try {
      const { expenseId } = req.params
      const response = await super.delete({ expenseId })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }
}
