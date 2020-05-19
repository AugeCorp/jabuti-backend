const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const User = mongoose.model('User')

class UserBusiness {
  constructor(params) {
    this.email = params.email
    this.password = params.password
    this.name = params.name
  }

  async execute() {}

  async register() {
    try {
      const user = await User.findOne({ email: this.email })
      if (user) {
        return { error: 'Email already exists.' }
      }

      const hash = bcrypt.hashSync(this.password, 16)
      await User.create({ name: this.name, email: this.email, password: hash })

      return { created: true }
    } catch (err) {
      console.log(err.message)
      return { failed: err.message }
    }
  }

  async getUsers() {
    try {
      const users = await User.find()
      return { users, success: true }
    } catch (err) {
      console.log(err.message)
      return { failed: err.message }
    }
  }
}

module.exports = UserBusiness
