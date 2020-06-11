const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const User = require('../models/User')
const mongoose = require('../database/index')
const authConfig = require('../secure/secrets.json')
// const { hostMail, sendEmail } = require('../secure/node-mailer/mailer.json')

module.exports = class UserController {
  async index(req, res) {
    try {
      const response = await User.find()
      return res.status(200).send(response)
    } catch (err) {
      err.message = 'Error in database'
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async show(req, res) {
    try {
      let err
      const { email } = req.body

      if (!email) {
        err = { message: 'Email not passed' }
        throw err
      }

      const response = await User.findOne({ email })

      if (!response) {
        err = { message: 'email not exists' }
        throw err
      }

      return res.status(200).send(response)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }

  async create(req, res) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { email, password } = req.body
      let err
      if (!email) {
        err = { message: 'Email not declared!' }
        throw err
      }

      if (!password) {
        err = { message: 'Password not declared!' }
        throw err
      }

      const exists = await User.findOne({ email })

      if (exists) {
        err = { message: 'User alredy exists!' }
        throw err
      }

      const cryptPassword = await bcrypt.hash(password, 10)
      const newUser = await User.create({ email, password: cryptPassword })

      const token = jwt.sign({ id: newUser._id }, authConfig.secret, {
        expiresIn: 86400,
      })

      await newUser.updateOne({ token })
      await newUser.save()
      await session.commitTransaction()
      return res.status(200).send({ success: 'Registration was successful!' })
    } catch (err) {
      console.log(err)
      await session.abortTransaction()
      return res.status(400).send({ error: err.message || 'Error creation user' })
    } finally {
      session.endSession()
    }
  }

  async auth(req, res) {
    const { email, password } = req.body

    try {
      if (!email) return res.status(400).send({ error: 'User not declared' })

      if (!password) {
        return res.status(400).send({ error: 'Password not declared' })
      }

      const user = await User.findOne({ email }).select('+password')

      if (!user) return res.status(404).send({ Error: 'User not found!' })

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({ error: 'Password has incorect' })
      }

      user.password = undefined

      return res.status(200).send({ user, token: generateToken({ id: user._id }) })
    } catch (err) {
      return res.status(400).send({ error: 'Authenticate Failed!' })
    }
  }

  // async update(req, res) {

  // }
  // async recuperacao(req, res) {
  //   const { email } = req.body

  //   try {
  //     if (!email) return res.status(404).send({ error: 'Email not declared' })

  //     const remetente = mailer.createTransport(hostMail)

  //     sendEmail.to = email

  //     remetente.sendMail(sendEmail, (error) => {
  //       if (error) res.status(400).send({ error })

  //       res.status(200).send('Email enviado com sucesso.')
  //     })

  //     return ''
  //   } catch (error) {
  //     return res.status(400).send({ error })
  //   }
  // },
}
