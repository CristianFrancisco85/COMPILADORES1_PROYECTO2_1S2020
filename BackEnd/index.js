const express = require("express");
const app = express();
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
        // Se llama a parser
        ast = parser.parse(entrada.toString());
        // Salida del AST en formato JSON
        console.log(JSON.stringify(ast,null,2));
        return JSON.stringify(ast,null,2);
    } 
    catch (e) {
        console.error(e);
        return e;
    }
}