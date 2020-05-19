const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')

routes.get('/index', UserController.index)

module.exports = (app) => routes.use('/users', app)
