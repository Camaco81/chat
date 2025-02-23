
import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import  { app } from "./credentials.js";

const auth= getAuth(app);

const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se cerrará tu sesión actual.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'darkcyan',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      auth.signOut().then(() => {
        Swal.fire(
          '¡Sesión cerrada!',
          'Has cerrado sesión correctamente.',
          'success'
        );
        location.href = "../auth/login.html";
      }).catch((error) => {
        Swal.fire(
          '¡Error!',
          'Ha ocurrido un error al cerrar sesión.',
          'error'
        );
      });
    }
  });
});

