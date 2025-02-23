import { app } from "./credentials.js";
import {
    sendEmailVerification,
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    doc,
    deleteDoc,
    getDoc,
    updateDoc,
    where,
    query,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";


const auth = getAuth(app);
const db = getFirestore(app); // Obtén la instancia de Firestore
let formbutton=document.getElementById("form");
let formRegister=document.getElementById("formRegister");


formbutton.addEventListener("click", (event) => {
    event.preventDefault();
    var email = document.getElementById("correo").value;
    var password = document.getElementById("pass").value;
    var nombre = document.getElementById("nombre").value; // Obtén el nombre del usuario

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;

            // Guarda los datos del usuario en Firestore
            return setDoc(doc(db, "users", uid), { // Usa setDoc y doc para especificar la ruta
                 uid: uid,
                displayName: nombre,
                email: email,
                // ...otros datos que quieras guardar
            });
        })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Registro exitosamente",
                confirmButtonText: "Aceptar"
            });

            return sendEmailVerification(auth.currentUser); // Envía el correo de verificación después de guardar en Firestore
        })
        .then(() => {
            alert('Se ha enviado un correo de verificación');
           
        })

        .catch(error => {
            const errorCode = error.code;
            console.error("Error en el registro:", error); // Imprime el error completo para depuración

            if (errorCode == "auth/email-already-in-use") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El correo ya está en uso"
                });
            } else if (errorCode == "auth/invalid-email") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El correo es inválido"
                });
            } else if (errorCode == "auth/weak-password") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "La contraseña debe tener al menos 6 caracteres"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error durante el registro. Inténtalo nuevamente más tarde."
                });
            }
        });
         formRegister.reset();
});