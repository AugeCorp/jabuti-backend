const FirstContact = require('../business/FirstContact')

module.exports = class FirstContactController extends FirstContact {
  async create(req, res) {
    try {

      const response = await super.create({ _id: req.userId, ...req.body })

      return res.status(201).json(response)
    } catch (err) {
      return res.status(400).json(err.message)
    }
  }
}
