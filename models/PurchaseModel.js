module.exports = function(db){
        
    class Purchase {

        constructor({ invoice, time, totalsum, supplier, operator }) {
            this.invoice = invoice
            this.time = time
            this.totalsum = totalsum
            this.supplier = supplier
            this.operator = operator
        }

        static async invoiceInit(operator){
            return new Promise((resolve, reject)=>{
                const sql = `INSERT INTO purchases (operator) VALUES ($1) RETURNING invoice`
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
            db.query('DELETE FROM purchases WHERE invoice=$1', [invoice], function (err) {
                if (err) return console.log(err)
                callback()
            })
        }

        static removeItem(id, callback){
            db.query('DELETE FROM purchaseitems WHERE id=$1', [id], function (err) {
                if (err) return console.log(err)
                callback()
            })
        }

        static getEdit(invoice, callback){
            db.query('SELECT * FROM purchases WHERE invoice=$1', [invoice], function (err, data) {
                if (err) { console.log(err) }
                else {callback(data.rows[0])}
            })
        }

        static updatePurchase(invoice, supplier, totalsum, operator, callback) {
            db.query('UPDATE purchases SET  supplier=$1, totalsum=$2, operator=$3 WHERE invoice=$4 ',
                [supplier, totalsum, operator, invoice], function (err) {
                    if (err) return console.log(err)
                    callback()
                })
        }

        static async totalTable(){
            return new Promise((resolve, reject)=>{
                const sql = `SELECT count(*) as total FROM purchases`
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
                const sql = `select count(*) as total from purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`
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
                    SELECT purchases.*, suppliers.name AS supplier_name 
                    FROM purchases
                    LEFT JOIN suppliers ON purchases.supplier = suppliers.supplierid
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

        static async addPurchaseItem(invoice, barcode, qty, purchasePrice){
            return new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO purchaseitems (invoice, itemcode, quantity, purchaseprice) VALUES ($1, $2, $3, $4) RETURNING *',
                    [invoice, barcode, qty, purchasePrice],
                    (err, result) => {
                        if (err) {
                            console.error('Error inserting purchase item:', err);
                            return reject(err);
                        }
                        resolve(result.rows[0]); 
                    }
                );
            });
        }

        static async showPurchaseItem(invoice){
            return new Promise((resolve, reject)=>{
                const sql = `SELECT p.id, p.itemcode AS barcode, g.name, p.quantity, p.purchaseprice,p.totalprice
                FROM purchaseitems p
                INNER JOIN goods g
                ON p.itemcode = g.barcode
                WHERE p.invoice = $1
                ORDER BY p.id ASC;`
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
                const sql = `SELECT time FROM purchases`
                db.query(sql,(err,result)=>{
                    if (err){
                        console.log(err)
                        return reject(err)
                    }
                    resolve(result.rows)
                })
            })
        }

        static async getPurchase(startDate, endDate){
            if(typeof(endDate)==="string"){
                const endDateObj = new Date(endDate)
                endDateObj.setHours(23, 59, 59, 999)
                endDate = endDateObj
            } else {
                endDate.setHours(23, 59, 59, 999)
            }

            return new Promise((resolve, reject)=>{
                const sql = `SELECT * FROM purchases WHERE time>=$1 AND time<=$2 ORDER BY time ASC`
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

return Purchase
}