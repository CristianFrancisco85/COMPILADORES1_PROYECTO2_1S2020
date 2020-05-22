/* Cristian Meoño - 201801397 */

%lex

%options lex case-sensitive yylineno


%% 

\s+							/* Ingorar Espacion */
"//".*						/* Comentario Simple */
[/][\*][^\*]*[\*][/] 		/* Comentario Multiple */

"int"                       return 'RINT';
"double"	                return 'RDOUBLE';
"boolean"                   return 'RBOOLEAN';
"char"                      return 'RCHAR';
"String"                    return 'RSTRING';
"string"                    return 'RSTRING';
"/"                         return 'OPDIVISION';
"*"                         return 'OPMULTI';
"%"                         return 'OPMOD';
"--"                        return 'DECREMENTO';
"-"                         return 'OPMENOS';
"++"                        return 'INCREMENTO';
"+"                         return 'OPMAS';
"^"                         return 'OPCIRCU';
"("                         return 'PARIZQ';
")"                         return 'PARDER';
"{"                         return 'LLAVIZQ';
"}"                         return 'LLAVDER';
">="                        return 'MAYORIG';
"<="                        return 'MENORIG';
">"                         return 'MENOR';
"<"                         return 'MAYOR';
"=="                        return 'DIGUAL';
"="                         return 'IGUAL';
"!="                        return 'NIGUAL';
"!"                         return 'NOT';
";"                         return 'PUNTOYCOMA';
","                         return 'COMA';
":"                         return 'DOSPUNTOS';
"&&"                        return 'AND';
"||"                        return 'OR';
"class"                     return 'RCLASS';
"import"                    return 'RIMPORT';
"true"                      return 'RTRUE';
"false"                     return 'RFALSE';
"if"                        return 'RIF';
"else"                      return 'RELSE';
"switch"                    return 'RSWITCH';
"case"                      return 'RCASE';
"default"                   return 'RDEFAULT';
"while"                     return 'RWHILE';
"do"                        return 'RDO';
"for"                       return 'RFOR';
"break"                     return 'RBREAK';
"continue"                  return 'RCONTINUE';
"return"                    return 'RRETURN';
"void"                      return 'RVOID';
"main"                      return 'RMAIN';
"System"                    return 'RSYSTEM';
"."                         return 'PUNTO';
"out"                       return 'ROUT';
"print"                     return 'RPRINT';
"println"                   return 'RPRINTLN';
"import"                    return 'RIMPORT';

\'(\\n|\\t|\\r|\\\"|\\\'|[^\'])\'   {yytext = yytext.substr(1,yyleng-2); return 'CARACTER';};
\"(\\\"|[^\"])*\"                   {yytext = yytext.substr(1,yyleng-2); return 'CADENA';};
[0-9]+("."[0-9]+)?\b  	    return 'DECIMAL';
[0-9]+\b				    return 'ENTERO';
([a-zA-Z_])[a-zA-Z_0-9]* 	return 'ID';

<<EOF>>                     return 'EOF';
.                           {AST_Tools.addErrorLexico(yytext,yylineno+1); return '';}

/lex

%{
	const Tipo_Operacion	= require('./instrucciones.js').Tipo_Operacion;
	const Tipo_Valor 	    = require('./instrucciones.js').Tipo_Valor;
	const AST_Tools     	= require('./instrucciones.js').AST_Tools;
%}


%left 'OPMAS' 'OPMENOS'
%left 'OPMOD' 'OPDIVISION' 'OPMULTI'
%left 'OPCIRCU'
%left  UMENOS

%start init


%% 

init
    : inicio EOF {AST_Tools.resetErrors();return $1;}
;

inicio
    : importes instrucciones  {$$=AST_Tools.BloquePrincipal($1,$2);}       
    | instrucciones           {$$=AST_Tools.BloquePrincipal(undefined,$1);}  
;

importes
    : importes RIMPORT ID PUNTOYCOMA    {$1.push($3);} 
    | RIMPORT ID PUNTOYCOMA             {$$=AST_Tools.listaIDImportes($2);}
;

instrucciones
	: instrucciones instruccion { $1.push($2); $$ = $1; }	
	| instruccion				{ $$ = [$1]; }	
;

