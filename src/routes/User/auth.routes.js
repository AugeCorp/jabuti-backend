const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')

const userController = new UserController()
routes.get('/', userController.index)

module.exports = (app) => routes.use('/auth', app)
