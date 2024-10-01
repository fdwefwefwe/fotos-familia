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

    // Função para carregar imagens salvas
    function loadImages() {
        const savedImages = loadFromLocalStorage("images");
        if (savedImages) {
            savedImages.forEach((imageSrc, index) => {
                addImage(imageSrc, index);
            });
        }
    }

    // Função para adicionar imagem na página com um botão de exclusão
    function addImage(imageSrc, index) {
        const imgDiv = document.createElement("div");
        imgDiv.classList.add("image-wrapper");

        const img = document.createElement("img");
        img.src = imageSrc;
        img.classList.add("uploaded-image");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.classList.add("delete-btn");

        // Evento de exclusão de imagem
        deleteBtn.addEventListener("click", function () {
            deleteImage(index); // Remover do LocalStorage e do DOM
        });

        imgDiv.appendChild(img);
        imgDiv.appendChild(deleteBtn);
        imagesContainer.appendChild(imgDiv);
    }

    // Função para converter arquivo de imagem para Base64
    function convertToBase64(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result); // O resultado será a string Base64
        };
        reader.readAsDataURL(file);
    }

    // Função para carregar pastas e seus arquivos salvos
    function loadFolders() {
        const savedFolders = loadFromLocalStorage("folders");
        if (savedFolders) {
            savedFolders.forEach(folder => {
                addFolder(folder.name, folder.files);
            });
        }
    }

    // Função para adicionar uma nova pasta na página
    function addFolder(folderName, files = []) {
        const folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");
        folderDiv.innerHTML = `
            <h3>${folderName} <button class="deleteFolderBtn">Excluir</button></h3>
            <button class="addFileBtn">Adicionar Arquivo</button>
            <div class="filesContainer"></div>
        `;
        foldersContainer.appendChild(folderDiv);

        const filesContainer = folderDiv.querySelector(".filesContainer");

        // Adicionar arquivos existentes (caso haja)
        files.forEach(fileUrl => {
            addFileToFolder(fileUrl, filesContainer);
        });

        // Evento para o botão de adicionar arquivo
        const addFileBtn = folderDiv.querySelector(".addFileBtn");
        addFileBtn.addEventListener("click", function () {
            const fileUrl = prompt("Insira a URL do arquivo:");
            if (fileUrl) {
                addFileToFolder(fileUrl, filesContainer);
                saveLinkToFolder(folderName, fileUrl);
            }
        });

        // Evento para o botão de excluir pasta
        const deleteFolderBtn = folderDiv.querySelector(".deleteFolderBtn");
        deleteFolderBtn.addEventListener("click", function () {
            deleteFolder(folderName); // Excluir a pasta
        });
    }

    // Função para adicionar um arquivo (link) a uma pasta
    function addFileToFolder(fileUrl, filesContainer) {
        const fileDiv = document.createElement("div");
        fileDiv.textContent = fileUrl;

        const deleteLinkBtn = document.createElement("button");
        deleteLinkBtn.textContent = "X";
        deleteLinkBtn.classList.add("deleteLinkBtn");

        // Evento de exclusão de link
        deleteLinkBtn.addEventListener("click", function () {
            fileDiv.remove(); // Remove do DOM
            removeLinkFromFolder(fileUrl); // Remove do LocalStorage
        });

        fileDiv.appendChild(deleteLinkBtn);
        filesContainer.appendChild(fileDiv);
    }

    // Função para remover um link de uma pasta no LocalStorage
    function removeLinkFromFolder(fileUrl) {
        let folders = loadFromLocalStorage("folders") || [];
        folders.forEach(folder => {
            const index = folder.files.indexOf(fileUrl);
            if (index !== -1) {
                folder.files.splice(index, 1); // Remove o link do array
            }
        });

        // Salvar as pastas atualizadas no LocalStorage
        saveToLocalStorage("folders", folders);
    }

    // Função para salvar um link em uma pasta específica no LocalStorage
    function saveLinkToFolder(folderName, fileUrl) {
        let folders = loadFromLocalStorage("folders") || [];
        const folderIndex = folders.findIndex(folder => folder.name === folderName);

        if (folderIndex !== -1) {
            folders[folderIndex].files.push(fileUrl);
        } else {
            // Caso a pasta não exista por algum motivo, criar uma nova
            folders.push({ name: folderName, files: [fileUrl] });
        }

        // Salvar as pastas atualizadas no LocalStorage
        saveToLocalStorage("folders", folders);
    }

    // Função para excluir uma pasta do LocalStorage e do DOM
    function deleteFolder(folderName) {
        let folders = loadFromLocalStorage("folders") || [];
        folders = folders.filter(folder => folder.name !== folderName); // Remove a pasta

        // Salvar as pastas atualizadas no LocalStorage
        saveToLocalStorage("folders", folders);

        // Recarregar as pastas
        foldersContainer.innerHTML = ""; // Limpar todas as pastas exibidas
        loadFolders(); // Recarregar todas as pastas atualizadas
    }

    // Função para criar uma nova pasta
    newFolderBtn.addEventListener("click", function () {
        const folderName = prompt("Digite o nome da nova pasta:");
        if (folderName) {
            const folders = loadFromLocalStorage("folders") || [];
            folders.push({ name: folderName, files: [] });

            // Salvar pastas no LocalStorage
            saveToLocalStorage("folders", folders);

            // Adicionar pasta ao DOM
            addFolder(folderName);
        }
    });

    // Evento para abrir o explorador de arquivos
    uploadBtn.addEventListener("click", function () {
        fileInput.click();
    });

    // Evento para enviar imagem e armazenar em Base64 no LocalStorage
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            convertToBase64(file, function (base64Image) {
                const images = loadFromLocalStorage("images") || [];
                images.push(base64Image);

                // Salvar imagem em Base64 no LocalStorage
                saveToLocalStorage("images", images);

                // Adicionar imagem ao DOM
                addImage(base64Image, images.length - 1);

                fileInput.value = ""; // Limpar o campo de entrada
            });
        } else {
            alert("Por favor, selecione uma imagem para enviar.");
        }
    });

    // Função para excluir uma imagem do LocalStorage e da página
    function deleteImage(index) {
        const images = loadFromLocalStorage("images") || [];

        if (index > -1) {
            images.splice(index, 1); // Remove a imagem do array

            // Atualizar o LocalStorage
            saveToLocalStorage("images", images);

            // Recarregar a exibição de imagens
            imagesContainer.innerHTML = ""; // Limpar todas as imagens exibidas
            loadImages(); // Recarregar todas as imagens atualizadas
        }
    }

    // Carregar imagens e pastas ao iniciar
    loadImages();
    loadFolders();
});