instruccion
    : declaracion               {$$=$1}
    | asignacion                {$$=$1}
    | declaracion_asignacion    {$$=$1}
    | declaracion_funcion       {$$=$1}
    | declaracion_metodo

    | RCLASS ID LLAVIZQ instrucciones LLAVDER                               {$$=AST_Tools.bloqueCLASE($2,$4);}
    | RSYSTEM PUNTO ROUT PUNTO RPRINT PARIZQ salida PARDER PUNTOYCOMA       {$$=AST_Tools.sentenciaPrint($7);}
    | RSYSTEM PUNTO ROUT PUNTO RPRINTLN PARIZQ salida PARDER PUNTOYCOMA     {$$=AST_Tools.sentenciaPrint($7);}
    | RSYSTEM PUNTO ROUT PUNTO RPRINTLN PARIZQ PARDER PUNTOYCOMA            {$$=AST_Tools.sentenciaPrint("\n");}
    | llamada_funcion
    | incremento_decremento PUNTOYCOMA

    | bloque_if 
    | bloque_switch
    | bloque_while
    | bloque_dowhile
    | bloque_for

    | sentencias_transferencia

    | error PUNTOYCOMA { AST_Tools.addErrorSintactico(yytext,this._$.first_line,this._$.first_column); }
    | error LLAVDER { AST_Tools.addErrorSintactico(yytext,this._$.first_line,this._$.first_column); }
    //| error { AST_Tools.addErrorSintactico(yytext,this._$.first_line,this._$.first_column); }

    
;

/* SENTENCIAS DE DECLARACION Y Y ASIGNACION  */

lista_id
    :lista_id COMA ID   {$1.push($3);}                   
    |ID                 {$$=AST_Tools.listaID($1);}
;
 
declaracion
    :RINT lista_id PUNTOYCOMA            { $$ = AST_Tools.declaracion($2, Tipo_Valor.NUMERO); }
    |RDOUBLE lista_id PUNTOYCOMA         { $$ = AST_Tools.declaracion($2, Tipo_Valor.DECIMAL); }
    |RBOOLEAN lista_id PUNTOYCOMA        { $$ = AST_Tools.declaracion($2, Tipo_Valor.BOOLEANO); }
    |RCHAR lista_id PUNTOYCOMA           { $$ = AST_Tools.declaracion($2, Tipo_Valor.CARACTER); }
    |RSTRING lista_id PUNTOYCOMA         { $$ = AST_Tools.declaracion($2, Tipo_Valor.CADENA); }
;

asignacion
    //:ID IGUAL expresion_cadena PUNTOYCOMA        { $$ = AST_Tools.asignacion($1, $3); }
    :ID IGUAL expresion_numerica PUNTOYCOMA      { $$ = AST_Tools.asignacion($1, $3); }    
    |ID IGUAL expresion_logica PUNTOYCOMA        { $$ = AST_Tools.asignacion($1, $3); }
;

declaracion_asignacion
    :RINT lista_id IGUAL expresion_numerica PUNTOYCOMA       { $$ = AST_Tools.asignacion_declaracion($4,$2, Tipo_Valor.NUMERO);}
    |RDOUBLE lista_id IGUAL expresion_numerica PUNTOYCOMA    { $$ = AST_Tools.asignacion_declaracion($4,$2, Tipo_Valor.DECIMAL);}
    |RBOOLEAN lista_id IGUAL expresion_logica PUNTOYCOMA     { $$ = AST_Tools.asignacion_declaracion($4,$2, Tipo_Valor.BOOLEANO);}
    |RCHAR lista_id IGUAL CARACTER PUNTOYCOMA                { $$ = AST_Tools.asignacion_declaracion($4,$2, Tipo_Valor.CARACTER);}
    |RSTRING lista_id IGUAL expresion_numerica PUNTOYCOMA    { $$ = AST_Tools.asignacion_declaracion($4,$2, Tipo_Valor.CADENA);}
    //|RSTRING lista_id IGUAL expresion_cadena PUNTOYCOMA      { $$ = AST_Tools.asignacion_declaracion($4,$2, Tipo_Valor.CADENA);}

;

asignacion_simple
    : ID IGUAL expresion_numerica       { $$ = AST_Tools.asignacion($1, $3); }
;

declaracion_asignacion_simple
    :RINT ID IGUAL expresion_numerica   { $$ = AST_Tools.asignacion_declaracion($4, Tipo_Valor.NUMERO);} 
;

declaracion_funcion
    : RINT ID PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER        { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.NUMERO,$2,$4,$7);}
    | RDOUBLE ID PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER     { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.DECIMAL,$2,$4,$7);}
    | RBOOLEAN ID PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER    { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.BOOLEANO,$2,$4,$7);}
    | RCHAR ID PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER       { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.CARACTER,$2,$4,$7);}
    | RSTRING ID PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER     { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.CADENA,$2,$4,$7);}

    | RINT ID PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER                  { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.NUMERO,$2,undefined,$6);}
    | RDOUBLE ID PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER               { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.DECIMAL,$2,undefined,$6);}
    | RBOOLEAN ID PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER              { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.BOOLEANO,$2,undefined,$6);}
    | RCHAR ID PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER                 { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.CARACTER,$2,undefined,$6);}
    | RSTRING ID PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER               { $$ = AST_Tools.nuevaFuncion(Tipo_Valor.CADENA,$2,undefined,$6);}
