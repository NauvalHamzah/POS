const { db } = require('./pg')

class Customer {

    constructor({ customerid, name, address, phone }) {
        this.customerid = customerid || null
        this.name = name
        this.address = address
        this.phone = phone
    }

    static addCustomer(name, address, phone, callback){
        db.query('INSERT INTO customers (name, address, phone) VALUES ($1,$2,$3)',
            [name, address, phone], function (err) {
                if (err) return console.log(err)
                callback()
            })
    }

    static remove(index, callback){
        db.query('DELETE FROM customers WHERE customerid=$1', [index], function (err) {
            if (err) return console.log(err)
            callback()
        })
    }

    static getEdit(index, callback){
        db.query('SELECT * FROM customers WHERE customerid=$1', [index], function (err, data) {
            if (err) { console.log(err) }
            else {callback(data.rows[0])}
        })
    }

    static updateCustomer(name, address, phone, index, callback) {
        db.query('UPDATE customers SET name=$1,address=$2,phone=$3 WHERE customerid=$4',
            [name, address, phone, index], function (err) {
                if (err) return console.log(err)
                callback()
            })
    }

    static async totalTable(){
        return new Promise((resolve, reject)=>{
            const sql = `select count(*) as total from customers`
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
            const sql = `select count(*) as total from customers${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`
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
            const sql = `select * from customers${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `
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

module.exports = Customer