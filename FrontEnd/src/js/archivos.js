function openArchive(e){
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
      var contenido = e.target.result;
      showText(contenido);
    };
    lector.readAsText(archivo);
}

function showText(contenido) {
    var indice = document.getElementsByClassName("nav-link active tabBtn")
    var txtJava = ArregloEditor[indice[0].id]
    txtJava.setValue(contenido);
}

function saveData() {

    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function () {
            var indice = document.getElementsByClassName("nav-link active tabBtn")
            var txtJava = ArregloEditor[indice[0].id]
            var blob = new File([txtJava.getValue()], "JavaCode.java");      
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = blob.name;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
    saveData();
}
