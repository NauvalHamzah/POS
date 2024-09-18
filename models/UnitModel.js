const { db } = require('./pg')

class Unit {

    constructor({ unit, name, note }) {
        this.unit = unit || null
        this.name = name
        this.note = note
    }

    static addUnit(unit, name, note, callback){
        db.query('INSERT INTO units (unit, name, note) VALUES ($1,$2,$3)',
            [unit, name, note], function (err) {
                if (err) return console.log(err)
                callback()
            })
    }

    static remove(index, callback){
        db.query('DELETE FROM units WHERE unit=$1', [index], function (err) {
            if (err) return console.log(err)
            callback()
        })
    }

    static async getUnitOnly(){
        return new Promise((resolve, reject)=>{
            const sql = `SELECT unit from units`
            db.query(sql,(err,result)=>{
                if (err){
                    console.log(err)
                    return reject(err)
                }
                resolve(result.rows)
            })
        })
    }

    static getEdit(index, callback){
        db.query('SELECT * FROM units WHERE unit=$1', [index], function (err, data) {
            if (err) { console.log(err) }
            else {callback(data.rows[0])}
        })
    }

    static updateUnit(unit, name, note, oldUnit, callback) {
        db.query('UPDATE units SET unit=$1,name=$2,note=$3 WHERE unit=$4',
            [unit, name, note, oldUnit], function (err) {
                if (err) return console.log(err)
                callback()
            })
    }

    static async totalTable(){
        return new Promise((resolve, reject)=>{
            const sql = `select count(*) as total from units`
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
            const sql = `select count(*) as total from units${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`
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
            const sql = `select * from units${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `
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

module.exports = Unit