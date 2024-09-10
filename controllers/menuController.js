function dashboard(req, res) {
    res.render('dashboard', {
        activeRoute: 'dashboard',
        title: 'POS - Dashboard',
        activeUtil: '',
        user: req.session.user
    })
}

function goods(req, res) {
    res.render('goods', {
        activeRoute: 'goodsUtility',
        title: 'POS - Goods',
        activeUtil: 'goods',
        user: req.session.user
    })
}

function units(req, res) {
    res.render('units', {
        activeRoute: 'goodsUtility',
        title: 'POS - Units',
        activeUtil: 'units',
        user: req.session.user
    })

}

function suppliers(req, res) {
    res.render('suppliers', {
        activeRoute: 'suppliers',
        title: 'POS - Suppliers',
        activeUtil: '', user: req.session.user
    })
}

function customers(req, res) {
    res.render('customers', {
        activeRoute: 'customers',
        title: 'POS - Customers',
        activeUtil: '',
        user: req.session.user
    })
}

function users(req, res) {
    res.render('users', {
        activeRoute: 'users',
        title: 'POS - Users',
        activeUtil: '',
        user: req.session.user
    })
}

function purchases(req, res) {
    res.render('purchases', {
        activeRoute: 'purchases',
        title: 'POS - Purchases',
        activeUtil: '',
        user: req.session.user
    })
}

function sales(req, res) {
    res.render('sales', {
        activeRoute: 'sales',
        title: 'POS - Sales',
        activeUtil: '',
        user: req.session.user
    })
}

module.exports = { dashboard, goods, units, suppliers, customers, users, purchases, sales }