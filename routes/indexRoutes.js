var express = require('express');
var router = express.Router();
const login = require('../controllers/loginController')
const menu = require('../controllers/menuController')
const user = require('../controllers/userController')
const unit = require('../controllers/unitController')
const { isLoggedIn } = require('../helpers/util')

router.get('/', login.loginGet)
router.post('/login', login.login)
router.get('/logout', login.logout)

router.get('/dashboard', isLoggedIn, menu.dashboard)
router.get('/goods', isLoggedIn, menu.goods)
router.get('/units', isLoggedIn, menu.units)
router.get('/suppliers', isLoggedIn, menu.suppliers)
router.get('/customers', isLoggedIn, menu.customers)
router.get('/users', isLoggedIn, menu.users)
router.get('/purchases', isLoggedIn, menu.purchases)
router.get('/sales', isLoggedIn, menu.sales)

router.get('/usersapi', isLoggedIn, user.getUser);
router.get('/unitsapi', isLoggedIn, unit.getUnit);

module.exports = router;