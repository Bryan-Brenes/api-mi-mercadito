const express = require('express');
const postgresql = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("hola mundo!")
})


var puerto = 3000 || process.env.PORT;
app.listen(puerto, () => {
    console.log(`Escuchando en puerto ${puerto}`);
});