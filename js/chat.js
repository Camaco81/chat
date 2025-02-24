import { app } from "../firebase/credentials.js";
import { getFirestore, collection, doc, setDoc, serverTimestamp, onSnapshot, orderBy , getDoc} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chatId');

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');




// ... (código anterior)

if (chatId) {
    const messagesRef = collection(db, 'chats', chatId, 'messages');

       onSnapshot(messagesRef, orderBy('timestamp'), (snapshot) => {
        messagesDiv.innerHTML = '';

        snapshot.forEach((doc) => {
            const message = doc.data();
            const senderId = message.sender; // Obtener el ID del remitente

            // Obtener la información del usuario que envió el mensaje
            getUserData(senderId)
                .then(sender => {
                    const messageElement = document.createElement('div');
                    messageElement.textContent = `${sender.displayName}: ${message.text}`; // Mostrar el nombre del remitente y el mensaje
                    messagesDiv.appendChild(messageElement);
                });
        });
    });
    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value;
        const currentUser = auth.currentUser;

        if (messageText && currentUser) {
            setDoc(doc(messagesRef), {
                text: messageText,
                sender: currentUser.uid,
                timestamp: serverTimestamp()
            })
                .then(() => {
                    messageInput.value = '';
                })
                .catch((error) => {
                    console.error("Error al enviar mensaje:", error);
                });
        }
    });

    // ... (código anterior)
} else {
    // ... (código anterior)
    console.error("No se proporcionó un chatId.");
    // Puedes mostrar un mensaje al usuario o redirigirlo a otra página
}



// // ... (código anterior)

// if (chatId) {
//     const messagesRef = collection(db, 'chats', chatId, 'messages');

//     onSnapshot(messagesRef, orderBy('timestamp'), (snapshot) => {
//         messagesDiv.innerHTML = '';

//         snapshot.forEach((doc) => {
//             const message = doc.data();
//             const senderId = message.sender; // Obtener el ID del remitente

//             // Obtener la información del usuario que envió el mensaje
//             getUserData(senderId)
//                 .then(sender => {
//                     const messageElement = document.createElement('div');
//                     messageElement.textContent = `${sender.displayName}: ${message.text}`; // Mostrar el nombre del remitente y el mensaje
//                     messagesDiv.appendChild(messageElement);
//                 });
//         });
//     });

//     // ... (código anterior)
// } else {
//     // ... (código anterior)
// }

async function getUserData(userId) {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return userDoc.data();
    } else {
        console.error("No se encontró el usuario");
        return { displayName: "Usuario desconocido" }; // O maneja el error como prefieras
    }
}