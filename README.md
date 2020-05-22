# PROYECTO 2 - COMPILADORES 1
_Detector de Copias Java_ 
- Funciones Principales
   - Analisis Lexico - Scanner
   - Analisis Sintactico - Parser LR1
   - Deteccion de Clases Copia
   - Deteccion de Funciones y Metodos Copia
   - Deteccion de Variables Copia
   - Visualizacion de AST
## Creado con :
- NodeJS (BackEnd)
- Go (FrontEnd)
- CodeMirror https://codemirror.net/
- Lodash https://lodash.com/
- Jison https://zaa.ch/jison/
## ¿Como Usarlo? :
**Area de Editor:**

Los archivos se mandan uno por uno al servidor con el boton de Analizar, se requieren como minimo dos archivos para poder
realizar un analsis de copias
<p align="center">
  <img  height="600" src="https://i.ibb.co/8YKf1vn/Captura-de-pantalla-2020-05-22-a-la-s-15-47-27.png">
</p>

- **Boton Nueva Pestaña:** Agrega una pestaña nueva en el area de pestañas del editor
- **Boton Analizar:** Inicia el proceso de analisis de copias
- **Boton Guardar .java:** Descargar un archivo con extension .java con el codigo de la pestaña actual
- **Boton Browse:** Permite la subida de archivo con extension .java para su analisis
- **Boton Limpiar AST`s:** Elimina todos los datos recibios del servidor en el FrontEnd

**Tabla de Errores Lexicos :**
Muestra todos los errores lexicos encontrados durante el Analisis Lexico y
muestra todos los errores sintacticos encontrados durante el Analisis Sintactico 
<p align="center">
  <img  height="400" src="https://i.ibb.co/r6M3qjb/Captura-de-pantalla-2020-05-22-a-la-s-16-00-59.png">
</p>

**Area de Salida :**

Se muestran el resultado del analisis de copias 

<p align="center">
  <img  height="250" src="https://i.ibb.co/sQnKm2h/Captura-de-pantalla-2020-05-22-a-la-s-16-03-07.png">
</p>
<p align="center">
  <img  height="500" src="https://i.ibb.co/T2bLZrj/Captura-de-pantalla-2020-05-22-a-la-s-16-03-28.png">
</p>
<p align="center">
  <img  height="500" src="https://i.ibb.co/2FVK163/Captura-de-pantalla-2020-05-22-a-la-s-16-03-38.png">
</p>






