module.exports = function(db){

    const Purchase = require('../models/PurchaseModel')(db)
    const Sales = require('../models/SaleModel')(db)

    async function dashboard(req, res) {
        const purchaseTime = await Purchase.getDate()
        const saleTime = await Sales.getDate()
        const combinedTime = [...purchaseTime,...saleTime]
        const minTime = new Date(Math.min(...combinedTime.map(item => new Date(item.time))));
        const maxTime = new Date(Math.max(...combinedTime.map(item => new Date(item.time))));

        const startDate = req.query.startDate || minTime
        const endDate = req.query.endDate || maxTime

        const purchases = await Purchase.getPurchase(startDate,endDate)
        const sales = await Sales.getSale(startDate,endDate)

        const totalPurchases = purchases.reduce((sum, purchase) => sum + Number(purchase.totalsum), 0);
        const totalSales = sales.reduce((sum, sale) => sum + Number(sale.totalsum), 0);
        const countSales = sales.length

        let areaChartData = {}
        areaChartData.month = getMonth(startDate,endDate)
        areaChartData.purchase = Array(areaChartData.month.length).fill(0);
        areaChartData.sales = Array(areaChartData.month.length).fill(0);
        areaChartData.earnings = Array(areaChartData.month.length).fill(0);

        purchases.forEach(element => {
            element.month = new Date(element.time).toLocaleDateString('en-GB', {
                month: 'short',
                year: '2-digit'
            });
            index = areaChartData.month.indexOf(element.month)
            areaChartData.purchase[index]+= Number(element.totalsum)
        });
        

        sales.forEach(element => {
            element.month = new Date(element.time).toLocaleDateString('en-GB', {
                month: 'short',
                year: '2-digit'
            });
            index = areaChartData.month.indexOf(element.month)
            areaChartData.sales[index]+= Number(element.totalsum)
        });

        const totalSalesDirect = sales.reduce((acc, sales) => {
            return sales.customer === 1 ? acc + parseFloat(sales.totalsum) : acc;
          }, 0);

        areaChartData.earnings = areaChartData.sales.map((sale, i) => sale - areaChartData.purchase[i]);
      
        res.render('dashboard', {
            activeRoute: 'dashboard',
            title: 'POS - Dashboard',
            activeUtil: '',
            user: req.session.user,
            totalPurchases,
            totalSales,
            countSales,
            startDate,
            endDate,
            areaChartData,
            totalSalesDirect
        })
    }

    function goods(req, res) {
        res.render('goods', {
            activeRoute: 'goodsUtility',
            title: 'POS - Goods',
            activeUtil: 'goods',
            user: req.session.user
        })
    }

    function units(req, res) {
        res.render('units', {
            activeRoute: 'goodsUtility',
            title: 'POS - Units',
            activeUtil: 'units',
            user: req.session.user
        })

    }

    function suppliers(req, res) {
        res.render('suppliers', {
            activeRoute: 'suppliers',
            title: 'POS - Suppliers',
            activeUtil: '', user: req.session.user
        })
    }

    function customers(req, res) {
        res.render('customers', {
            activeRoute: 'customers',
            title: 'POS - Customers',
            activeUtil: '',
            user: req.session.user
        })
    }

    function users(req, res) {
        res.render('users', {
            activeRoute: 'users',
            title: 'POS - Users',
            activeUtil: '',
            user: req.session.user
        })
    }

    function purchases(req, res) {
        res.render('purchases', {
            activeRoute: 'purchases',
            title: 'POS - Purchases',
            activeUtil: '',
            user: req.session.user
        })
    }

    function sales(req, res) {
        res.render('sales', {
            activeRoute: 'sales',
            title: 'POS - Sales',
            activeUtil: '',
            user: req.session.user
        })
    }

    function getMonth(startDate, endDate) {
        let result = [];
        let current = new Date(startDate);
        endDate = new Date(endDate);
    
        while (current <= endDate) {
            let monthYear = current.toLocaleDateString('en-GB', {
                month: 'short',
                year: '2-digit'
            });
            result.push(monthYear);
    
            current.setMonth(current.getMonth() + 1);
        }
    
        return result;
    }

return { dashboard, goods, units, suppliers, customers, users, purchases, sales }
}