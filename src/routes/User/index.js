const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')
const ExpenseController = require('../../controllers/ExpenseController')
const IncomeController = require('../../controllers/IncomeController')

const userController = new UserController()
const expenseController = new ExpenseController()
const incomeController = new IncomeController()

// user
routes.post('/user', userController.create)

routes.get('/users', userController.index)

routes.get('/user', userController.show)

routes.delete('/user/:_id', userController.delete)

routes.put('/user', userController.update)

// expense
routes.get('/expenses/:_id', expenseController.show)

routes.get('/expense/:expenseId', expenseController.index)

routes.post('/expense', expenseController.create)

routes.put('/expense', expenseController.update)

routes.delete('/expense/:expenseId', expenseController.delete)

// incomes
routes.post('/income', incomeController.create)

routes.get('/incomes/:_id', incomeController.show)

routes.get('/income/:incomeId', incomeController.index)

routes.delete('/income/:incomeId', incomeController.delete)

routes.put('/income', incomeController.update)


require('./auth.routes');

module.exports = (app) => routes.use('/user', app)
