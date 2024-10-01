document.addEventListener("DOMContentLoaded", function () {
    const newFolderBtn = document.getElementById("newFolderBtn");
    const foldersContainer = document.getElementById("foldersContainer");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const imagesContainer = document.getElementById("imagesContainer");

    // Função para salvar dados no LocalStorage
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Função para carregar dados do LocalStorage
    function loadFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Função para carregar pastas salvas
    function loadFolders() {
        const savedFolders = loadFromLocalStorage("folders");
        if (savedFolders) {
            savedFolders.forEach((folder) => {
                createFolder(folder.name, folder.files);
            });
        }
    }

    // Função para carregar imagens salvas
    function loadImages() {
        const savedImages = loadFromLocalStorage("images");
        if (savedImages) {
            savedImages.forEach((imageSrc) => {
                addImage(imageSrc);
            });
        }
    }

    // Função para criar uma nova pasta
    function createFolder(folderName, files = []) {
        const folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");
        folderDiv.innerHTML = `
            <h3>${folderName}</h3>
            <button class="addFileBtn">Adicionar Arquivo</button>
            <div class="filesContainer"></div>
        `;
        foldersContainer.appendChild(folderDiv);

        // Carregar arquivos existentes na pasta
        files.forEach((fileUrl) => {
            const fileDiv = document.createElement("div");
            fileDiv.textContent = fileUrl;
            folderDiv.querySelector(".filesContainer").appendChild(fileDiv);
        });

        // Evento para adicionar arquivo
        const addFileBtn = folderDiv.querySelector(".addFileBtn");
        addFileBtn.addEventListener("click", function () {
            const fileUrl = prompt("Insira a URL do arquivo:");
            if (fileUrl) {
                const fileDiv = document.createElement("div");
                fileDiv.textContent = fileUrl;
                folderDiv.querySelector(".filesContainer").appendChild(fileDiv);

                // Atualizar LocalStorage
                const folders = loadFromLocalStorage("folders") || [];
                const folderIndex = folders.findIndex(f => f.name === folderName);
                if (folderIndex !== -1) {
                    folders[folderIndex].files.push(fileUrl);
                    saveToLocalStorage("folders", folders);
                }
            }
        });
    }

    // Função para adicionar imagem na página
    function addImage(imageSrc) {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.classList.add("uploaded-image");
        imagesContainer.appendChild(img);
    }

    // Função para converter arquivo de imagem para Base64
    function convertToBase64(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result); // O resultado será a string Base64
        };
        reader.readAsDataURL(file);
    }

    // Evento para abrir o explorador de arquivos
    uploadBtn.addEventListener("click", function () {
        fileInput.click();
    });

    // Evento para enviar imagem e armazenar em Base64 no LocalStorage
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            convertToBase64(file, function (base64Image) {
                addImage(base64Image);

                // Salvar imagem em Base64 no LocalStorage
                const images = loadFromLocalStorage("images") || [];
                images.push(base64Image);
                saveToLocalStorage("images", images);

                fileInput.value = ""; // Limpar o campo de entrada
            });
        } else {
            alert("Por favor, selecione uma imagem para enviar.");
        }
    });

    // Carregar pastas e imagens ao iniciar
    loadFolders();
    loadImages();
});
