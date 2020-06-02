const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')

routes.get('/', UserController.index)

routes.post('/', UserController.register)

require('./auth.routes');

module.exports = (app) => routes.use('/user', app)
