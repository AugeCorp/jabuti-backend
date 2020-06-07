const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')

const userController = new UserController()

routes.post('/user', userController.create)

routes.get('/users', userController.index)

routes.get('/user', userController.show)

routes.put('/user', userController.update)

require('./auth.routes');

module.exports = (app) => routes.use('/user', app)
