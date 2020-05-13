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

/*Para las copias se manejara un arreglo de clases
donde se guardan unicamente sus metodos 
Este arreglo lo vacia el usuario mediante un boton
*/

var ClasesArr=[];

function limpiarAST(){

    document.getElementById("myAST").innerHTML="";
    var divCopias = document.getElementById("myClases");
    var divFunciones = document.getElementById("myFunciones");
    var divVariables = document.getElementById("myVariables");
    divCopias.innerHTML="";
    divFunciones.innerHTML="";
    divVariables.innerHTML="";
    ClasesArr=[]

}


function analizarCopias(data){

    //Se buscan las declaraciones de clases 

    for(var i=0;i<data.sentencias.length;i++){
        if(data.sentencias[i].tipo=="INS_DECLARACION_CLASE"){
            ClasesArr.push(data.sentencias[i]);
        }
    }

    //Si hay dos o mas clases para analizar
    if(ClasesArr.length>0){
        var divCopias = document.getElementById("myClases");
        var divFunciones = document.getElementById("myFunciones");
        var divVariables = document.getElementById("myVariables");
        divCopias.innerHTML="";
        divFunciones.innerHTML="";
        divVariables.innerHTML="";

        //Se compara todas las clases entre si
        for(var i=0;i<ClasesArr.length;i++){

            for(var j=i;j<ClasesArr.length;j++){
                if(j!=i){
                    compararClases(ClasesArr[i],ClasesArr[j],i,j);
                    compararFunciones(ClasesArr[i],ClasesArr[j]);
                }
            }

        }

    }

}

function compararClases(clase1,clase2,num1,num2){

    //Se verificia si su id son el mismo
    if(clase1.id!=clase2.id){
        return;
    }

    //Arreglos para la funciones de cada clase 
    var clase1Arr=[];
    var clase2Arr=[];
    //Arreglos para la funciones de cada clase con instrucciones 
    var clase1ArrIns=[];
    var clase2ArrIns=[];

    for(var i=0;i<clase1.instrucciones.length;i++){
        if(clase1.instrucciones[i].tipo=="INS_DECLARACION_FUNCION"){
            //Se desechan las instrucciones
            var aux=JSON.parse(JSON.stringify(clase1.instrucciones[i]));
            clase1Arr.push(aux);
            delete aux.instrucciones;
            clase1ArrIns.push(clase1.instrucciones[i]);
        }
        if(clase1.instrucciones[i].tipo=="INS_DECL_METODO"){
            //Se desechan las instrucciones
            var aux=JSON.parse(JSON.stringify(clase1.instrucciones[i]));
            clase1Arr.push(aux);
            delete aux.instrucciones;
            clase1ArrIns.push(clase1.instrucciones[i]);
        }
    }

    for(var i=0;i<clase2.instrucciones.length;i++){
        if(clase2.instrucciones[i].tipo=="INS_DECLARACION_FUNCION"){
            //Se desechan las instrucciones
            var aux=JSON.parse(JSON.stringify(clase2.instrucciones[i]));
            clase2Arr.push(aux);
            delete aux.instrucciones;
            clase2ArrIns.push(clase2.instrucciones[i]);
        }
        if(clase2.instrucciones[i].tipo=="INS_DECL_METODO"){
            //Se desechan las instrucciones
            var aux=JSON.parse(JSON.stringify(clase2.instrucciones[i]));
            clase2Arr.push(aux);
            delete aux.instrucciones;
            clase2ArrIns.push(clase2.instrucciones[i]);
        }
    }

    //Si los arreglos son iguales con clase copia
    if(_.isEqual(clase1Arr,clase2Arr)){
        var divCopias = document.getElementById("myClases");

        var title = document.createElement("h5");
        title.innerHTML= "Copia de <i>"+clase1.id+"</i> en AST's "+num1+" y "+num2;
        var subtitle = document.createElement("h6");
        subtitle.innerHTML="Funciones y Metodos :"
        divCopias.appendChild(title);
        divCopias.appendChild(subtitle);
        
        for(var i=0;i<clase1Arr.length;i++){
            var funciontext=document.createElement("p");
            if(clase1Arr[i].tipo=="INS_DECLARACION_FUNCION"){
                funciontext.innerHTML="Funcion "+clase1Arr[i].id;
            }
            else{
                funciontext.innerHTML="Metodo "+clase1Arr[i].id;
            }
            divCopias.appendChild(funciontext);
        }
        var separador = document.createElement("hr");
        divCopias.appendChild(separador);

    }

    //Se comparan las funciones
    compararFunciones(clase1ArrIns,clase2ArrIns,clase1.id,num1,num2);
    
}

