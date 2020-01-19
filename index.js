const express = require('express');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg')

const connectionString = 'postgres://pathrcjxbkzlmi:398913e00f91c50e77d5fb249e0ce66c2df9fde58369aad3e68fa97b4e5f3c5f@ec2-174-129-33-13.compute-1.amazonaws.com:5432/d3g06p50108qd3?ssl=true'
const pool = new Pool({
    connectionString: connectionString
})
const app = express();
// app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    pool.query(`select * from datos`, (err, res2) => {

        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows);
        }
    });
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Escuchando en puerto ${PORT} ...`) })