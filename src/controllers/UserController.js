const UserBusiness = require('../business/UserBusiness')

module.exports = class UserController extends UserBusiness {
  async index(req, res) {
    try {
      const response = await super.getUsers()
      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async show(req, res) {
    try {
      const { email } = req.body
      const response = await super.getUser({ email })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async create(req, res) {
    try {
      const { email, password } = req.body
      const response = await super.createUser({ email, password })
      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  }

  async delete(req, res) {
    try {
      const { _id } = req.params
      const response = await super.delete({ _id })
      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  }
}
