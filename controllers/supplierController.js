module.exports = function(db){

    const Supplier = require('../models/SupplierModel')(db)

    function suppliers(req, res) {
        res.render('suppliers/suppliers', {
            activeRoute: 'suppliers',
            title: 'POS - Suppliers',
            activeUtil: '', user: req.session.user
        })
    }

    async function getSupplier(req, res) {
        try {
            let params = []

            if(req.query.search.value){
                params.push(`name ilike '%${req.query.search.value}%'`)
            }

            const limit = req.query.length
            const offset = req.query.start
            const sortBy = req.query.columns[req.query.order[0].column].data
            const sortMode = req.query.order[0].dir

            const total = await Supplier.totalTable()
            const filtered = await Supplier.filteredTable(params)
            const data = await Supplier.dataTable(params, sortBy, sortMode, limit, offset)
                    
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

    function addSupplier(req, res) {
        res.render('suppliers/suppliersForm', {
            item: [],
            activeRoute: 'suppliers',
            title: 'POS - Suppliers',
            activeUtil: '',
            user: req.session.user,
            formHeading: 'Form add'
        })
    }

    function saveSupplier(req, res) {
        const { name, address, phone } = req.body
        Supplier.addSupplier(name, address, phone, function () {
            res.redirect('/suppliers')
        })

    }

    function removeSupplier(req, res) {
        const index = req.params.id
        Supplier.remove(index, function () {
            res.redirect('/suppliers')
        })
    }

    function getEdit(req, res) {
        const index = req.params.id
        Supplier.getEdit(index, function (item) {
            res.render('suppliers/suppliersForm', {
                item,
                activeRoute: 'suppliers',
                title: 'POS - Supplier',
                activeUtil: '',
                user: req.session.user,
                formHeading: 'Form edit'
            })
        })
    }

    function updateSupplier(req, res) {
        const index = req.params.id
        const name = req.body.name
        const address = req.body.address
        const phone = req.body.phone
        Supplier.updateSupplier(name, address, phone, index, function () {
            res.redirect('/suppliers')
        })
    }

return { suppliers, getSupplier, addSupplier, saveSupplier, removeSupplier, getEdit, updateSupplier }
}