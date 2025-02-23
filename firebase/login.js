import { signInWithEmailAndPassword, 
    onAuthStateChanged,
   getAuth,} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { app } from "./credentials.js";

const auth= getAuth(app);
const login=document.getElementById("login");

login.addEventListener("click",()=>{
    var email= document.getElementById("usuario").value;
    var password= document.getElementById("pass").value;
    signInWithEmailAndPassword(auth,email,password).then(cred=>{
      location.href="../pages/home.html";
      // console.log(cred,user)
    }).catch(error => {
      const errorCode= error.code;
      if (errorCode=="auth/invalid-email") {
        alert("Correo invalido");
      }else if(errorCode=="auth/user-disable"){
        alert("El usuario ha sido deshabilitado");
      }else if(errorCode=="auth/user-not-found"){
        alert("El usuario no existe");
      }else if(errorCode=="auth/wrong-password"){
        alert("Contraseña incorrecta");
      }
      
    });
  });


