const Unit = require('../models/UnitModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function getUnit(req, res) {
    try {
        let params = []

        if(req.query.search.value){
            params.push(`name ilike '%${req.query.search.value}%'`)
        }

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await Unit.totalTable()
        const filtered = await Unit.filteredTable(params)
        const data = await Unit.dataTable(params, sortBy, sortMode, limit, offset)
                
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

function addUnit(req, res) {
    res.render('units/unitsForm', {
        item: [],
        activeRoute: 'goodsUtility',
        title: 'POS - Units',
        activeUtil: 'units',
        user: req.session.user,
        formHeading: 'Form add'
    })
}

function saveUnit(req, res) {
    const { unit, name, note } = req.body
    Unit.addUnit(unit, name, note, function () {
        res.redirect('/units')
    })

}

function removeUnit(req, res) {
    const index = req.params.id
    Unit.remove(index, function () {
        res.redirect('/units')
    })
}

function getEdit(req, res) {
    const index = req.params.id
    Unit.getEdit(index, function (item) {
        res.render('units/unitsForm', {
            item,
            activeRoute: 'goodsUtility',
            title: 'POS - Units',
            activeUtil: 'units',
            user: req.session.user,
            formHeading: 'Form edit'
        })
    })
}

function updateUnit(req, res) {
    const oldUnit = req.params.id
    const unit = req.body.unit
    const name = req.body.name
    const note = req.body.note
    Unit.updateUnit(unit, name, note, oldUnit, function () {
        res.redirect('/units')
    })
}

module.exports = { getUnit, addUnit, saveUnit, removeUnit, getEdit, updateUnit }