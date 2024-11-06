module.exports = function(db){

    var express = require('express');
    var router = express.Router();
    const supplier = require('../controllers/supplierController')(db)
    const { isLoggedIn } = require('../helpers/util')(db)

    router.get('/add', isLoggedIn, supplier.addSupplier)
    router.post('/add', isLoggedIn, supplier.saveSupplier)
    router.get('/delete/:id', isLoggedIn, supplier.removeSupplier)
    router.get('/edit/:id', isLoggedIn, supplier.getEdit)
    router.post('/edit/:id', isLoggedIn, supplier.updateSupplier)

return router;
}