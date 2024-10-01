document.addEventListener("DOMContentLoaded", function () {
    const newFolderBtn = document.getElementById("newFolderBtn");
    const foldersContainer = document.getElementById("foldersContainer");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const imagesContainer = document.getElementById("imagesContainer");
    const downloadAllBtn = document.getElementById("downloadAllBtn");

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

    function deleteImage(index) {
        const images = loadFromLocalStorage("images") || [];

        if (index > -1) {
            images.splice(index, 1);
            saveToLocalStorage("images", images);
            imagesContainer.innerHTML = "";
            loadImages();
        }
    }

    uploadBtn.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            convertToBase64(file, function (base64Image) {
                const images = loadFromLocalStorage("images") || [];
                images.push(base64Image);
                saveToLocalStorage("images", images);
                addImage(base64Image, images.length - 1);
                fileInput.value = "";
            });
        } else {
            alert("Por favor, selecione uma imagem para enviar.");
        }
    });

    // Função para baixar todas as imagens do LocalStorage
    function downloadImage(base64Image, index) {
        const a = document.createElement("a");
        a.href = base64Image;
        a.download = `imagem_${index + 1}.png`; // Nome da imagem
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    downloadAllBtn.addEventListener("click", function () {
        const images = loadFromLocalStorage("images") || [];

        if (images.length === 0) {
            alert("Nenhuma imagem para baixar!");
            return;
        }

        images.forEach((image, index) => {
            downloadImage(image, index);
        });
    });

    loadImages();
    loadFolders();
});
