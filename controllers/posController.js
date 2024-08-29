const bcrypt = require('bcrypt');
const { db } = require('../models/pg');

function loginGet(req, res) {
    res.render('login', {
        failedMessage: req.flash('failedMessage'),
        successMessage: req.flash('successMessage')
    })
}

function login(req, res){
    const { email, password } = req.body

    db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email], function (err, user) {
        if (err) { 
            console.log(err) 
            return res.redirect('/')
        }
        
        if (!user.rows[0]) {
            console.log("No email")
            req.flash('failedMessage', `User with email ${email} is not registered.`)
            res.redirect('/')
        } else{
                if (bcrypt.compareSync(password, user.rows[0].password)) {
                    req.session.user = { id: user.rows[0].userid, email: user.rows[0].email, name: user.rows[0].name }
                    res.redirect('/dashboard')
                } else {
                    req.flash('failedMessage', 'password is wrong')
                    res.redirect('/')
                }
        }
    })
}

function logout(req, res) {
    req.session.destroy(function (err) {
        res.redirect('/')
    })
}

function dashboard(req, res) {
    res.render('dashboard', { 
        activeRoute: 'dashboard', 
        title: 'POS - Dashboard',
        activeUtil: '', 
        user:req.session.user })
}

function goodsUtil1(req, res) {
    res.render('goodsUtil1', { 
        activeRoute: 'goodsUtility',
        title: 'POS - Good Utility',
        activeUtil: 'util1', 
        user:req.session.user })
}

function goodsUtil2(req, res) {
    res.render('goodsUtil2', { 
        activeRoute: 'goodsUtility', 
        title: 'POS - Good Utility',
        activeUtil: 'util2', 
        user:req.session.user })
}

function goodsUtil3(req, res) {
    res.render('goodsUtil3', { 
        activeRoute: 'goodsUtility', 
        title: 'POS - Good Utility',
        activeUtil: 'util3', 
        user:req.session.user })
}

function suppliers(req, res) {
    res.render('suppliers', { 
        activeRoute: 'suppliers', 
        title: 'POS - Suppliers',
        activeUtil: '', user:req.session.user  })
}

function customers(req, res) {
    res.render('customers', { 
        activeRoute: 'customers', 
        title: 'POS - Customers',
        activeUtil: '', 
        user:req.session.user  })
}

function users(req, res) {
    db.query("SELECT * from users ORDER BY userid",function(err,data){
        if (err) { console.log(err) }
        else { 
            userData=data.rows;
            res.render('users', { 
                userData, 
                activeRoute: 'users',
                title: 'POS - Users', 
                activeUtil: '', 
                user:req.session.user  })
        }
    })
}

function purchases(req, res) {
    res.render('purchases', { 
        activeRoute: 'purchases', 
        title: 'POS - Purchases', 
        activeUtil: '', 
        user:req.session.user  })
}

function sales(req, res) {
    res.render('sales', { 
        activeRoute: 'sales', 
        title: 'POS - Sales', 
        activeUtil: '', 
        user:req.session.user  })
}


module.exports = { loginGet, login, logout, dashboard, goodsUtil1, goodsUtil2, goodsUtil3, suppliers, customers, users, purchases, sales }