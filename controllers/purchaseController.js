const Purchase = require('../models/PurchaseModel')
const Goods = require('../models/GoodsModel')
const Supplier = require('../models/SupplierModel')

async function getPurchase(req, res) {
    try {
        let params = []

        if(req.query.search.value){
            params.push(`invoice ilike '%${req.query.search.value}%'`)
        }

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await Purchase.totalTable()
        const filtered = await Purchase.filteredTable(params)
        const data = await Purchase.dataTable(params, sortBy, sortMode, limit, offset)
                
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

async function addPurchase(req, res) {
    try{
        const user = req.session.user.id
        const newPurchase = await Purchase.invoiceInit(user)
        const newInvoice = newPurchase.invoice;
        res.redirect(`/purchases/edit/${newInvoice}`);
    }
    catch(error){
        console.error("Error adding purchase: ", error);
        res.status(500).send("Error adding purchase");
    }
}


function removePurchase(req, res) {
    const invoice = req.params.id
    Purchase.remove(invoice, function () {
        res.redirect('/purchases')
    })
}

function removePurchaseItem(req, res) {
    const id = req.params.id
    Purchase.removeItem(id, function () {
        res.sendStatus(200)
    })
}

async function getEdit(req, res) {
    const invoice = req.params.id
    const goods = await Goods.getGoods()
    const suppliers = await Supplier.getSuppliers()
    Purchase.getEdit(invoice, function (item) {
        let time = formatTime(item.time)
        res.render('purchases/purchasesForm', {
            item,
            activeRoute: 'purchases',
            title: 'POS - Purchases',
            activeUtil: '',
            user: req.session.user,
            time,
            goods,
            suppliers
        })
    })
}

function updatePurchase(req, res) {
    const invoice = req.body.invoice
    const supplier = req.body.supplier
    const totalsum = req.body.totalSummaryActual
    const operator = req.body.operatorid
    Purchase.updatePurchase(invoice, supplier, totalsum, operator, function () {
        res.redirect('/purchases')
    })
}

async function showPurcaseItem(req, res){
    try {
        const purchasedItems = await Purchase.showPurchaseItem(req.params.invoice)
        res.status(200).json(purchasedItems)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
}

async function addPurchaseItem(req, res){
    const { invoice, barcode, qty, purchasePrice } = req.body
    try{
        result = await Purchase.addPurchaseItem(invoice, barcode, qty, purchasePrice) 
        const purchasedItems = await Purchase.showPurchaseItem(invoice)
        res.json({ success: true, purchasedItems: purchasedItems })
    } catch (err){
        console.log('Error adding purchase item:', err);
        res.status(500).json({ success: false, message: 'Failed to add purchase item' });
    }
}

function formatTime(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString)).replace(',', '');
}

module.exports = { getPurchase, addPurchase, removePurchase, removePurchaseItem, getEdit, updatePurchase, showPurcaseItem, addPurchaseItem }