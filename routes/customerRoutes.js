var express = require('express');
var router = express.Router();
const customer = require('../controllers/customerController')
const { isLoggedIn } = require('../helpers/util')

router.get('/add', isLoggedIn, customer.addCustomer)
router.post('/add', isLoggedIn, customer.saveCustomer)
router.get('/delete/:id', isLoggedIn, customer.removeCustomer)
router.get('/edit/:id', isLoggedIn, customer.getEdit)
router.post('/edit/:id', isLoggedIn, customer.updateCustomer)

module.exports = router;
