import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import  { app } from "./credentials.js";

const auth= getAuth(app);


function onAuthStateChangeds(user) {
  if (!user) {
    document.getElementById('contenido-protegido').style.display = 'none';
    window.location.href = "../auth/login.html"; 
    console.log("El usuario no está autenticado");
   

    
  } else {
   
     console.log("El usuario  está autenticado");
    
      document.getElementById('contenido-protegido').style.display = 'block';
  }
}

auth.onAuthStateChanged(onAuthStateChangeds);
