document.addEventListener("DOMContentLoaded", function () {
    const newFolderBtn = document.getElementById("newFolderBtn");
    const foldersContainer = document.getElementById("foldersContainer");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const imagesContainer = document.getElementById("imagesContainer");
    const downloadAllBtn = document.getElementById("downloadAllBtn");
    const totalImagesDisplay = document.getElementById("totalImagesDisplay");

    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function loadFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    function loadImages() {
        const savedImages = loadFromLocalStorage("images");
        if (savedImages) {
            savedImages.forEach((imageSrc, index) => {
                addImage(imageSrc, index);
            });
            updateTotalImages(savedImages.length);
        }
    }

    function addImage(imageSrc, index) {
        const imgDiv = document.createElement("div");
        imgDiv.classList.add("image-wrapper");

        const img = document.createElement("img");
        img.src = imageSrc;
        img.classList.add("uploaded-image");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", function () {
            deleteImage(index);
        });

        imgDiv.appendChild(img);
        imgDiv.appendChild(deleteBtn);
        imagesContainer.appendChild(imgDiv);
    }

    function convertToBase64(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }

    function loadFolders() {
        const savedFolders = loadFromLocalStorage("folders");
        if (savedFolders) {
            savedFolders.forEach(folder => {
                addFolder(folder.name, folder.files);
            });
        }
    }

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

        files.forEach(fileUrl => {
            addFileToFolder(fileUrl, filesContainer);
        });

        const addFileBtn = folderDiv.querySelector(".addFileBtn");
        addFileBtn.addEventListener("click", function () {
            const fileUrl = prompt("Insira a URL do arquivo:");
            if (fileUrl) {
                addFileToFolder(fileUrl, filesContainer);
                saveLinkToFolder(folderName, fileUrl);
            }
        });

        const deleteFolderBtn = folderDiv.querySelector(".deleteFolderBtn");
        deleteFolderBtn.addEventListener("click", function () {
            deleteFolder(folderName);
        });
    }

    function addFileToFolder(fileUrl, filesContainer) {
        const fileDiv = document.createElement("div");
        fileDiv.textContent = fileUrl;

        const deleteLinkBtn = document.createElement("button");
        deleteLinkBtn.textContent = "X";
        deleteLinkBtn.classList.add("deleteLinkBtn");

        deleteLinkBtn.addEventListener("click", function () {
            fileDiv.remove();
            removeLinkFromFolder(fileUrl);
        });

        fileDiv.appendChild(deleteLinkBtn);
        filesContainer.appendChild(fileDiv);
    }

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

    function deleteFolder(folderName) {
        let folders = loadFromLocalStorage("folders") || [];
        folders = folders.filter(folder => folder.name !== folderName);
        saveToLocalStorage("folders", folders);
        foldersContainer.innerHTML = "";
        loadFolders();
    }

    newFolderBtn.addEventListener("click", function () {
        const folderName = prompt("Digite o nome da nova pasta:");
        if (folderName) {
            const folders = loadFromLocalStorage("folders") || [];
            folders.push({ name: folderName, files: [] });
            saveToLocalStorage("folders", folders);
            addFolder(folderName);
        }
    });

    uploadBtn.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        const files = fileInput.files;
        if (files.length > 0) {
            Array.from(files).forEach(file => {
                convertToBase64(file, function (base64Image) {
                    const images = loadFromLocalStorage("images") || [];
                    images.push(base64Image);
                    saveToLocalStorage("images", images);
                    addImage(base64Image, images.length - 1);
                    updateTotalImages(images.length);
                });
            });
            fileInput.value = "";
        } else {
            alert("Por favor, selecione uma imagem para enviar.");
        }
    });

    function deleteImage(index) {
        const images = loadFromLocalStorage("images") || [];
        if (index > -1) {
            images.splice(index, 1);
            saveToLocalStorage("images", images);
            imagesContainer.innerHTML = "";
            loadImages();
            updateTotalImages(images.length);
        }
    }

    function updateTotalImages(count) {
        totalImagesDisplay.textContent = `Total de Imagens: ${count}`;
    }

    document.getElementById("clearAllBtn").addEventListener("click", function () {
        const confirmation = confirm("Tem certeza de que deseja excluir todas as imagens?");
        if (confirmation) {
            localStorage.removeItem("images");
            imagesContainer.innerHTML = "";
            updateTotalImages(0);
            alert("Todas as imagens foram removidas.");
        }
    });

    downloadAllBtn.addEventListener("click", function () {
        const images = loadFromLocalStorage("images") || [];
        if (images.length > 0) {
            const zip = new JSZip();
            const folder = zip.folder("Imagens");

            images.forEach((imageSrc, index) => {
                const base64Data = imageSrc.split(",")[1];
                folder.file(`imagem${index + 1}.png`, base64Data, { base64: true });
            });

            const zipName = prompt("Digite o nome do arquivo zip:", "imagens");
            zip.generateAsync({ type: "blob" }).then(function (content) {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(content);
                link.download = `${zipName || 'imagens'}.zip`;
                link.click();
            });
        } else {
            alert("Nenhuma imagem para baixar.");
        }
    });

    loadImages();
    loadFolders();
});
