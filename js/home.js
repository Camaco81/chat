import { app } from "../firebase/credentials.js";
import { getFirestore, collection, where, query, getDocs, doc, setDoc, onSnapshot, getDoc, orderBy,limit } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

const searchInput = document.getElementById('search-user');
const resultsDiv = document.getElementById('user-results'); // Obtén la referencia al contenedor de resultados

searchInput.addEventListener('keyup', (event) => {
    const queryTerm = event.target.value;
    searchUsers(queryTerm);
});

function closeModal() {
    const modalChat = document.getElementById('modal-chat');
    const modalInstance = new bootstrap.Modal(modalChat);
    modalInstance.hide();
}

async function searchUsers(queryTerm) {
    const usersRef = collection(db, 'users');
    const q = query(
        usersRef,
        where('displayName', '>=', queryTerm),
        where('displayName', '<=', queryTerm + '\uf8ff')
    );

    try {
        const querySnapshot = await getDocs(q);
        resultsDiv.innerHTML = ''; // Limpia los resultados

        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const resultElement = document.createElement('div');
            resultElement.textContent = user.displayName;
            resultElement.addEventListener('click', () => {
                createChat(user.uid)
                    .then((chatId) => { // Recibe el chatId
                        window.location.href = `chat.html?chatId=${chatId}`;
                    })
                    .catch((error) => {
                        console.error("Error al crear el chat:", error);
                    });
                closeModal();
            });
            resultsDiv.appendChild(resultElement);
        });
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
}

async function createChat(otherUserId) {
    const currentUser = auth.currentUser;
    const newChatRef = doc(collection(db, 'chats'));

    try {
        await setDoc(newChatRef, {
            participants: [currentUser.uid, otherUserId],
        });
        return newChatRef.id; // Retorna el ID del chat creado
    } catch (error) {
        console.error("Error al crear el chat:", error);
        throw error; // Re-lanza el error para que se maneje en el lugar donde se llama a createChat
    }
}






onAuthStateChanged(auth, (user) => {
    if (user) {
        // ... (código anterior)

        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', user.uid));
        const lastMessages = {};
        onSnapshot(q, (snapshot) => {
            const chatList = document.getElementById('chat-list');
            chatList.innerHTML = '';

            snapshot.forEach((doc) => {
                const chat = doc.data();
                const chatId = doc.id;

                // Obtener el otro usuario del chat
                const otherUserId = chat.participants.find(uid => uid !== user.uid);

                // Obtener la información del otro usuario (nombre, etc.)
                getUserData(otherUserId)
                    .then(otherUser => {
                        // Obtener el último mensaje del chat
                        getLastMessage(chatId)
                            .then(lastMessage => {
                                // Si hay un último mensaje, mostrar el chat en la lista
                                if (lastMessage) {
                                    // Evitar mostrar chats duplicados
                                    if (!lastMessages[chatId]) {
                                        lastMessages[chatId] = lastMessage;

                                        const chatElement = document.createElement('div');
                                        // Mostrar el nombre del otro usuario y el último mensaje
                                        chatElement.innerHTML = `
                                         <strong>${otherUser.displayName}</strong><br>
                                            ${lastMessage.text}
                                        `;

                                        chatElement.addEventListener('click', () => {
                                            window.location.href = `chat.html?chatId=${chatId}`;
                                        });

                                        chatList.appendChild(chatElement);
                                    }
                                }
                            });
                    });
            });
        });
    } else {
        // ... (código anterior)
    }
});

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

// ... (código anterior)

async function getLastMessage(chatId) {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1)); // Obtener el último mensaje

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
    } else {
        return null;
    }
}



