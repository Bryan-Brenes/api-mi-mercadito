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

/**
 * Registrar un cliente nuevo
 */
app.post('/cliente', (req, res) => {

    var email = req.body.email;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var fechaNac = req.body.fechaNacimiento;
    var contrasena = req.body.contrasena;
    var telefono = req.body.telefono;

    pool.query(`select ingresarCliente('${email}', '${nombre}', '${apellido}', '${fechaNac}', '${contrasena}', '${telefono}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            var user1 = res2.rows[1]
            if (user1.ingresarCliente == 'error') {
                res.send('error');
            } else {
                res.send('listo');
            }
        }
    });
})

app.post('/solicitudComerciante', (req, res) => {
    var email = req.body.email;
    var contrasena = req.body.contrasena;
    var nombre = req.body.nombre;
    var telefono = req.body.telefono;
    var ubicacion = req.body.ubicacion;
    var nombreCuenta = req.body.nombreCuenta;
    var numeroCuenta = req.body.numeroCuenta;

    pool.query(`select agregarSolicitudComerciante('${email}', '${contrasena}', '${nombre}', '${telefono}', '${ubicacion}', '${nombreCuenta}','${numeroCuenta}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            if (res2.rowCount != 0) {
                var resultado = res2.rows[0].agregarSolicitudComerciante;
                if (resultado == 'False') {
                    res.send('error');
                } else {
                    res.send('listo');
                }
            } else {
                res.send('error')
            }
        }
    });
})

/**
 * Obtener nombre y id de comerciantes para mostrarlos en una lista
 */
app.get('/mostrarComerciantes', (req, res) => {
    pool.query(`select id, nombre from comerciantes`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows)
        }
    });
})

/**
 * Obtener los datos de comerciante dado un id
 */
app.get('/comerciante/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select id, nombre from comerciantes`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows)
        }
    });
})

/**
 * Agregar un repartidor
 */

app.post('/repartidor', (req, res) => {
    // pFecha date pNumeroCuenta varchar
    var email = req.body.email;
    var contrasena = req.body.contrasena;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var telefono = req.body.telefono;
    var numeroCuenta = req.body.numeroCuenta;
    var fechaNacimiento = req.body.fechaNacimiento;

    // select agregarRepartidor('enrique@yahoo.com', '1234', 'enrique', 'rodriguez', '1992-02-02', '12345678', '2581479632587')
    pool.query(`select agregarRepartidor('${email}', '${contrasena}', '${nombre}', '${apellido}', '${fechaNacimiento}', '${telefono}', '${numeroCuenta}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err);
        } else {
            var resultado = res2.rows[0].agregarrepartidor;
            res.send(resultado);
        }
    });
})

/**
 * Aceptar solicitudes de comerciantes
 */
app.put('/solicitudComerciante/aceptar/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select aceptarComerciante('${id}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            var resultado = res2.rows[0].aceptarcomerciante;
            res.send(resultado);
        }
    });
})

/**
 * Agregar un producto nuevo
 */
app.post('/producto', (req, res) => {
    // pIdComerciante varchar, pNombre varchar, pDescripcion varchar
    var comerciante = req.body.comerciante;
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    pool.query(`select agregarProducto('${comerciante}', '${nombre}','${descripcion}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            var resultado = res2.rows[0].agregarproducto;
            res.send(resultado);
        }
    });
})

/**
 * Mostrar todos los productos
 */
app.get('/mostrarProductos/:idComerciante', (req, res) => {
    var idComerciante = req.params.idComerciante;
    pool.query(`select * from productos where idComerciante = '${idComerciante}'`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows);
        }
    });
})


/**
 * Endpoint: obtener info de usuario dado un email
 */
app.get('/cliente/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select * from clientes where id = '${id}'`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            if (res2.rowCount == 0) {
                res.send('error')
            } else {
                res.send(res2.rows)
            }
        }
    });
})

/**
 * Obtener la contraseña dado un email
 * Para el login de los usuarios
 */
app.get('/login/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select obtenercontrasenna('${id}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows[0].obtenercontrasenna);
        }
    })
})

/**
 * Ingresar comnentario por cliente
 */
app.post('/comentarios', (req, res) => {
    var idCliente = req.body.idCliente;
    var idComerciante = req.body.idComerciante;
    var comentario = req.body.comentario;
    var fecha = req.body.fecha;

    pool.query(`select agregarComentario('${idCliente}','${idComerciante}','${comentario}','${fecha}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows[0].agregarcomentario);
        }
    })
})

/**
 * obtener comentarios por comerciante
 */
app.get('/comentarios/:id', (req, res) => {
    var idComerciante = req.params.id;
    pool.query(`select clientes.nombre , clientes.foto , comentarios.comentario from comentarios inner join clientes on comentarios.idCliente=clientes.id where idComerciante = '${idComerciante}' ;`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows);
        }
    })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Escuchando en puerto ${PORT} ...`) })