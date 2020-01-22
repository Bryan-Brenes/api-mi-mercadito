const express = require('express');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
const cors = require('cors');

const connectionString = 'postgres://pathrcjxbkzlmi:398913e00f91c50e77d5fb249e0ce66c2df9fde58369aad3e68fa97b4e5f3c5f@ec2-174-129-33-13.compute-1.amazonaws.com:5432/d3g06p50108qd3?ssl=true'
const pool = new Pool({
    connectionString: connectionString
})
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/prueba', (req, res) => {
    res.send(req.body)
})

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
            var user1 = res2.rows[0].ingresarcliente;
            if (user1 == 'error') {
                res.send({ status: "error" });
            } else {
                res.send({ status: "listo" });
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
            res.send({ status: err })
        } else {
            if (res2.rowCount != 0) {
                var resultado = res2.rows[0].agregarSolicitudComerciante;
                if (resultado == 'False') {
                    res.send({ status: 'error' });
                } else {
                    res.send({ status: 'listo' });
                }
            } else {
                res.send({ status: 'error' })
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
    pool.query(`select * from comerciantes where id = '${id}'`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows)
        }
    });
})
// app.get('/comerciante/:id', (req, res) => {
//     var id = req.params.id;
//     pool.query(`select id, nombre from comerciantes where id = '${id}'`, (err, res2) => {
//         if (err) {
//             res.send("error: " + err)
//         } else {
//             res.send(res2.rows)
//         }
//     });
// })

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
            res.send({ status: resultado });
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
            res.send({ status: resultado });
        }
    });
})

/**
 * Obtener todos los productos
 */
app.get('/productos', (req, res) => {
    //
    pool.query(`select comerciantes.nombre as nombrecomerciante, productos.nombre as nombreproducto, productosporferia.idProducto, productosporferia.montokg, productosporferia.montounidad from productosporferia inner join comerciantes on productosporferia.idcomerciante = comerciantes.id inner join productos on productos.id = productosporferia.idProducto`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            var resultado = res2.rows;
            res.send(resultado);
        }
    });
})

// app.get('/invertario/productosFeria', (req, res) => {
//     res.send('con salsa');
// })
//
app.get('/invertario/productosFeria/:idComerciante', (req, res) => {
    var idC = req.params.idComerciante;
    pool.query(`select idproducto, nombre, cantidad, montokg, montounidad from productosporferia inner join productos on productosporferia.idproducto = productos.id where productosporferia.idcomerciante = '${idC}'`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            var resultado = res2.rows;
            res.send(resultado);
        }
    });
})

app.post('/productosPorFeria', (req, res) => {
    var idProducto = req.body.idProducto;
    var idComerciante = req.body.idComerciante;
    var cantidad = req.body.cantidad;
    var montokg = req.body.montoKg;
    var montoUnidad = req.body.montoUnidad;
    pool.query(`insert into productosporferia(idproducto, idcomerciante, cantidad, montokg, montounidad) values(${idProducto}, '${idComerciante}', ${cantidad},${montokg}, ${montoUnidad})`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            var resultado = res2.rows;
            res.send({ status: 'listo' });
        }
    });
})

app.get('/producto/:id', (req, res) => {
    //
    var id = req.params.id;
    pool.query(`select idProducto, productos.nombre, montokg from productosporferia inner join productos on productosporferia.idproducto = productos.id where productosporferia.idProducto = ${id}`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            var resultado = res2.rows;
            res.send(resultado);
        }
    });
})

// app.get('/producto/descripcion/:id', (req, res) => {
//     //
//     var id = req.params.id;
//     pool.query(`select idProducto, productos.nombre,productos.descripcion, montokg from productosporferia inner join productos on productosporferia.idproducto = productos.id where productosporferia.idProducto = ${id}`, (err, res2) => {
//         if (err) {
//             res.send("error: " + err)
//         } else {

//             res.send(res2.rows);
//         }
//     });
// })

app.get('/inventarios/:idC', (req, res) => {
    var id = req.params.idC;
    pool.query(`select idcomerciante, nombre, descripcion from productos where idcomerciante = ${id}`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {

            res.send(res2.rows);
        }
    });
})

/**
 * Mostrar todos los productos de un comerciante
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
    pool.query(`select * from clientes inner join usuarios on usuarios.email = clientes.id where clientes.id = '${id}'`, (err, res2) => {
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
            res.send({ rol: res2.rows[0].obtenercontrasenna });
        }
    })
})

app.get('/cliente/rol/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select rol from usuarios where email = '${id}'`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows[0]);
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

    //res.send(`Comerciante: ${idComerciante}, Cliente: ${idCliente}`)
    pool.query(`INSERT INTO comentarios(idComerciante, idCliente, fecha, comentario) VALUES('${idComerciante}', '${idCliente}', '${fecha}', '${comentario}');`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send({ status: 'listo' }/* [0].agregarcomentario */);
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

