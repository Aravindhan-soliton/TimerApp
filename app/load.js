function loadlogin (id, filename) {
    let xhttp;
    let element = document.getElementById(id);
    let file = filename;
    if(file){
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 ) {
                if(this.status == 200) {element.innerHTML = this.responseText;}
                if(this.status == 404) {element.innerHTML = "<h1>Reload</h1>";}
            }
        }
        console.log("Ddd");
        xhttp.open("GET", `../views/${file}`, true);
        xhttp.send();
        return;
    }
}