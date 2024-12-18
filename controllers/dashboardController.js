const { createObjectCsvStringifier } = require('csv-writer');

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

        const countSalesDirect = sales.reduce((acc, sales) => {
            return sales.customer === 1 ? acc + 1 : acc;
          }, 0);

        areaChartData.earnings = areaChartData.sales.map((sale, i) => sale - areaChartData.purchase[i]);
      
        res.render('dashboard/dashboard', {
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
            countSalesDirect
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

    function report(req, res) {
        const areaChartData = req.body; // Receive the data from the client
    
        // Format data for CSV
        const csvData = areaChartData.month.map((month, index) => ({
            Month: month,
            Expense: areaChartData.purchase[index],
            Revenue: areaChartData.sales[index],
            Earning: areaChartData.earnings[index]
        }));
    
        // Set up CSV stringifier with headers
        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'Month', title: 'Month' },
                { id: 'Expense', title: 'Expense' },
                { id: 'Revenue', title: 'Revenue' },
                { id: 'Earning', title: 'Earning' }
            ]
        });
    
        // Generate CSV content with headers
        const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
    
        // Send CSV as a downloadable file
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
        res.send(csvContent);
    }

return { dashboard, report }
}