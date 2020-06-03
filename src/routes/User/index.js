const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')

routes.get('/', UserController.index)

routes.post('/register', UserController.register)

routes.get('/users', UserController.getUsers)

require('./auth.routes');

module.exports = (app) => routes.use('/user', app)
