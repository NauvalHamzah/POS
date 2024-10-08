module.exports = function(db){

    const Customer = require('../models/CustomerModel')(db)

    async function getCustomer(req, res) {
        try {
            let params = []

            if(req.query.search.value){
                const searchValue = `%${req.query.search.value}%`;
                params.push(`(name ILIKE '${searchValue}' OR address ILIKE '${searchValue}' OR phone ILIKE '${searchValue}')`);
            }

            const limit = req.query.length
            const offset = req.query.start
            const sortBy = req.query.columns[req.query.order[0].column].data
            const sortMode = req.query.order[0].dir

            const total = await Customer.totalTable()
            const filtered = await Customer.filteredTable(params)
            const data = await Customer.dataTable(params, sortBy, sortMode, limit, offset)
                    
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

    function addCustomer(req, res) {
        res.render('customers/customersForm', {
            item: [],
            activeRoute: 'customers',
            title: 'POS - Customers',
            activeUtil: '',
            user: req.session.user,
            formHeading: 'Form add'
        })
    }

    function saveCustomer(req, res) {
        const { name, address, phone } = req.body
        Customer.addCustomer(name, address, phone, function () {
            res.redirect('/customers')
        })

    }

    function removeCustomer(req, res) {
        const index = req.params.id
        Customer.remove(index, function () {
            res.redirect('/customers')
        })
    }

    function getEdit(req, res) {
        const index = req.params.id
        Customer.getEdit(index, function (item) {
            res.render('customers/customersForm', {
                item,
                activeRoute: 'customers',
                title: 'POS - Customers',
                activeUtil: '',
                user: req.session.user,
                formHeading: 'Form edit'
            })
        })
    }

    function updateCustomer(req, res) {
        const index = req.params.id
        const name = req.body.name
        const address = req.body.address
        const phone = req.body.phone
        Customer.updateCustomer(name, address, phone, index, function () {
            res.redirect('/customers')
        })
    }

return { getCustomer, addCustomer, saveCustomer, removeCustomer, getEdit, updateCustomer }
}