app.post('/pedidos', (req, res) => {
    var idCliente = req.body.idCliente;
    var fecha = req.body.fecha;
    var monto = req.body.monto;
    var transporte = req.body.transporte;
    var estadoPreparado = req.body.estadoPreparado;
    var estadoEntregado = req.body.estadoEntregado;
    var ubicacion = req.body.ubicacion;

    pool.query(`select agregarPedido('${idCliente}', '${fecha}', ${monto}, '${transporte}', false, false, '${ubicacion}')`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            //res.send(res2.rows)
            res.send({ id: res2.rows[0].agregarpedido });
        }
    })



})

app.get('/pedidos', (req, res) => {
    pool.query(`SELECT clientes.nombre, pedidos.* FROM clientes INNER JOIN pedidos ON clientes.id = pedidos.idcliente ;`, (err, res2) => {
        if (err) {
            res.send("error: " + err)
        } else {
            res.send(res2.rows);
        }
    })
})

app.get('/pedidos/detalle/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`SELECT pedidos.id as idPedido , detalleporpedido.idproducto as idProducto, productos.nombre as nombreProducto, 
    productosporferia.idcomerciante as idComerciante, comerciantes.nombre as nombreComerciante, detalleporpedido.cantidad as cantidadProducto , 
    detalleporpedido.medicion as medicionProducto, detalleporpedido.estado as estadoProducto, 
    clientes.nombre as nombreCliente, clientes.apellido as apellidoCliente, clientes.telefono as telefonoCliente, 
    clientes.foto as fotoCliente, pedidos.transporte as trasnporte , pedidos.ubicacion as ubicacionCliente
   FROM detalleporpedido
   INNER JOIN pedidos ON detalleporpedido.idpedido = pedidos.id 
   INNER JOIN clientes ON clientes.id = pedidos.idcliente 
   INNER JOIN productosporferia on productosporferia.idproducto = detalleporpedido.idproducto
   INNER JOIN productos on productos.id = detalleporpedido.idproducto 
   INNER JOIN comerciantes on productosporferia.idcomerciante =comerciantes.id
   where pedidos.id = ${id};`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send(res2.rows);
        }
    })
})

app.get('/pedidos/preparar/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select cambiarEstadoPedidoPreparado(${id});`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send({ status: 'listo' });
        }
    })
})

app.get('/pedidos/entregar/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select cambiarEstadoPedidoEntregado(${id});`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send({ status: 'listo' });
        }
    })
})

/**
 * Coloca el estado del detalle en true
 */
app.get('/pedidos/producto/:idproducto/:idpedido', (req, res) => {
    var idpedido = req.params.idpedido;
    var idproducto = req.params.idproducto;
    //res.send(`pedido: ${idpedido}, producto: ${idproducto}`)
    pool.query(`select cambiarEstadoDetallePedido( ${idproducto} , ${idpedido});`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send({ status: 'listo' });
        }
    })
})

/**
 * Obtener el inventario de un comerciante
 */

app.get('/inventario/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select id, nombre, descripcion from productos where idComerciante = '${id}'`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send(res2.rows);
        }
    })
})


app.get('/solicitudesPendientes', (req, res) => {
    pool.query(`select * from solicitudesPendientes where estado = FALSE;`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send(res2.rows);
        }
    })
})

app.get('/perfilSolicitud/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`select * from solicitudesPendientes where id = '${id}';`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send(res2.rows);
        }
    })
})

app.get('/repartidores', (req, res) => {
    pool.query(`select * from repartidores`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send(res2.rows);
        }
    })
})

app.delete('/producto/:idC/:idP', (req, res) => {
    var idC = req.params.idC;
    var idP = req.params.idP;
    pool.query(`delete from productos where id=${idP} and idcomerciante = '${idP}'`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send({ status: 'borrado' });
        }
    })
})

app.post('/detallePedido', (req, res) => {
    var idPedido = req.body.idPedido;
    var idProducto = req.body.idProducto;
    var cantidad = req.body.cantidad;
    var monto = req.body.monto;

    pool.query(`select agregarDetallePedido(${idPedido} , ${idProducto}, ${cantidad}, ${monto})`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send({ status: 'agregado' });
        }
    })
})

app.get('/inventario/detalle/:idC/:idP', (req, res) => {
    var idC = req.params.idC;
    var idP = req.params.idP;

    pool.query(`select nombre, descripcion from productos where idcomerciante = '${idC}' and id = ${idP}`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send(res2.rows);
        }
    })
})


//select agregarRepartidor2('PedroMorales@gmail.com' , 'Pedro', 'Morales' , '5694574' , '1998-12-12' , '452 569 14' )
app.post('/repartidor/agregar', (req, res) => {
    var email = req.body.email;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var telefono = req.body.telefono;
    var fechaNacimiento = req.body.fechaNacimiento;
    var numeroCuenta = req.body.numeroCuenta;

    pool.query(`select agregarRepartidor2('${email}' , '${nombre}', '${apellido}' , '${telefono}' , '${fechaNacimiento}' , '${numeroCuenta}' )`, (err, res2) => {
        if (err) {
            res.send({ status: err })
        } else {
            res.send(res2.rows);
        }
    })
})


// --Actualizar estado detallePorPedido
// UPDATE table detallesporpedido
// SET estado = 'true'
// WHERE idProducto = ;


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Escuchando en puerto ${PORT} ...`) })