import {app} from "../firebase/credentials.js"
import { signInWithEmailAndPassword, 
    onAuthStateChanged,
   getAuth} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
const auth = getAuth(app);
const db = getFirestore(app); // Obtén la instancia de Firestore


onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = doc(db, "users", uid);

    getDoc(userRef)
      .then((doc) => {
        if (doc.exists()) {
          const userData = doc.data();

          const nombreElement = document.getElementById("nameUser");
          if (nombreElement) {
            nombreElement.textContent = userData.displayName || "Nombre no disponible"; // Maneja el caso en que displayName no está presente
          }

          // ... muestra otros datos del usuario
        } else {
          console.error("El documento del usuario no existe");
          // Muestra un mensaje en la página indicando que no se encontraron los datos
          const nombreElement = document.getElementById("nameUser");
          if (nombreElement) {
            nombreElement.textContent = "Datos no encontrados";
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener el documento:", error);
        // Muestra un mensaje de error en la página
        const nombreElement = document.getElementById("nameUser");
        if (nombreElement) {
          nombreElement.textContent = "Error al cargar los datos";
        }
      });
  } else {
    console.log("El usuario no ha iniciado sesión");
    // Redirige al usuario a la página de inicio de sesión
    window.location.href = "login.html"; // Reemplaza "login.html" con la URL de tu página de inicio de sesión
  }
});





