module.exports = function(db){

    const Sale = require('../models/SaleModel')(db)
    const Goods = require('../models/GoodsModel')(db)
    const Customer = require('../models/CustomerModel')(db)

    async function getSale(req, res) {
        try {
            let params = []

            if(req.query.search.value){
                params.push(`invoice ilike '%${req.query.search.value}%'`)
            }

            const limit = req.query.length
            const offset = req.query.start
            const sortBy = req.query.columns[req.query.order[0].column].data
            const sortMode = req.query.order[0].dir

            const total = await Sale.totalTable()
            const filtered = await Sale.filteredTable(params)
            const data = await Sale.dataTable(params, sortBy, sortMode, limit, offset)

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

    async function addSale(req, res) {
        try{
            const user = req.session.user.id
            const newSale = await Sale.invoiceInit(user)
            const newInvoice = newSale.invoice;
            res.redirect(`/sales/edit/${newInvoice}`);
        }
        catch(error){
            console.error("Error adding sales: ", error);
            res.status(500).send("Error adding sales");
        }
    }

    function removeSale(req, res) {
        const invoice = req.params.id
        Sale.remove(invoice, function () {
            res.redirect('/sales')
        })
    }

    function removeSaleItem(req, res) {
        const id = req.params.id
        Sale.removeItem(id, function () {
            res.sendStatus(200)
        })
    }

    async function getEdit(req, res) {
        const invoice = req.params.id
        const goods = await Goods.getGoods()
        const customers = await Customer.getCustomers()
        Sale.getEdit(invoice, function (item) {
            let time = formatTime(item.time)
            res.render('sales/salesForm', {
                item,
                activeRoute: 'sales',
                title: 'POS - Sales',
                activeUtil: '',
                user: req.session.user,
                time,
                goods,
                customers
            })
        })
    }

    function updateSale(req, res) {
        const invoice = req.body.invoice
        const customer = req.body.customer
        const totalsum = req.body.totalSummaryActual
        const pay = req.body.pay || 0
        const change = req.body.changeActual || 0
        const operator = req.body.operatorid
        Sale.updateSale(invoice, customer, totalsum, pay, change, operator, function () {
            res.redirect('/sales')
        })
    }

    async function showSaleItem(req, res){
        try {
            const saleItems = await Sale.showSaleItem(req.params.invoice)
            res.status(200).json(saleItems)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async function addSaleItem(req, res){
        const { invoice, barcode, qty, sellingPrice } = req.body
        try{
            result = await Sale.addSaleItem(invoice, barcode, qty, sellingPrice) 
            const saleItems = await Sale.showSaleItem(invoice)
            res.json({ success: true, saleItems: saleItems })
        } catch (err){
            console.log('Error adding sale item:', err);
            res.status(500).json({ success: false, message: 'Failed to add sale item' });
        }
    }

    function formatTime(dateString) {
        const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString)).replace(',', '');
    }

return { getSale, addSale, removeSale, removeSaleItem, getEdit, updateSale, showSaleItem, addSaleItem }
}