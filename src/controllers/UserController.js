const UserBusiness = require('../business/UserBusiness')

module.exports = class UserController extends UserBusiness {
  async create(req, res) {
    try {
      const { email, password } = req.body
      const response = await super.create({ email, password })
      return res.status(201).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async show(req, res) {
    try {
      const { email } = req.body
      const response = await super.show({ email })
      return res.status(200).json(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async index(req, res) {
    try {
      const response = await super.index()
      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async update(req, res) {
    try {
      const { user } = req.body
      const response = await super.update({ user })
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

  async login(req, res) {
    try {
      console.log(req.userId)
      const { email, password } = req.body
      const response = await super.login({ email, password })
      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  }
}
