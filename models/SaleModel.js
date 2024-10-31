module.exports = function(db){
        
    class Sale {

        constructor({ invoice, time, totalsum, pay, change, customer, operator }) {
            this.invoice = invoice
            this.time = time
            this.totalsum = totalsum
            this.pay = pay
            this.change = change
            this.customer = customer
            this.supplier = supplier
            this.operator = operator
        }

        static async invoiceInit(operator){
            return new Promise((resolve, reject)=>{
                const sql = `INSERT INTO sales (operator) VALUES ($1) RETURNING invoice`
                db.query(sql,[operator],(err,result)=>{
                    if (err){
                        console.log(err)
                        return reject(err)
                    }
                    resolve(result.rows[0])
                })
            })
        }

        static remove(invoice, callback){
            db.query('DELETE FROM sales WHERE invoice=$1', [invoice], function (err) {
                if (err) return console.log(err)
                callback()
            })
        }

        static removeItem(id, callback){
            db.query('DELETE FROM saleitems WHERE id=$1', [id], function (err) {
                if (err) return console.log(err)
                callback()
            })
        }

        static getEdit(invoice, callback){
            db.query('SELECT * FROM sales WHERE invoice=$1', [invoice], function (err, data) {
                if (err) { console.log(err) }
                else {callback(data.rows[0])}
            })
        }

        static updateSale(invoice, customer, totalsum, pay, change, operator, callback) {
            db.query('UPDATE sales SET  customer=$1, totalsum=$2, pay=$3, change=$4, operator=$5 WHERE invoice=$6 ',
                [customer, totalsum, pay, change, operator, invoice], function (err) {
                    if (err) return console.log(err)
                    callback()
                })
        }

        static async totalTable(){
            return new Promise((resolve, reject)=>{
                const sql = `SELECT count(*) as total FROM sales`
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
                const sql = `select count(*) as total from sales${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`
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
                const sql = `
                    SELECT sales.*, customers.name AS customer_name 
                    FROM sales
                    LEFT JOIN customers ON sales.customer = customers.customerid
                    ${params.length > 0 ? `WHERE ${params.join(' OR ')}` : ''} 
                    ORDER BY ${sortBy} ${sortMode} 
                    LIMIT ${limit} OFFSET ${offset}
                `;
                db.query(sql,(err,result)=>{
                    if (err){
                        console.log(err)
                        return reject(err)
                    }
                    resolve(result)
                })
            })
        }

        static async addSaleItem(invoice, barcode, qty, sellingPrice){
            return new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO saleitems (invoice, itemcode, quantity, sellingprice) VALUES ($1, $2, $3, $4) RETURNING *',
                    [invoice, barcode, qty, sellingPrice],
                    (err, result) => {
                        if (err) {
                            console.error('Error inserting selling item:', err);
                            return reject(err);
                        }
                        resolve(result.rows[0]); 
                    }
                );
            });
        }

        static async showSaleItem(invoice){
            return new Promise((resolve, reject)=>{
                const sql = `SELECT s.id, s.itemcode AS barcode, g.name, s.quantity, s.sellingprice,s.totalprice
                FROM saleitems s
                INNER JOIN goods g
                ON s.itemcode = g.barcode
                WHERE s.invoice = $1
                ORDER BY s.id ASC;`
                db.query(sql,[invoice],(err,result)=>{
                    if (err){
                        console.log(err)
                        return reject(err)
                    }
                    resolve(result.rows)
                })
            })
        }

        static async getDate(){
            return new Promise((resolve, reject)=>{
                const sql = `SELECT time FROM sales`
                db.query(sql,(err,result)=>{
                    if (err){
                        console.log(err)
                        return reject(err)
                    }
                    resolve(result.rows)
                })
            })
        }

        static async getSale(startDate, endDate){
            if(typeof(endDate)==="string"){
                const endDateObj = new Date(endDate)
                endDateObj.setHours(23, 59, 59, 999)
                endDate = endDateObj
            } else {
                endDate.setHours(23, 59, 59, 999)
            }

            return new Promise((resolve, reject)=>{
                const sql = `SELECT * FROM sales WHERE time>=$1 AND time<=$2 ORDER BY time ASC`
                db.query(sql,[startDate,endDate],(err,result)=>{
                    if (err){
                        console.log(err)
                        return reject(err)
                    }
                    resolve(result.rows)
                })
            })
        } 

    }

return Sale
}