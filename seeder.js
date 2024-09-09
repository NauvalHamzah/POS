const { db } = require('./models/pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let data = [];

for (let i = 0; i < 50; i++) {
    data[i] = {
        name: `User${i + 1}`,
        email: `User${i + 1}@rubicamp.com`,
        password: "12345",
        role: "Admin"
    };
    if(i>24){
        data[i].role = "Operator"
    }
    const hash = bcrypt.hashSync(data[i].password, saltRounds)
    data[i].password = hash
}

    const query = `
    INSERT INTO users (name, email, password, role) 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) 
    DO UPDATE SET 
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role
    `;

async function insertData(data) {
    for (let i = 0; i < data.length; i++) {
        try {
            await db.query(query, [data[i].name, data[i].email, data[i].password, data[i].role]);
            console.log(`User ${i + 1} inserted/updated`);
        } catch (err) {
            console.log(err);
        }
    }
}

insertData(data)

