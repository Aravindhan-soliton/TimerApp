let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section"); 
let loginUserName = document.getElementById("username-login");
let loginPassword = document.getElementById("password-login");
let signupUserName = document.getElementById("username-signup");
let signupEmail = document.getElementById("email-signup");
let signupPassword = document.getElementById("password-signup");
let signupCurrentPassword = document.getElementById("cPassword-signup");
let loginError = document.getElementById("login-error");
let signupError = document.getElementById("signup-error");
let UserName;
document
  .getElementById("login-button")
  .addEventListener("click", () => loginValidation());
document 
  .getElementById("signup-button")
  .addEventListener("click", () => signupValidation());

signup.addEventListener("click", () => {
	slider.classList.add("moveslider");
	formSection.classList.add("form-section-move");
});

login.addEventListener("click", () => {
	slider.classList.remove("moveslider");
	formSection.classList.remove("form-section-move");
});

const loginValidation = async () => {
    let access;
    access = await loginCheck(loginUserName.value,loginPassword.value);
    UserName = loginUserName.value;
    if(access === 'ok')
    {
        loginError.innerHTML="";
        window.location = parent.window.document.location + "main.html";
    }
    else{ 
        loginError.innerHTML="<p>User name and Password not matched!!!</p>";
    }
}

const signupValidation = async () => {
    let valid = false;
    const UNres = /^[a-zA-Z0-9_\.]{7,20}$/.exec(signupUserName.value);
    const Emailres = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.exec(signupEmail.value);
    if(!!UNres === true){
        if(!!Emailres === true){
            console.log(signupPassword.value);
            if(signupPassword.value.length>2){
                valid=true;
            }
            else{
                signupError.innerHTML="<p>password must have min of 3 characters</p>";
            }
        }
        else{
            signupError.innerHTML="<p>Enter a valid mail id</p>";
        }
    }
    else{
        signupError.innerHTML="<p>User Name must have min of 7 and max of 20 characters with no special characters</p>";
    }
    if(valid === true){
    UserName = signupUserName.value;
    if(signupCurrentPassword.value === signupPassword.value)
    {
        await signupUser(signupUserName.value,signupEmail.value,signupPassword.value);
        signupError.innerHTML="";
        window.location = parent.window.document.location + "main.html?name=" + signupUserName.value;
    }
    else{
        signupError.innerHTML="<p>Password and current Password not matched!!!</p>";
    }
}
}

function returnUserName(){
    return UserName;
}

  