// import {app} from "../firebase/credentials.js"
// import { signInWithEmailAndPassword, 
//     onAuthStateChanged,
//    getAuth} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// import { getFirestore, doc, getDoc, updateDoc, collection } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
// const auth = getAuth(app);
// const db = getFirestore(app); // Obtén la instancia de Firestore



// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const uid = user.uid;
//     const userRef = doc(db, "users", uid);



//     getDoc(userRef)
//       .then((doc) => {
//         if (doc.exists()) {
//           const userData = doc.data();

//           const nombreElement = document.getElementById("nameUser");
//           if (nombreElement) {
//             nombreElement.textContent = userData.displayName || "Nombre no disponible"; // Maneja el caso en que displayName no está presente
//           }

//           // ... muestra otros datos del usuario
//         } else {
//           console.error("El documento del usuario no existe");
//           // Muestra un mensaje en la página indicando que no se encontraron los datos
//           const nombreElement = document.getElementById("nameUser");
//           if (nombreElement) {
//             nombreElement.textContent = "Datos no encontrados";
//           }
//         }
//       })
//       .catch((error) => {
//         console.error("Error al obtener el documento:", error);
//         // Muestra un mensaje de error en la página
//         const nombreElement = document.getElementById("nameUser");
//         if (nombreElement) {
//           nombreElement.textContent = "Error al cargar los datos";
//         }
//       });
//   } else {
//     console.log("El usuario no ha iniciado sesión");
//     // Redirige al usuario a la página de inicio de sesión
//     window.location.href = "login.html"; // Reemplaza "login.html" con la URL de tu página de inicio de sesión
//   }
// });


import { app } from "../firebase/credentials.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

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
            nombreElement.textContent = userData.displayName || "Nombre no disponible";
          }

          // ... muestra otros datos del usuario

          // Obtener el nombre actual del usuario y mostrarlo en el input del modal
          const editNameInput = document.getElementById("edit-name-input");
          editNameInput.value = userData.displayName || ""; // Mostrar el nombre actual o vacío si no existe

          // Evento para guardar el nuevo nombre
          const saveNameButton = document.getElementById("save-name-button");
          saveNameButton.addEventListener("click", () => {
            const newName = editNameInput.value;

            // Actualizar el nombre en Firestore
            updateDoc(userRef, { displayName: newName })
              .then(() => {
               Swal.fire({
          title: "¡Datos actualizados exitosamente!",
          icon: "success" 
          });
                nombreElement.textContent = newName; // Actualizar el nombre en la página
                // Cerrar el modal (opcional)
                const modal = document.getElementById("exampleModal");
                const modalInstance = bootstrap.Modal.getInstance(modal); // Obtener la instancia del modal
                modalInstance.hide(); // Cerrar el modal
              })
              .catch((error) => {
                console.error("Error al actualizar el nombre:", error);
                // Mostrar un mensaje de error al usuario
              });
          });
        } else {
          // ... (código para manejar el caso en que el documento no existe)
          console.error("El documento del usuario no existe");
//           // Muestra un mensaje en la página indicando que no se encontraron los datos
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
//     // Redirige al usuario a la página de inicio de sesión
    window.location.href = "login.html"; // Reemplaza "login.html" con la URL de tu página de inicio de sesión
    // ... (código para manejar el caso en que el usuario no ha iniciado sesión)
  }
});









