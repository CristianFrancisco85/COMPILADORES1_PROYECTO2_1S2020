function sendData(){

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:4000/submit", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            alert(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify({
        Texto1: ArregloEditor[0].getValue()
    }));


}