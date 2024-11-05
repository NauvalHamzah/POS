module.exports = function(db){

    class User {

        constructor({ id, email, name, password, role }) {
            this.id = id || null
            this.email = email
            this.name = name
            this.password = password
            this.role = role
        }

        static getUser(email,callback){
            db.query('SELECT * FROM users WHERE email = $1', [email], function (err, data) {
                if (err) { console.log(err) }
                else {callback(data.rows)}
            })
        }

        static addUser(email, name, password, role, callback){
            db.query('INSERT INTO users (email, name,  password, role) VALUES ($1,$2,$3,$4)',
                [email, name, password, role], function (err) {
                    if (err) return console.log(err)
                    callback()
                })
        }

        static remove(index, callback){
            db.query('DELETE FROM users WHERE userid=$1', [index], function (err) {
                if (err) return console.log(err)
                callback()
            })
        }

        static getEdit(index, callback){
            db.query('SELECT * FROM users WHERE userid=$1', [index], function (err, data) {
                if (err) { console.log(err) }
                else {callback(data.rows[0])}
            })
        }

        static updateUser(email, name, role, index, callback) {
            db.query('UPDATE users SET email=$1,name=$2,role=$3 WHERE userid=$4',
                [email, name, role, index], function (err) {
                    if (err) return console.log(err)
                    callback()
                })
        }

        static updateProfile(email, name, index, callback) {
            db.query('UPDATE users SET email=$1,name=$2 WHERE userid=$3',
                [email, name, index], function (err) {
                    if (err) return console.log(err)
                    callback()
                })
        }

        static updatePassword(password, email, callback){
            db.query('UPDATE users SET password=$1 WHERE email=$2',
                [password, email], function (err) {
                    if (err) return console.log(err)
                    callback()
                })
        }

        static async totalTable(){
            return new Promise((resolve, reject)=>{
                const sql = `select count(*) as total from users`
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
                const sql = `select count(*) as total from users${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`
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
                const sql = `select * from users${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `
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

return User
}