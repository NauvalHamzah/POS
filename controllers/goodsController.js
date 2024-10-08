module.exports = function(db){

    const Goods = require('../models/GoodsModel')(db)
    const Unit = require('../models/UnitModel')(db)
    const multer = require('multer');
    const path = require('path')


    async function getGoods(req, res) {
        try {
            let params = []

            if (req.query.search.value) {
                params.push(`name ilike '%${req.query.search.value}%'`)
            }

            const limit = req.query.length
            const offset = req.query.start
            const sortBy = req.query.columns[req.query.order[0].column].data
            const sortMode = req.query.order[0].dir

            const total = await Goods.totalTable()
            const filtered = await Goods.filteredTable(params)
            const data = await Goods.dataTable(params, sortBy, sortMode, limit, offset)

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

    async function addGoods(req, res) {
        const units = await Unit.getUnitOnly()
        res.render('goods/goodsForm', {
            item: [],
            activeRoute: 'goodsUtility',
            title: 'POS - Goods',
            activeUtil: 'goods',
            user: req.session.user,
            formHeading: 'Form add',
            units: units
        })
    }

    function saveGoods(req, res) {
        const { barcode, name, stock, purchasePrice, sellingPrice, unit } = req.body

        const newName = !name ? "" : name
        const newStock = !stock ? 0 : stock
        const newPurchasePrice = !purchasePrice ? 0 : purchasePrice
        const newSellingPrice = !sellingPrice ? 0 : sellingPrice

        let uploadPath = '/images/No_Preview.png';
        if (req.file) {
            uploadPath = path.join('/images', req.file.filename);
        }

        Goods.addGoods(barcode, newName, newStock, newPurchasePrice, newSellingPrice, unit, uploadPath, function () {
            res.redirect('/goods')
        })

    }

    function removeGoods(req, res) {
        const index = req.params.id
        Goods.remove(index, function () {
            res.redirect('/goods')
        })
    }

    async function getEdit(req, res) {
        const index = req.params.id
        const units = await Unit.getUnitOnly()
        Goods.getEdit(index, function (item) {
            res.render('goods/goodsForm', {
                item,
                activeRoute: 'goodsUtility',
                title: 'POS - Goods',
                activeUtil: 'goods',
                user: req.session.user,
                formHeading: 'Form edit',
                units: units
            })
        })
    }

    function updateGoods(req, res) {
        const { barcode, name, stock, purchasePrice, sellingPrice, unit } = req.body
        Goods.getEdit(barcode, function (item) {
            let uploadPath = item.picture;
            if (req.file) {
                uploadPath = path.join('/images', req.file.filename);
            }
            Goods.updateGoods(barcode, name, stock, purchasePrice, sellingPrice, unit, uploadPath, function () {
                res.redirect('/goods')
            })
        })
    }

return { getGoods, addGoods, saveGoods, removeGoods, getEdit, updateGoods }
}