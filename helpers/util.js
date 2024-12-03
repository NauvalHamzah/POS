module.exports = function(db) {

    const Purchase = require('../models/PurchaseModel')(db)
    const Sale = require('../models/SaleModel')(db)

    function isLoggedIn(req, res, next) {
        if (req.session.user) {
            return next()
        }
        res.redirect('/')
    }

    function isAdmin(req, res, next){
        if (req.session.user.role=='Admin') {
            return next()
        }
        res.redirect('/sales')
    }

    function isOperatorPurchase(req, res, next){
        invoice = req.params.id
        operator = req.session.user.id
        role = req.session.user.role
        Purchase.getEdit(invoice, function(item){
            if(item.operator==operator || role=="Admin"){
                return next()
            } else{
                res.redirect('/purchases')
            }
        })
    }

    function isOperatorSale(req, res, next){
        invoice = req.params.id
        operator = req.session.user.id
        role = req.session.user.role
        Sale.getEdit(invoice, function(item){
            if(item.operator==operator || role=="Admin"){
                return next()
            } else{
                res.redirect('/sales')
            }
        })
    }

return {isLoggedIn, isAdmin, isOperatorPurchase, isOperatorSale}
}