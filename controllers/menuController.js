const User = require('../models/UserModel')

function dashboard(req, res) {
    res.render('dashboard', {
        activeRoute: 'dashboard',
        title: 'POS - Dashboard',
        activeUtil: '',
        user: req.session.user
    })
}

function goodsUtil1(req, res) {
    res.render('goodsUtil1', {
        activeRoute: 'goodsUtility',
        title: 'POS - Good Utility',
        activeUtil: 'util1',
        user: req.session.user
    })
}

function goodsUtil2(req, res) {
    res.render('goodsUtil2', {
        activeRoute: 'goodsUtility',
        title: 'POS - Good Utility',
        activeUtil: 'util2',
        user: req.session.user
    })
}

function goodsUtil3(req, res) {
    res.render('goodsUtil3', {
        activeRoute: 'goodsUtility',
        title: 'POS - Good Utility',
        activeUtil: 'util3',
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
    User.getAllUser(function (userData) {
        res.render('users', {
            userData,
            activeRoute: 'users',
            title: 'POS - Users',
            activeUtil: '',
            user: req.session.user
        })
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

module.exports = { dashboard, goodsUtil1, goodsUtil2, goodsUtil3, suppliers, customers, users, purchases, sales }