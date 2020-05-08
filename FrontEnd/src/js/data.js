var tabIndexAST=0;
var ArregloEditorAST=[];

function sendData(){

    var indice = document.getElementsByClassName("nav-link active tabBtn");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:4000/submit", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            alert("AST Generado :)");
            addAST(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify({
        Texto1: ArregloEditor[indice[0].id].getValue()
    }));
}

function addAST(value){

    var parsed = JSON.parse(value);

    document.getElementById("Lexicos").innerHTML="";
    document.getElementById("Sintacticos").innerHTML="";

    var ErroresLexicos=parsed.ErroresLexicos;
    delete parsed.ErroresLexicos;

    if(ErroresLexicos.length>0){
        for(var i=0;i<ErroresLexicos.length;i++){

            var texto=document.createElement("p");
            texto.innerHTML="Error Lexico "+ErroresLexicos[i].Error+
            " en fila "+ErroresLexicos[i].Fila;
            document.getElementById("Lexicos").appendChild(texto);
        }
    }

    var ErroresSintacticos=parsed.ErroresSintacticos;
    delete parsed.ErroresSintacticos;

    if(ErroresSintacticos.length>0){
        for(var i=0;i<ErroresSintacticos.length;i++){

            var texto=document.createElement("p");
            texto.innerHTML="Error sintactico "+ErroresSintacticos[i].Error+
            " en fila "+ErroresSintacticos[i].Fila+" y columna "+ErroresSintacticos[i].Columna
            document.getElementById("Sintacticos").appendChild(texto);
        }
        
    }

    jsonView.format(parsed, ".divAST" );
    analizarCopias(parsed);

}

function limpiarAST(){

    document.getElementById("myAST").innerHTML="";

}


/*Para las copias se manejara un arreglo de clases
donde se guardan unicamente sus metodos 
Este arreglo lo vacia el usuario mediante un boton
*/

var ClasesArr=[];



function analizarCopias(data){

    //Se buscan las clases 

    for(var i=0;i<data.sentencias.length;i++){
        if(data.sentencias[i].tipo=="INS_DECLARACION_CLASE"){
            ClasesArr.push(data.sentencias[i]);
        }
    }

    //Si hay dos o mas clases para anlizar
    if(ClasesArr.length>0){
        //Se compara todas las clases entre si
        for(var i=0;i<ClasesArr.length;i++){

            for(var j=0;j<ClasesArr.length;j++){
                if(j!=i){
                    compararClases(ClasesArr[i],ClasesArr[j]);
                    compararFunciones(ClasesArr[i],ClasesArr[j]);
                }
            }

        }

    }

}

function compararClases(clase1,clase2){

    //Se verificia si su id son el mismo
    if(clase1.id!=clase2.id){
        return;
    }

    //Arreglos para la funciones de cada clase
    var clase1Arr=[];
    var clase2Arr=[];

    for(var i=0;i<clase1.instrucciones.length;i++){
        if(clase1.instrucciones[i].tipo=="INS_DECLARACION_FUNCION"){
            //Se desechan las instrucciones
            var aux=clase1.instrucciones[i];
            delete aux.instrucciones;
            delete aux.parametros;
            clase1Arr.push(clase1.instrucciones[i]);
        }
        if(clase1.instrucciones[i].tipo=="INS_DECL_METODO"){
            //Se desechan las instrucciones
            var aux=clase1.instrucciones[i];
            delete aux.instrucciones;
            delete aux.parametros;
            clase1Arr.push(clase1.instrucciones[i]);
        }
    }

    for(var i=0;i<clase2.instrucciones.length;i++){
        if(clase2.instrucciones[i].tipo=="INS_DECLARACION_FUNCION"){
            //Se desechan las instrucciones
            var aux=clase2.instrucciones[i];
            delete aux.instrucciones;
            delete aux.parametros;
            clase2Arr.push(clase2.instrucciones[i]);
        }
        if(clase2.instrucciones[i].tipo=="INS_DECL_METODO"){
            //Se desechan las instrucciones
            var aux=clase2.instrucciones[i];
            delete aux.instrucciones;
            delete aux.parametros;
            clase2Arr.push(clase2.instrucciones[i]);
        }
    }

    //Si los arrelgos son iguales con clase copia
    if(_.isEqual(clase1Arr, clase2Arr)){
        alert(clase1.id+" es copia de "+clase2.id);
    }

}

function compararFunciones(clase1,clase2){

}