function validateLogIn(){
    if(document.getElementById("user_name").value == '111' && document.getElementById("pwd").value == '111' ){
        alert("Login Successful");
        window.location.assign("../views/main.html");
    }else{
        alert("Access denied. Valid username and password is required.");
    }
}

