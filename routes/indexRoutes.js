module.exports = function(db, io){

    var express = require('express');
    var router = express.Router();
    const login = require('../controllers/loginController')(db)
    const dashboard = require('../controllers/dashboardController')(db)
    const goods = require('../controllers/goodsController')(db, io)
    const unit = require('../controllers/unitController')(db)
    const supplier = require('../controllers/supplierController')(db)
    const customer = require('../controllers/customerController')(db)
    const user = require('../controllers/userController')(db)
    const purchase = require('../controllers/purchaseController')(db)
    const sale = require('../controllers/saleController')(db)
    const { isLoggedIn, isAdmin } = require('../helpers/util')(db)

    router.get('/', login.loginGet)
    router.post('/login', login.login)
    router.get('/logout', login.logout)

    router.use('/dashboard', isLoggedIn, isAdmin)
    router.use('/goods', isLoggedIn, isAdmin)
    router.use('/units', isLoggedIn, isAdmin)
    router.use('/users', isLoggedIn, isAdmin)

    router.get('/dashboard', dashboard.dashboard)
    router.post('/download-report', isLoggedIn, dashboard.report)
    router.get('/goods', goods.goods)
    router.get('/units', unit.units)
    router.get('/suppliers', isLoggedIn, supplier.suppliers)
    router.get('/customers', isLoggedIn, customer.customers)
    router.get('/users', user.users)
    router.get('/purchases', isLoggedIn, purchase.purchases)
    router.get('/sales', isLoggedIn, sale.sales)

return router;
}