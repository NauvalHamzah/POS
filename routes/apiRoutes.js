module.exports = function(db, io){

    var express = require('express');
    var router = express.Router();
    const goods = require('../controllers/goodsController')(db, io)
    const unit = require('../controllers/unitController')(db)
    const supplier = require('../controllers/supplierController')(db)
    const customer = require('../controllers/customerController')(db)
    const user = require('../controllers/userController')(db)
    const purchase = require('../controllers/purchaseController')(db)
    const sale = require('../controllers/saleController')(db)
    const { isLoggedIn } = require('../helpers/util')(db)

    router.get('/goods', isLoggedIn, goods.getGoods);
    router.get('/units', isLoggedIn, unit.getUnit);
    router.get('/suppliers', isLoggedIn, supplier.getSupplier);
    router.get('/customers', isLoggedIn, customer.getCustomer);
    router.get('/users', isLoggedIn, user.getUser);
    router.get('/purchases', isLoggedIn, purchase.getPurchase);
    router.get('/sales', isLoggedIn, sale.getSale);
    router.get('/lowstock', isLoggedIn, goods.checkStock)

return router;
}