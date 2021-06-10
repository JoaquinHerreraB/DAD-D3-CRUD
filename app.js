const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'usuarios_db',
    user:'root',
    password: 'root'
});
var jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
conexion.connect(function(error){
    if (error){
        throw error;
    }else{
        console.log('Conexion exitosa')
    }
})
app.get('/', urlencodedParser, (req, res) =>{
    var nombre = req.query.nombre;
    var apellido = req.query.apellido;
    res.send(`<h1>Tus datos son: <br/>
    Nombre: ${nombre} <br/>
    Apellido: ${apellido} </h1>`);
    const data = req.query;
    conexion.query('INSERT INTO datos set ?',[data], (error, rows)=>{
        console.log(rows);
    })
    console.log(req.query);
});

app.get('/list', urlencodedParser, (req, res) =>{
    conexion.query('SELECT * FROM datos', function(error, resultados, campos){
        if (error){
            throw error;
        }
        var valores = "";
        resultados.forEach(resultado => {
           valores += JSON.stringify(resultado);
            console.log(resultado);
        });
        res.send(`<h1>Los datos son: <br/>
        ${valores} <br/></h1>`)
    })
});

app.post('/insert', urlencodedParser, (req, res) =>{
    var id = req.body.id;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    res.send(`<h1>Los datos insertados son: <br/>
    Codigo: ${id} <br/>
    Nombre: ${nombre} <br/>
    Apellido: ${apellido} </h1>`);
    const data = req.body;
    conexion.query('INSERT INTO datos set ?',[data], (error, rows)=>{
        console.log(rows);
    })
    console.log(req.body);
});
app.post('/update', urlencodedParser, (req, res) =>{
    var id = req.body.id;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    res.send(`<h1>Los datos actualizados son son: <br/>
    Codigo: ${id} <br/>
    Nombre: ${nombre} <br/>
    Apellido: ${apellido} </h1>`);
    var form_data = {
        nombre: nombre,
        apellido: apellido
    }
    conexion.query('UPDATE datos SET ? WHERE id = ' + id, form_data, function(err, rows){
        console.log(rows);
    })
    console.log(req.body);
});
app.get('/delete/', urlencodedParser, (req, res) =>{
    var id = req.query.id;
    res.send(`<h1>Se ha eliminado a alumno de código: <br/>
    Código: ${id} <br/> </h1>`);
    const data = req.query;
    
    conexion.query('DELETE FROM datos WHERE id = '+ id , (error, rows)=>{
        console.log(rows);
    })
    console.log(req.query);
});

app.listen(3000, () =>{
    console.log('Server iniciado...');
});
