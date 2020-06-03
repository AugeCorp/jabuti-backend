const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const User = require('../models/User')
const authConfig = require('../secure/secrets.json')
// const { hostMail, sendEmail } = require('../secure/node-mailer/mailer.json')

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  })
}

module.exports = {
  async index(req, res) {
    try {
      const { email } = req.body

      if (!email) return res.status(400).send({ error: 'email not passed' })

      const response = await User.findOne({ email })

      if (!response) return res.status(404).send({ error: 'email not exists' })

      return res.status(200).send(response)
    } catch (err) {
      return res.status(400).json({ error: 'User not Found' })
    }
  },

  async register(req, res) {
    const { email } = req.body

    try {
      if (!email) return res.status(404).send({ Error: 'Email not declared!' })

      const exists = await User.findOne({ email });

      if (exists) {
        return res.status(400).send({ Error: 'User alredy exists!' })
      }

      const user = new User(req.body);

      const pswd = await bcrypt.hash(user.password, 10)

      user.password = pswd

      await user.save()
      user.password = undefined

      return res
        .status(200)
        .send({ user, token: generateToken({ user: user._id }) })
    } catch (err) {
      return res.status(400).send({ error: 'Registration Failed!' })
    }
  },

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
  },
  
  async getUsers(req, res){
    const response = await new UserBusiness({}).getUsers()
    
    if(response.failed) return res.status(500).send(response)

    return res.json(response.users)

  },
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
