const express = require('express');
const postgresql = require('pg');
const bodyParser = require('body-parser');
// const cors = require('cors');

const app = express();
// app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("hola mundo!")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Escuchando en puerto ${PORT} ...`) })