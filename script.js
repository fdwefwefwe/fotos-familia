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

    // Carregar pastas salvas ao carregar a página
    function loadFolders() {
        const savedFolders = loadFromLocalStorage("folders");
        if (savedFolders) {
            savedFolders.forEach((folder) => {
                createFolder(folder.name, folder.files);
            });
        }
    }

    // Carregar imagens salvas ao carregar a página
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

    // Evento para adicionar nova pasta
    newFolderBtn.addEventListener("click", function () {
        const folderName = prompt("Digite o nome da nova pasta:");
        if (folderName) {
            createFolder(folderName);

            // Salvar pasta no LocalStorage
            const folders = loadFromLocalStorage("folders") || [];
            folders.push({ name: folderName, files: [] });
            saveToLocalStorage("folders", folders);
        }
    });

    // Função para adicionar imagem na página e salvar no LocalStorage
    function addImage(imageSrc) {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.classList.add("uploaded-image");
        imagesContainer.appendChild(img);
    }

    // Evento para abrir o explorador de arquivos
    uploadBtn.addEventListener("click", function () {
        fileInput.click();
    });

    // Função para enviar imagem e armazenar no LocalStorage
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            const imageSrc = URL.createObjectURL(file);
            addImage(imageSrc);

            // Salvar imagem no LocalStorage
            const images = loadFromLocalStorage("images") || [];
            images.push(imageSrc);
            saveToLocalStorage("images", images);

            fileInput.value = ""; // Limpar campo de entrada
        } else {
            alert("Por favor, selecione uma imagem para enviar.");
        }
    });

    // Carregar pastas e imagens ao iniciar
    loadFolders();
    loadImages();
});
