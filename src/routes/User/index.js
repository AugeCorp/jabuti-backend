const routes = require('../../config/routes.config')
const UserController = require('../../controllers/UserController')
const ExpenseController = require('../../controllers/ExpenseController')
const IncomeController = require('../../controllers/IncomeController')
const GoalController = require('../../controllers/GoalController')
const FirstContact = require('../../controllers/FirstContact')
const isAuthenticated = require('../../middlewares/auth')

const userController = new UserController()
const expenseController = new ExpenseController()
const incomeController = new IncomeController()
const goalController = new GoalController()
const firstContact = new FirstContact()

// user
routes.post('/user', userController.create)

routes.get('/user', isAuthenticated, userController.show)

routes.get('/users', isAuthenticated, userController.index)

routes.put('/user', isAuthenticated, userController.update)

routes.delete('/user/:_id', isAuthenticated, userController.delete)

routes.post('/login', userController.login)

// expense

routes.post('/expense', isAuthenticated, expenseController.create)

routes.get('/expenses/:_id', isAuthenticated, expenseController.show)

routes.get('/expense/:expenseId', isAuthenticated, expenseController.index)

routes.put('/expense', isAuthenticated, expenseController.update)

routes.delete('/expense/:expenseId', isAuthenticated, expenseController.delete)

// incomes
routes.post('/income', isAuthenticated, incomeController.create)

routes.get('/incomes/:_id', isAuthenticated, incomeController.show)

routes.get('/income/:incomeId', isAuthenticated, incomeController.index)

routes.put('/income', isAuthenticated, incomeController.update)

routes.delete('/income/:incomeId', isAuthenticated, incomeController.delete)

// goals

routes.post('/goal', isAuthenticated, goalController.create)

routes.get('/goals/:_id', isAuthenticated, goalController.show)

routes.get('/goal/:goalId', isAuthenticated, goalController.index)

routes.put('/goal', isAuthenticated, goalController.update)

routes.delete('/goal/:goalId', isAuthenticated, goalController.delete)

// First Access

routes.post('/firstContact', isAuthenticated, firstContact.create)

require('./auth.routes');

module.exports = (app) => routes.use('/user', app)
