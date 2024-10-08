module.exports = function(db){

    const User = require('../models/UserModel')(db)
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    async function getUser(req, res) {
        try {
            let params = []

            if(req.query.search.value){
                params.push(`name ilike '%${req.query.search.value}%'`)
            }

            const limit = req.query.length
            const offset = req.query.start
            const sortBy = req.query.columns[req.query.order[0].column].data
            const sortMode = req.query.order[0].dir

            const total = await User.totalTable()
            const filtered = await User.filteredTable(params)
            const data = await User.dataTable(params, sortBy, sortMode, limit, offset)
                    
            const response = {
                "draw": Number(req.query.draw),
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": filtered.rows[0].total,
                "data": data.rows
            }
            res.json(response)

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    function addUser(req, res) {
        res.render('users/usersForm', {
            item: [],
            activeRoute: 'users',
            title: 'POS - User',
            activeUtil: '',
            user: req.session.user,
            formHeading: 'Form add'
        })
    }

    function saveUser(req, res) {
        const { email, name, password, role } = req.body
        const hash = bcrypt.hashSync(password, saltRounds)
        User.addUser(email, name, hash, role, function () {
            res.redirect('/users')
        })

    }

    function removeUser(req, res) {
        const index = req.params.id
        User.remove(index, function () {
            res.redirect('/users')
        })
    }

    function getEdit(req, res) {
        const index = req.params.id
        User.getEdit(index, function (item) {
            res.render('users/usersForm', {
                item,
                activeRoute: 'users',
                title: 'POS - User',
                activeUtil: '',
                user: req.session.user,
                formHeading: 'Form edit'
            })
        })
    }

    function updateUser(req, res) {
        const index = req.params.id
        const email = req.body.email
        const name = req.body.name
        const role = req.body.role
        User.updateUser(email, name, role, index, function () {
            res.redirect('/users')
        })
    }

return { getUser, addUser, saveUser, removeUser, getEdit, updateUser }
}