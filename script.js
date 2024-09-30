import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, push } from "firebase/database";

// Inicializa Firebase com as variáveis globais
const firebaseConfig = {
  apiKey: "AIzaSyBAYby8HRcTsjrlN7P6v7IOaQiMia1nf1k",
  authDomain: "fotos-be32b.firebaseapp.com",
  databaseURL: "https://fotos-be32b-default-rtdb.firebaseio.com",
  projectId: "fotos-be32b",
  storageBucket: "fotos-be32b.appspot.com",
  messagingSenderId: "629428664615",
  appId: "1:629428664615:web:371af57a06f9c5b2fad102",
  measurementId: "G-VMEFCW0JBM"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Carregar pastas do Firebase
document.addEventListener('DOMContentLoaded', loadFoldersFromFirebase);

// Outras funções como createFolder, addFile, saveFolders, etc.


// Função para criar nova pasta
function createFolder(name) {
    const folder = document.createElement('div');
    folder.classList.add('folder');
    folder.innerHTML = `
        <h3>${name}</h3>
        <button class="addFileBtn btn">Adicionar Arquivo</button>
        <input type="text" class="file-input" placeholder="Insira o link da imagem ou URL">
        <div class="filesContainer"></div>
    `;
    
    document.getElementById('foldersContainer').appendChild(folder);

    const addFileBtn = folder.querySelector('.addFileBtn');
    const fileInput = folder.querySelector('.file-input');
    const filesContainer = folder.querySelector('.filesContainer');

    addFileBtn.addEventListener('click', () => {
        fileInput.style.display = 'block';
        fileInput.focus();
    });

    fileInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' && fileInput.value.trim() !== '') {
            if (isValidUrl(fileInput.value)) {
                addFile(fileInput.value, filesContainer);
                fileInput.value = '';
                fileInput.style.display = 'none';
                saveFolders();  // Salvar no Firebase
            } else {
                alert('Por favor, insira um URL válido.');
            }
        }
    });
}

// Função para adicionar arquivo
function addFile(url, container) {
    const fileItem = document.createElement('div');
    fileItem.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    container.appendChild(fileItem);
}

// Função para validar URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Função para salvar pastas no Firebase
function saveFoldersToFirebase(folders) {
    set(ref(database, 'folders/'), folders)
        .then(() => {
            console.log('Dados salvos no Firebase com sucesso!');
        })
        .catch((error) => {
            console.error('Erro ao salvar dados no Firebase:', error);
        });
}

// Função para carregar pastas do Firebase
function loadFoldersFromFirebase() {
    const dbRef = ref(database);
    get(child(dbRef, 'folders/')).then((snapshot) => {
        if (snapshot.exists()) {
            const folders = snapshot.val();
            Object.values(folders).forEach(folder => {
                createFolder(folder.name);
                const newFolder = document.querySelectorAll('.folder');
                const filesContainer = newFolder[newFolder.length - 1].querySelector('.filesContainer');
                folder.files.forEach(file => addFile(file, filesContainer));
            });
        } else {
            console.log('Nenhuma pasta encontrada');
        }
    }).catch((error) => {
        console.error('Erro ao carregar dados do Firebase:', error);
    });
}

// Função para salvar pastas
function saveFolders() {
    const folders = [];
    document.querySelectorAll('.folder').forEach(folder => {
        const name = folder.querySelector('h3').innerText;
        const files = Array.from(folder.querySelectorAll('.filesContainer div a'))
                          .map(file => file.href);
        folders.push({ name, files });
    });

    // Armazenar no localStorage
    localStorage.setItem('folders', JSON.stringify(folders));

    // Salvar no Firebase
    saveFoldersToFirebase(folders);
}
