// cargar el modulo de express
const express = require("express");
// y crea una instancia de la aplicación express
const app = express();
// cargar body parser para leer el body de los request
const bodyParser = require("body-parser");

const parser = require('./gramatica.js');

let entrada;

// recibir datos en formato json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
  });

app.listen(4000, () => {
 console.log("El servidor está inicializado en el puerto 4000");
});


app.post('/submit', function (req, res) {
    entrada=req.body.Texto1;
    res.send(parsear());
});

function parsear(){
    let ast;
    try {
        // invocamos a nuestro parser con el contendio del archivo de entradas
        ast = parser.parse(entrada.toString());
        // imrimimos en un archivo el contendio del AST en formato JSON
        console.log(JSON.stringify(ast,null,2));
        return JSON.stringify(ast,null,2);
    } 
    catch (e) {
        console.error(e);
        return e;
    }
}