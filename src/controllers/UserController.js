const UserBusiness = require('../business/UserBusiness')

module.exports ={

  async getUsers(req, res){
    const response = await new UserBusiness({}).getUsers()
    
    if(response.failed) return res.status(500).send(response)

    return res.json(response.users)

  },

  async registerUser(req, res){
    const {email, password, name} = req.body

    const response = await new UserBusiness({email, password, name}).register()

    if(response.failed) return res.status(500).send(response)
    if(response.error) return res.status(400).send(response)

    return res.status(201).send(response)
  }
}