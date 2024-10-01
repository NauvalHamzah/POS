var express = require('express');
var router = express.Router();
const goods = require('../controllers/goodsController')
const unit = require('../controllers/unitController')
const supplier = require('../controllers/supplierController')
const customer = require('../controllers/customerController')
const user = require('../controllers/userController')
const purchase = require('../controllers/purchaseController')
const { isLoggedIn } = require('../helpers/util')

router.get('/goods', isLoggedIn, goods.getGoods);
router.get('/units', isLoggedIn, unit.getUnit);
router.get('/suppliers', isLoggedIn, supplier.getSupplier);
router.get('/customers', isLoggedIn, customer.getCustomer);
router.get('/users', isLoggedIn, user.getUser);
router.get('/purchases', isLoggedIn, purchase.getPurchase);

module.exports = router;