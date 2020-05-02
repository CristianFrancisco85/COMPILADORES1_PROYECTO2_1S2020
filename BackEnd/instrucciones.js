// Tipos de Operaciones
const Tipo_Operacion = {
    //Aritmetica
    NEGATIVO:       'NEGATIVO',
    MULTIPLICACION: 'MULTIPLICACION',
	DIVISION:       'DIVISION',
	SUMA:           'SUMA',
    RESTA:          'RESTA',
    MODULO:         'MODULO',
	POTENCIA:       'POTENCIA',
	CONCATENACION:	'CONCATENACION',
	DECREMENTO:		'DECREMENTO',
	INCREMENTO:		'INCREMENTO',
    //Relacional
	MAYOR_QUE:      'MAYOR_QUE',
	MENOR_QUE:      'MENOR_QUE',
	MAYOR_IGUAL: 	'MAYOR_IGUAL',
	MENOR_IGUAL:    'MENOR_IGUAL',
	DOBLE_IGUAL:    'DOBLE_IGUAL',
    NO_IGUAL:    	'IGUAL_QUE',
    //Logica
	AND:  			'AND',
	OR: 			'OR',
	NOT:   			'NOT'  	
}

// Tipos de Instrucciones
const Tipo_Instruccion = {
	DECLARACION:		'INS_DECLARACION',
	ASIGNACION:			'INS_ASIGANCION',
    ASIG_DECL:      	'INS_ASIGNACION_DECLARACION',
	DECL_FUNCION:   	'INS_DECLARACION_FUNCION',
	DECL_METODO:		'INS_DECL_METODO',
	DECL_METODO_MAIN:	'INS_DECLARACION_METODO_MAIN',
    DECL_CLASE:     	'INS_DECLARACION_CLASE',
    LLAM_FUNCION:   	'INS_LLAMADA_FUNCION',
    SALIDA:         	'INS_SALIDA_CONSOLA',
	BLOQUE_IF:      	'INS_BLOQUE_IF',
	BLOQUE_ELSE:      	'INS_BLOQUE_ELSE',
	BLOQUE_ELSE_IF:     'INS_BLOQUE_ELSE_IF',
	BLOQUE_SWITCH:  	'INS_BLOQUE_SWITCH',
	CASO_SWITCH:  		'INS_CASO_SWITCH',
	CASO_DEFAULT_SWITCH:'INS_CASO_DEFAULT_SWITCH',	
    BLOQUE_WHILE:   	'INS_BLOQUE_WHILE',
    BLOQUE_DOWHILE: 	'INS_BLOQUE_DOWHILE',
    BLOQUE_FOR:     	'INS_BLOQUE_FOR',
    CONTINUE:       	'INS_CONTINUE',
    RETURN:         	'INS_RETURN',
    BREAK:          	'INS_BREAK'
    
}

// Tipos de Datos
const Tipo_Valor = {
    NUMERO:         'NUMERO',
    DECIMAL:        'DECIMAL',
    ID:             'ID',
    BOOLEANO:       'BOOLEANO',
    CADENA:         'CADENA',
    CARACTER:       'CARACTER'
}


/**
 * Crea un operacion generica pueder ser
 * aritmetica,relacional,logica
 * @param opIzq Operando Izquierdo 
 * @param opDer Operando Derecho
 * @param opTipo  Tipo De Operacion
 */
function operacionGenerica(opIzq, opDer, opTipo) {
	return {
		opIzq: opIzq,
		opDer: opDer,
		opTipo: opTipo
	}
}

