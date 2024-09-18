const { db } = require('./pg')

class Goods {

    constructor({ barcode, name, stock, purchasePrice, sellingPrice, unit, picture }) {
        this.barcode = barcode        
        this.name = name
        this.stock = stock || 0
        this.purchasePrice = purchasePrice || 0
        this.sellingPrice = sellingPrice || 0
        this.unit = unit
        this.picture = picture || "/images/No_Preview"

    }

    static addGoods(barcode, name, stock, purchasePrice, sellingPrice, unit, picture, callback){
        db.query('INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            [barcode, name, stock, purchasePrice, sellingPrice, unit, picture], function (err) {
                if (err) return console.log(err)
                callback()
            })
    }

    static remove(index, callback){
        db.query('DELETE FROM goods WHERE barcode=$1', [index], function (err) {
            if (err) return console.log(err)
            callback()
        })
    }

    static getEdit(index, callback){
        db.query('SELECT * FROM goods WHERE barcode=$1', [index], function (err, data) {
            if (err) { console.log(err) }
            else {callback(data.rows[0])}
        })
    }

    static updateGoods(barcode, name, stock, purchasePrice, sellingPrice, unit, picture, callback) {
        db.query('UPDATE goods SET name=$1, stock=$2, purchaseprice=$3, sellingprice=$4, unit=$5, picture=$6 WHERE barcode=$7',
            [name, stock, purchasePrice, sellingPrice, unit, picture, barcode], function (err) {
                if (err) return console.log(err)
                callback()
            })
    }

    static async totalTable(){
        return new Promise((resolve, reject)=>{
            const sql = `select count(*) as total from goods`
            db.query(sql,(err,result)=>{
                if (err){
                    console.log(err)
                    return reject(err)
                }
                resolve(result)
            })
        })
    }

    static async filteredTable(params){
        return new Promise((resolve, reject)=>{
            const sql = `select count(*) as total from goods${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`
            db.query(sql,(err,result)=>{
                if (err){
                    console.log(err)
                    return reject(err)
                }
                resolve(result)
            })
        })
    }

    static async dataTable(params, sortBy, sortMode, limit, offset){
        return new Promise((resolve, reject)=>{
            const sql = `select * from goods${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `
            db.query(sql,(err,result)=>{
                if (err){
                    console.log(err)
                    return reject(err)
                }
                resolve(result)
            })
        })
    }

}

module.exports = Goods