;

declaracion_metodo
    : RVOID ID PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER       { $$ = AST_Tools.nuevoMetodo($2,$4,$7);}
    | RVOID RMAIN PARIZQ parametros PARDER LLAVIZQ instrucciones LLAVDER    { $$ = AST_Tools.nuevoMetodoMain($4,$7);}

    | RVOID ID PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER                 { $$ = AST_Tools.nuevoMetodo($2,undefined,$6);}
    | RVOID RMAIN PARIZQ  PARDER LLAVIZQ instrucciones LLAVDER              { $$ = AST_Tools.nuevoMetodoMain(undefined,$6);}
;

llamada_funcion
    : ID PARIZQ lista_parametros PARDER PUNTOYCOMA                          {$$=AST_Tools.llamadaFuncion($1,$3);}
    | ID PARIZQ PARDER PUNTOYCOMA                                           {$$=AST_Tools.llamadaFuncion($1,undefined);}
;


/* SENTENCIAS DE EXPRESIONES */ 

/*expresion_cadena
    :expresion_cadena OPMAS expresion_cadena                { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.CONCATENACION);}
    |CADENA                                                 { $$ = AST_Tools.crearValor($1,Tipo_Valor.CADENA); }
; */

expresion_numerica
    : OPMENOS expresion_numerica %prec UMENOS	            { $$ = AST_Tools.operacionUnaria ($2, Tipo_Operacion.NEGATIVO); }
    | expresion_numerica OPMENOS expresion_numerica		    { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.RESTA);}
	| expresion_numerica OPMAS expresion_numerica	        { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.SUMA);}	
	| expresion_numerica OPDIVISION expresion_numerica		{ $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.DIVISON);}				
    | expresion_numerica OPMOD expresion_numerica	        { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MODULO);}
    | expresion_numerica OPCIRCU expresion_numerica         { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.POTENCIA);}
    | expresion_numerica OPMULTI expresion_numerica         { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MULTIPLICACION);}

	| PARIZQ expresion_numerica PARDER					    { $$ = $2; }
	| ENTERO											    { $$ = AST_Tools.crearValor(Number($1),Tipo_Valor.NUMERO); }
	| DECIMAL											    { $$ = AST_Tools.crearValor(Number($1),Tipo_Valor.DECIMAL); }
	| ID                                                    { $$ = AST_Tools.crearValor($1,Tipo_Valor.ID); }
    | ID PARIZQ lista_parametros PARDER                     { $$ = AST_Tools.llamadaFuncion($1,$3);}
    | ID PARIZQ PARDER                                      { $$ = AST_Tools.llamadaFuncion($1,undefined);}
    | CADENA                                                { $$ = AST_Tools.crearValor($1,Tipo_Valor.CADENA); }

    | DECREMENTO ENTERO 									{ $$ = AST_Tools.operacionUnaria (Number($2), Tipo_Operacion.DECREMENTO); }
	| DECREMENTO DECIMAL 									{ $$ = AST_Tools.operacionUnaria (Number($2), Tipo_Operacion.DECREMENTO); }
	| DECREMENTO ID                                         { $$ = AST_Tools.operacionUnaria ($2, Tipo_Operacion.DECREMENTO); }
    | INCREMENTO ENTERO 									{ $$ = AST_Tools.operacionUnaria (Number($2), Tipo_Operacion.INCREMENTO); }
	| INCREMENTO DECIMAL 								    { $$ = AST_Tools.operacionUnaria (Number($2), Tipo_Operacion.INCREMENTO); }
	| INCREMENTO ID                                         { $$ = AST_Tools.operacionUnaria ($2, Tipo_Operacion.INCREMENTO); }

    | ID DECREMENTO                                         { $$ = AST_Tools.operacionUnaria ($1, Tipo_Operacion.DECREMENTO); }
    | ENTERO DECREMENTO                                     { $$ = AST_Tools.operacionUnaria (Number($1), Tipo_Operacion.DECREMENTO); }
    | DECIMAL DECREMENTO                                    { $$ = AST_Tools.operacionUnaria (Number($1), Tipo_Operacion.DECREMENTO); }
    | ID INCREMENTO                                         { $$ = AST_Tools.operacionUnaria ($1, Tipo_Operacion.INCREMENTO); }
    | ENTERO INCREMENTO                                     { $$ = AST_Tools.operacionUnaria (Number($1), Tipo_Operacion.INCREMENTO); }
    | DECIMAL INCREMENTO                                    { $$ = AST_Tools.operacionUnaria (Number($1), Tipo_Operacion.INCREMENTO); }
