module.exports = function(db){

    var express = require('express');
    var router = express.Router();
    const login = require('../controllers/loginController')(db)
    const menu = require('../controllers/menuController')(db)
    const { isLoggedIn, isAdmin } = require('../helpers/util')(db)

    router.get('/', login.loginGet)
    router.post('/login', login.login)
    router.get('/logout', login.logout)

    router.use('/dashboard', isLoggedIn, isAdmin)
    router.use('/goods', isLoggedIn, isAdmin)
    router.use('/units', isLoggedIn, isAdmin)
    router.use('/users', isLoggedIn, isAdmin)

    router.get('/dashboard', menu.dashboard)
    router.post('/download-report', isLoggedIn, menu.report)
    router.get('/goods', menu.goods)
    router.get('/units', menu.units)
    router.get('/suppliers', isLoggedIn, menu.suppliers)
    router.get('/customers', isLoggedIn, menu.customers)
    router.get('/users', menu.users)
    router.get('/purchases', isLoggedIn, menu.purchases)
    router.get('/sales', isLoggedIn, menu.sales)

return router;
}