const AST_Tools = {

    /**
	 * Operaciones Binarias (Arimeticas,Relacional,Logica)
    * @param opIzq Operando Izquierdo 
    * @param operandoDer Operando Derecho
    * @param opTipo  Tipo De Operacion
	 */
	operacionBinaria: function(opIzq, opDer, opTipo) {
		return operacionGenerica(opIzq, opDer, opTipo);
	},

	/**
	 * Crea un nuevo objeto tipo Operación para las operaciones unarias válidas
	 * @param opUnico Operador Unico 
	 * @param tipo 
	 */
	operacionUnaria: function(opUnico, opTipo) {
		return operacionGenerica(opUnico, undefined, opTipo);
	},

	/**
	 * Crea un nuevo valor
	 * @param valor 
	 * @param valTipo 
	 */
	crearValor: function(valor, valTipo) {
		return {
			valor: valor,
			valTipo: valTipo
		}
	},
	
	/**
	 * Crea un bloque clase
	 * @param id Identificador de la clase
	 * @param instrucciones Instrucciones del bloque
	 */
	bloqueCLASE: function (id,instrucciones){
		return {
			tipo: Tipo_Instruccion.DECL_CLASE,
			id:id,
			instrucciones:instrucciones
		}
	},

	/**
	 * Crea un bloque clase
	 * @param id Identificador de la clase
	 */
	llamadaFuncion: function (id,parametros){
		return {
			tipo: Tipo_Instruccion.LLAM_FUNCION,
			id:id,
			parametros:parametros
		}
	},

	/**
	 * Crea instruccion salida
	 * @param valor Cadena de salida
	 */
	sentenciaPrint: function (valor){
		return {
			tipo: Tipo_Instruccion.SALIDA,
			valor:valor
		}
	},
    
    /**
	 * Crea Instrucción para una declaracion.
	 * @param id 
	 */
	declaracion: function(id, tipo) {
		return {
			tipo: Tipo_Instruccion.DECLARACION,
			id: id,
			tipo_dato: tipo
		}
	},

	/**
	 * Crea Instrucción para una asignacion.
	 * @param id 
	 * @param valor 
	 */
	asignacion: function(id, valor) {
		return {
			tipo: Tipo_Instruccion.ASIGNACION,
			id: id,
			valor : valor
		}
	},

	/**
	 * Crea Instrucción para una asignacion y declaracion.
	 * @param Tipo Tipo de Dato
	 * @param id 	Lista de Identificadores
	 * @param valor Valor
	 */
	asignacion_declaracion: function(valor,id, tipo) {
		return {
			tipo: Tipo_Instruccion.ASIG_DECL,
			tipo_dato: tipo,
			id: id,
			valor : valor
		}
	},

	/**
	 * Crea una lista de id
	 * @param id 
	 */
	listaID: function (id) {
		var ids = []; 
		ids.push(id);
		return ids;
	},

	/**
	 * Crea una funcion nueva
	 * @param tipo Tipo de retorno de la funcion
	 * @param id Identificador de la funcion
	 * @param parametros Lista de parametros de la funcion
	 * @param instrucciones Lista de instrucciones de la funcion
	 */
	nuevaFuncion: function (tipo,id,parametros,instrucciones){
		return {
			tipo: Tipo_Instruccion.DECL_FUNCION,
			parametros: parametros,
			id: id,
			instrucciones : instrucciones,
			tipo_retorno : tipo
		}
	},

	/**
	 * Crea un metodo nuevo
	 * @param id Identificador del metodo
	 * @param parametros Lista de parametros del metodo
	 * @param instrucciones Lista de instrucciones del metodo
	 */
	nuevoMetodo: function (id,parametros,instrucciones){
		return {
			tipo: Tipo_Instruccion.DECL_METODO,
			parametros: parametros,
			id: id,
			instrucciones : instrucciones,
		}
	},

	/**
	* Crea un metodo nuevo
	 * @param parametros Lista de parametros del metodo
	 * @param instrucciones Lista de instrucciones del metodo
	 */
	nuevoMetodoMain: function (parametros,instrucciones){
		return {
			tipo: Tipo_Instruccion.DECL_METODO_MAIN,
			parametros: parametros,
			id: 'main',
			instrucciones : instrucciones,
		}
	},

	/**
	 * Crea un nuevo parametro
	 * @param id Identificador
	 * @param tipo Tipo de dato
	 */
	nuevoParametro: function (tipo,id){
		return {
			tipo: tipo,
			id: id,
		}
	},


	/**
	 * Crea una lista de parametros
	 * @param id 
	 */
	listaParametros: function (parametro) {
		var params = []; 
		params.push(parametro);
		return params;
	},

	/**
	 * Crea un nuevo bloque IF
	 * @param expresionLogica Expresion Logica
	 * @param instrucciones Instrucciones del Bloque
	 */
	nuevoIF: function (expresionLogica,instrucciones){
		return {
			tipo: Tipo_Instruccion.BLOQUE_IF,
			expresionLogica: expresionLogica,
			instruccionesIF: instrucciones,
		}
	},

	/**
	 * Crea un nuevo bloque IF_ELSE
	 * @param expresionLogica Expresion Logica
	 * @param instrucciones Instrucciones del Bloque
	 */
	nuevoIF_ELSE: function (expresionLogica,instrucciones,instruccionesELSE){
		return {
			tipo: Tipo_Instruccion.BLOQUE_IF,
			expresionLogica: expresionLogica,
			instruccionesIF: instrucciones,
			instruccionesELSE: instruccionesELSE
		}
	},

	/**
	 * Crea un nuevo bloque Switch
	 * @param expresionnumerica Expresion numerica de Switch
	 * @param casos Lista de casos 
	 */
	nuevoSWITCH: function(expresionnumerica, casos) {
		return {
			tipo: Tipo_Instruccion.BLOQUE_SWITCH,
			expresionnumerica: expresionnumerica,
			casos: casos
		}
	},

	/**
	 * Crea una lista de casos un Switch.
	 * @param {*} caso 
	 */
	listaCasos: function (caso) {
		var casos = []; 
		casos.push(caso);
		return casos;
	},

	/**
	 * Crea un caso para un Switch.
	 * @param {*} casoExpresion 
	 * @param {*} instrucciones 
	 */
	nuevoCaso: function(casoExpresion, instrucciones) {
		return {
			tipo: Tipo_Instruccion.CASO_SWITCH,
			casoExpresion: casoExpresion,
			instrucciones: instrucciones
		}
	},

	/**
	 * Crea un caso default un Switch.
	 * @param {*} casoExpresion 
	 * @param {*} instrucciones 
	 */
	nuevoCasoDefault: function(instrucciones) {
		return {
			tipo: Tipo_Instruccion.CASO_DEFAULT_SWITCH,
			instrucciones: instrucciones
		}
	},

	/**
	 * Crea un nuevo bloque While
	 * @param expresionLogica Expresion Logica
	 * @param instrucciones Instrucciones del Bloque
	 */
	nuevoWHILE: function (expresionLogica,instrucciones){
		return {
			tipo: Tipo_Instruccion.BLOQUE_WHILE,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
		}
	},

	/**
	 * Crea un nuevo bloque While
	 * @param expresionLogica Expresion Logica
	 * @param instrucciones Instrucciones del Bloque
	 */
	nuevoDO_WHILE: function (expresionLogica,instrucciones){
		return {
			tipo: Tipo_Instruccion.BLOQUE_DOWHILE,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
		}
	},


	/**
	 * Crea un nuevo bloque For
	 * @param operacionInicial Asignacion o Declaracion-Asignacion
	 * @param expresionLogica Expresion Logica
	 * @param paso Puede ser decremento o incremento
	 * @param instrucciones Instrucciones del Bloque
	 */
	nuevoFOR: function (operacionInicial,expresionLogica,paso,instrucciones){
		return {
			tipo: Tipo_Instruccion.BLOQUE_FOR,
			operacionInicial:operacionInicial,
			expresionLogica: expresionLogica,
			paso:paso,
			instrucciones: instrucciones,
		}
	},

	/**
	 * Crea una instruccion break
	 */
	nuevoBREAK: function (){
		return {
			tipo: Tipo_Instruccion.BREAK
		}
	},

	/**
	 * Crea una instruccion continue
	 */
	nuevoCONTINUE: function (){
		return {
			tipo: Tipo_Instruccion.CONTINUE
		}
	},

	/**
	 * Crea una instruccion return
	 * @param valor Puede ser una expresion o vacio
	 */
	nuevoRETURN: function (valor,tipo){
		return {
			tipo: Tipo_Instruccion.RETURN,
			valor: valor,
			tipo:tipo
		}
	},

	/**
	 * Crea una lista de salidas.
	 * @param {*} caso 
	 */
	listaSalidas: function (salida) {
		var salidas = []; 
		salidas.push(salida);
		return salidas;
	},

	/**
	 * Crea una lista de salidas.
	 * @param {*} caso 
	 */
	salida: function (tipo,valor) {
		return{
			tipo:tipo,
			valor:valor
		}
	},







}

module.exports.Tipo_Operacion = Tipo_Operacion;
module.exports.Tipo_Instruccion = Tipo_Instruccion;
module.exports.Tipo_Valor = Tipo_Valor;
module.exports.AST_Tools = AST_Tools;