;

expresion_relacional
    :expresion_numerica MAYOR expresion_numerica            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_QUE);}
    |expresion_numerica MENOR expresion_numerica            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_QUE);}
    |expresion_numerica MAYORIG expresion_numerica          { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_IGUAL);}
    |expresion_numerica MENORIG expresion_numerica          { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_IGUAL);}
    |expresion_numerica DIGUAL expresion_numerica           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.DOBLE_IGUAL);}
    |expresion_numerica NIGUAL expresion_numerica           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.NO_IGUAL);}
    | RTRUE                                                 { $$ = AST_Tools.crearValor($1,Tipo_Valor.BOOLEANO);}
    | RFALSE                                                { $$ = AST_Tools.crearValor($1,Tipo_Valor.BOOLEANO);}
    | PARIZQ expresion_logica PARDER                        { $$ = $2}
    | NOT expresion_relacional                              { $$ = AST_Tools.operacionUnaria ($2,Tipo_Operacion.NOT);}
;

expresion_logica
    : expresion_relacional AND expresion_relacional         { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.AND);}
    | expresion_relacional OR expresion_relacional          { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.OR);}
    //| NOT expresion_logica                                  { $$ = AST_Tools.operacionUnaria ($2,Tipo_Operacion.NOT);}
    //| PARIZQ expresion_logica PARDER                        { $$ = $2}
    //| PARIZQ expresion_logica PARDER OR expresion_logica    { $$ = AST_Tools.operacionBinaria($2, $5, Tipo_Operacion.OR);}
    //| PARIZQ expresion_logica PARDER AND expresion_logica   { $$ = AST_Tools.operacionBinaria($2, $5, Tipo_Operacion.AND);}
    | expresion_relacional                                  { $$ = $1}
;

incremento_decremento
    : DECREMENTO ID     { $$ = AST_Tools.operacionUnaria ($2, Tipo_Operacion.DECREMENTO); }
    | INCREMENTO ID     { $$ = AST_Tools.operacionUnaria ($2, Tipo_Operacion.INCREMENTO); }   
    | ID DECREMENTO     { $$ = AST_Tools.operacionUnaria ($1, Tipo_Operacion.DECREMENTO); }
    | ID INCREMENTO     { $$ = AST_Tools.operacionUnaria ($1, Tipo_Operacion.INCREMENTO); }
;

sentencias_transferencia
    : RBREAK PUNTOYCOMA                         {$$=AST_Tools.nuevoBREAK();}          
    | RCONTINUE PUNTOYCOMA                      {$$=AST_Tools.nuevoCONTINUE();}  
    | RRETURN PUNTOYCOMA                        {$$=AST_Tools.nuevoRETURN(undefined,undefined);} 
    | RRETURN expresion_logica PUNTOYCOMA       {$$=AST_Tools.nuevoRETURN($2,Tipo_Valor.BOOLEANO);} 
    | RRETURN expresion_numerica PUNTOYCOMA     {$$=AST_Tools.nuevoRETURN($2,Tipo_Valor.NUMERO);} 
    //| RRETURN expresion_cadena PUNTOYCOMA       {$$=AST_Tools.nuevoCONTINUE($2,Tipo_Valor.CADENA);} 
    | RRETURN CARACTER PUNTOYCOMA               {$$=AST_Tools.nuevoRETURN($2,Tipo_Valor.CARACTER);} 
;

parametros
    : parametros COMA tipo ID       {$1.push(AST_Tools.nuevoParametro($3,$4));}  
    | tipo ID                       {$$=AST_Tools.listaParametros(AST_Tools.nuevoParametro($1,$2));}
;

