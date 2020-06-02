const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')

routes.get('/', UserController.index)

module.exports = (app) => routes.use('/auth', app)