function compararFunciones(clase1,clase2,classname,num1,num2){

    for(var i=0;i<clase1.length;i++){

        for(var j=0;j<clase2.length;j++){

            var Aux1 = clase1[i];
            var Aux2 = clase2[j];
            //Se los arreglos son iguales con funciones copia
            if(_.isEqual(_.omit(Aux1, ['instrucciones']),_.omit(Aux2, ['instrucciones']))){

                var divFunciones = document.getElementById("myFunciones");

                var title = document.createElement("h5");
                title.innerHTML= "Copia de <i>"+Aux1.id+"</i> en clase "+classname+" de AST's "+num1+" y "+num2+"<br>";
                divFunciones.appendChild(title);

                var funciontext=document.createElement("p");
                if(Aux1.tipo=="INS_DECLARACION_FUNCION"){
                    switch(Aux1.tipo_retorno){
                        case "NUMERO":
                            funciontext.innerHTML+="Retorna : int <br>"
                            break;
                        case "DECIMAL":
                            funciontext.innerHTML+="Retorna : double <br>"
                            break;
                        case "BOOLEANO":
                            funciontext.innerHTML+="Retorna : boolean <br>"
                        case "CADENA":
                            funciontext.innerHTML+="Retorna : String <br>"
                            break;
                        case "CARACTER":
                            funciontext.innerHTML+="Retorna : char <br>"
                            break;
                    }
                }
                else{
                    funciontext.innerHTML+="Retorna : void <br>"
                }
                if(Aux1.parametros!=undefined){
                    funciontext.innerHTML+="Parametros: <br>"
                    for(var k=0;k<Aux1.parametros.length;k++){
                        switch(Aux1.parametros[k].tipo){
                            case "NUMERO":
                                funciontext.innerHTML+="Tipo: int "
                                break;
                            case "DECIMAL":
                                funciontext.innerHTML+="Tipo: double "
                                break;
                            case "BOOLEANO":
                                funciontext.innerHTML+="Tipo: boolean "
                            case "CADENA":
                                funciontext.innerHTML+="Tipo: String "
                                break;
                            case "CARACTER":
                                funciontext.innerHTML+="Tipo: char "
                                break;
                        }
                        funciontext.innerHTML+="Identificador: "+Aux1.parametros[k].id+"<br>";
                    }
                }
                
                divFunciones.appendChild(funciontext);
                
                var separador = document.createElement("hr");
                divFunciones.appendChild(separador);

                //Se comparan las funciones en busquedad de variables copia
                compararVariables(Aux1,Aux2,classname,num1,num2);

            }
            
        }

    }
}

function compararVariables(Funcion1,Funcion2,classname,num1,num2){

    //Arreglos que gardaran las variables
    var VarArray1=[];
    var VarArray2=[];

    buscarVaribales(Funcion1.instrucciones,VarArray1);
    buscarVaribales(Funcion2.instrucciones,VarArray2);

    for(var i=0;i<VarArray1.length;i++){

        for(var j=i;j<VarArray2.length;j++){

            //Si son variables copia
            if(_.isEqual(VarArray1[i],VarArray2[j])){
                var divVariables = document.getElementById("myVariables");
                var title = document.createElement("h5");
                title.innerHTML= "Variable copia en metodo "+Funcion1.id+" de clase "+classname+" de AST's "+num1+" y "+num2+"<br>";
                var funciontext=document.createElement("p");
                funciontext.innerHTML="Id's: "+stringifyArray(VarArray1[i].id)+"<br>"
                switch(VarArray1[i].tipo_dato){
                    case "NUMERO":
                        funciontext.innerHTML+="Tipo : int "
                        break;
                    case "DECIMAL":
                        funciontext.innerHTML+="Tipo : double "
                        break;
                    case "BOOLEANO":
                        funciontext.innerHTML+="Tipo : boolean "
                    case "CADENA":
                        funciontext.innerHTML+="Tipo : String "
                        break;
                    case "CARACTER":
                        funciontext.innerHTML+="Tipo : char "
                        break;
                }
               
                divVariables.appendChild(title);
                divVariables.appendChild(funciontext);
                
                var separador = document.createElement("hr");
                divVariables.appendChild(separador);

            }

        }

    }

}

//Recibe bloques de instrucciones y arreglo para almacenar
function buscarVaribales(instrucciones,array){

    for(var i=0;i<instrucciones.length;i++){

        if(instrucciones[i].tipo=="INS_DECLARACION"){
            array.push(instrucciones[i]);
        }

        else if(instrucciones[i].tipo=="INS_ASIGNACION_DECLARACION"){
            array.push(instrucciones[i]);
        }

        //Si es un bloque con mas intrucciones se hace llamada recursiva
        else if(instrucciones[i].instrucciones!=undefined){
            buscarVaribales(instrucciones[i].instrucciones,array);
        }

    }
}

//Convierte un array JSON en string
function stringifyArray(array){
    var myString="";
    for(var i=0;i<array.length;i++){
        myString+=array[i]+" ";
    }
    return myString;
}