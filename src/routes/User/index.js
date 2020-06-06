const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')

const userController = new UserController()

routes.get('/', userController.index)

routes.get('/users', userController.getUsers)

routes.post('/register', userController.register)

require('./auth.routes');

module.exports = (app) => routes.use('/user', app)