lista_parametros
    : lista_parametros COMA expresion_numerica  {$1.push(AST_Tools.nuevoParametro(undefined,$3));}  
    | lista_parametros COMA CARACTER            {$1.push(AST_Tools.nuevoParametro(Tipo_Valor.CARACTER,$3));} 
    | lista_parametros COMA RTRUE               {$1.push(AST_Tools.nuevoParametro(Tipo_Valor.BOOLEANO,$3));} 
    | lista_parametros COMA RFALSE              {$1.push(AST_Tools.nuevoParametro(Tipo_Valor.BOOLEANO,$3));} 
    | expresion_numerica                        {$$=AST_Tools.listaParametros(AST_Tools.nuevoParametro(undefined,$1));}
    | CARACTER                                  {$$=AST_Tools.listaParametros(AST_Tools.nuevoParametro(Tipo_Valor.CARACTER,$1));}
    | RTRUE                                     {$$=AST_Tools.listaParametros(AST_Tools.nuevoParametro(Tipo_Valor.BOOLEANO,$1));}
    | RFALSE                                    {$$=AST_Tools.listaParametros(AST_Tools.nuevoParametro(Tipo_Valor.BOOLEANO,$1));}
;

tipo
    :RINT       {$$=Tipo_Valor.NUMERO;}
    |RDOUBLE    {$$=Tipo_Valor.DECIMAL;}
    |RBOOLEAN   {$$=Tipo_Valor.BOOLEANO;}
    |RCHAR      {$$=Tipo_Valor.CARACTER;}
    |RSTRING    {$$=Tipo_Valor.CADENA;}
;

salida
    : salida OPMAS CADENA                               {$1.push(AST_Tools.salida(Tipo_Valor.CADENA,$3));}                  
    | salida OPMAS ID                                   {$1.push(AST_Tools.salida(Tipo_Valor.ID,$3));}              
    | salida OPMAS ID PARIZQ lista_parametros PARDER    {$1.push(AST_Tools.llamadaFuncion($3,$5));} 
    | salida OPMAS ID PARIZQ PARDER                     {$1.push(AST_Tools.llamadaFuncion($3,undefined));} 
    | CADENA                                            {$$=AST_Tools.listaSalidas(AST_Tools.salida(Tipo_Valor.CADENA,$1));}  
    | ID                                                {$$=AST_Tools.listaSalidas(AST_Tools.salida(Tipo_Valor.ID,$1));}    
    | ID PARIZQ lista_parametros PARDER                 {$$=AST_Tools.listaSalidas(AST_Tools.llamadaFuncion($1,$3));}
    | ID PARIZQ PARDER                                  {$$=AST_Tools.listaSalidas(AST_Tools.llamadaFuncion($1,undefined));}

;

/* SENTENCIAS DE CONTROL DE FLUJO */

bloque_if
    : RIF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER              {$$= AST_Tools.nuevoIF($3,$6);}
    | RIF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER bloque_else  {$$= AST_Tools.nuevoIF_ELSE($3,$6,$8)}
;

bloque_else
    : RELSE LLAVIZQ instrucciones LLAVDER                                               {$$= $3}
    | RELSE RIF PARIZQ expresion_logica PARDER LLAVIZQ instruccion LLAVDER              {$$= AST_Tools.nuevoIF($4,$7);}
    | RELSE RIF PARIZQ expresion_logica PARDER LLAVIZQ instruccion LLAVDER bloque_else  {$$= AST_Tools.nuevoIF_ELSE($4,$7,$9)}
;

bloque_switch
    :RSWITCH PARIZQ expresion_numerica PARDER LLAVIZQ casos LLAVDER     {$$=AST_Tools.nuevoSWITCH($3,$6);}
;

casos 
    : casos caso    {$1.push($2);}
    | caso          {$$=AST_Tools.listaCasos($1);}
;

caso 
    : RCASE expresion_numerica DOSPUNTOS instrucciones  {$$=AST_Tools.nuevoCaso($2,$4);}
    | RDEFAULT DOSPUNTOS instrucciones                  {$$=AST_Tools.nuevoCasoDefault($3);}
;

/* SENTENCIAS DE REPETICION */

bloque_while
    : RWHILE PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER   {$$= AST_Tools.nuevoWHILE($3,$6);}
;

bloque_dowhile
    : RDO LLAVIZQ instrucciones LLAVDER RWHILE PARIZQ expresion_logica PARDER PUNTOYCOMA    {$$= AST_Tools.nuevoDO_WHILE($6,$3);}
;

bloque_for
    :RFOR PARIZQ asignacion_simple PUNTOYCOMA expresion_logica PUNTOYCOMA incremento_decremento PARDER LLAVIZQ instrucciones LLAVDER                {$$=AST_Tools.nuevoFOR($3,$5,$7,$10);}
    |RFOR PARIZQ declaracion_asignacion_simple PUNTOYCOMA expresion_logica PUNTOYCOMA incremento_decremento PARDER LLAVIZQ instrucciones LLAVDER    {$$=AST_Tools.nuevoFOR($3,$5,$7,$10);}
;