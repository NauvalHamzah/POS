const { Pool } = require ('pg')
 
const db = new Pool({
  user: 'nauval',
  password: 'nauval3107',
  host: 'localhost',
  port: 5432,
  database: 'c23Users',
})

module.exports = {db}