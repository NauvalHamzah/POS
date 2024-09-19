var express = require('express');
var router = express.Router();
const supplier = require('../controllers/supplierController')
const { isLoggedIn } = require('../helpers/util')

router.get('/add', isLoggedIn, supplier.addSupplier)
router.post('/add', isLoggedIn, supplier.saveSupplier)
router.get('/delete/:id', isLoggedIn, supplier.removeSupplier)
router.get('/edit/:id', isLoggedIn, supplier.getEdit)
router.post('/edit/:id', isLoggedIn, supplier.updateSupplier)

module.exports = router;
