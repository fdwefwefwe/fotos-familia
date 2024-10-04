document.addEventListener("DOMContentLoaded", function () {
    const newFolderBtn = document.getElementById("newFolderBtn");
    const foldersContainer = document.getElementById("foldersContainer");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const mediaContainer = document.getElementById("imagesContainer");
    const downloadAllBtn = document.getElementById("downloadAllBtn");
    const toggleLinks = document.getElementById("toggleLinks");
    const linkSection = document.getElementById("linkSection");

    // Função para salvar dados no LocalStorage
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Função para carregar dados do LocalStorage
    function loadFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Função para carregar mídias salvas
    function loadMedia() {
        const savedMedia = loadFromLocalStorage("media");
        if (savedMedia) {
            savedMedia.forEach((mediaSrc, index) => {
                addMedia(mediaSrc, index);
            });
        }
    }

    // Função para adicionar mídia (imagem ou vídeo) na página com um botão de exclusão
    function addMedia(mediaSrc, index) {
        const mediaDiv = document.createElement("div");
        mediaDiv.classList.add("media-wrapper");

        const mediaElement = mediaSrc.startsWith("data:video") ? document.createElement("video") : document.createElement("img");
        mediaElement.src = mediaSrc;
        mediaElement.classList.add("uploaded-media");
        if (mediaElement.tagName === "VIDEO") {
            mediaElement.controls = true;
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.classList.add("delete-btn");

        // Evento de exclusão de mídia
        deleteBtn.addEventListener("click", function () {
            deleteMedia(index);
        });

        // Evento de visualização em tela cheia
        mediaElement.addEventListener("click", function() {
            openFullscreen(mediaElement);
        });

        mediaDiv.appendChild(mediaElement);
        mediaDiv.appendChild(deleteBtn);
        mediaContainer.appendChild(mediaDiv);
    }

    // Função para abrir mídia em tela cheia com borda
    function openFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }

        element.classList.add('fullscreen-media');

        // Adicionar evento para remover a classe quando sair da tela cheia
        document.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
                element.classList.remove('fullscreen-media');
            }
        });
    }

    // Função para converter arquivo para Base64
    function convertToBase64(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
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
            <button class="addFileBtn">+</button>
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
            deleteFolder(folderName);
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
            fileDiv.remove();
            removeLinkFromFolder(fileUrl);
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
                folder.files.splice(index, 1);
            }
        });

        saveToLocalStorage("folders", folders);
    }

    // Função para salvar um link em uma pasta específica no LocalStorage
    function saveLinkToFolder(folderName, fileUrl) {
        let folders = loadFromLocalStorage("folders") || [];
        const folderIndex = folders.findIndex(folder => folder.name === folderName);

        if (folderIndex !== -1) {
            folders[folderIndex].files.push(fileUrl);
        } else {
            folders.push({ name: folderName, files: [fileUrl] });
        }

        saveToLocalStorage("folders", folders);
    }

    // Função para excluir uma pasta do LocalStorage e do DOM
    function deleteFolder(folderName) {
        let folders = loadFromLocalStorage("folders") || [];
        folders = folders.filter(folder => folder.name !== folderName);

        saveToLocalStorage("folders", folders);

        foldersContainer.innerHTML = "";
        loadFolders();
    }

    // Função para criar uma nova pasta
    newFolderBtn.addEventListener("click", function () {
        const folderName = prompt("Digite o nome da nova pasta:");
        if (folderName) {
            const folders = loadFromLocalStorage("folders") || [];
            folders.push({ name: folderName, files: [] });

            saveToLocalStorage("folders", folders);
            addFolder(folderName);
        }
    });

    // Evento para abrir o explorador de arquivos
    uploadBtn.addEventListener("click", function () {
        fileInput.click();
    });

    // Evento para enviar mídia e armazenar em Base64 no LocalStorage
    fileInput.addEventListener("change", function () {
        const files = fileInput.files;
        if (files.length > 0) {
            Array.from(files).forEach(file => {
                convertToBase64(file, function (base64Media) {
                    const media = loadFromLocalStorage("media") || [];
                    media.push(base64Media);

                    saveToLocalStorage("media", media);
                    addMedia(base64Media, media.length - 1);
                });
            });

            fileInput.value = "";
        } else {
            alert("Por favor, selecione uma imagem ou vídeo para enviar.");
        }
    });

    // Função para excluir uma mídia do LocalStorage e da página
    function deleteMedia(index) {
        const media = loadFromLocalStorage("media") || [];

        if (index > -1) {
            media.splice(index, 1);
            saveToLocalStorage("media", media);
            mediaContainer.innerHTML = "";
            loadMedia();
        }
    }

    document.getElementById("clearAllBtn").addEventListener("click", function () {
        const confirmation = confirm("Tem certeza de que deseja excluir todas as mídias?");
        if (confirmation) {
            localStorage.removeItem("media");
            mediaContainer.innerHTML = "";
            alert("Todas as mídias foram removidas.");
        }
    });

    // Função para baixar todas as mídias
    downloadAllBtn.addEventListener("click", function () {
        const media = loadFromLocalStorage("media") || [];
        if (media.length > 0) {
            const zip = new JSZip();
            const folder = zip.folder("Media");

            media.forEach((mediaSrc, index) => {
                const base64Data = mediaSrc.split(",")[1];
                const extension = mediaSrc.startsWith("data:video") ? "mp4" : "png";
                folder.file(`media${index + 1}.${extension}`, base64Data, { base64: true });
            });

            const zipName = prompt("Digite o nome do arquivo ZIP (sem extensão):", "media");

            zip.generateAsync({ type: "blob" }).then(function (content) {
                const blob = new Blob([content], { type: "application/zip" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${zipName}.zip`;
                link.click();
            });
        } else {
            alert("Não há mídias para baixar.");
        }
    });

    // Alternar seção de links com animação de seta
    toggleLinks.addEventListener("click", function() {
        linkSection.classList.toggle("hidden");
        toggleLinks.classList.toggle("active");
        
        // Alternar a classe para rotacionar a seta
        const arrow = toggleLinks.querySelector('.arrow');
        arrow.classList.toggle('rotated');
    });

    // Inicializar a página
    loadMedia();
    loadFolders();
    linkSection.classList.add("hidden"); // Iniciar com a seção de links fechada

    // Adicionar seta ao toggleLinks
    const arrow = document.createElement('span');
    arrow.classList.add('arrow');
    arrow.innerHTML = '&#9660;'; // Código Unicode para uma seta para baixo
    toggleLinks.appendChild(arrow);
});
