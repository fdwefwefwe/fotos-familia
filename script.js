document.addEventListener("DOMContentLoaded", function () {
    const newFolderBtn = document.getElementById("newFolderBtn");
    const foldersContainer = document.getElementById("foldersContainer");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const imagesContainer = document.getElementById("imagesContainer");

    // Função para adicionar nova pasta
    newFolderBtn.addEventListener("click", function () {
        const folderName = prompt("Digite o nome da nova pasta:");
        if (folderName) {
            const folderDiv = document.createElement("div");
            folderDiv.classList.add("folder");
            folderDiv.innerHTML = `<h3>${folderName}</h3><button class="addFileBtn">Adicionar Arquivo</button>`;
            foldersContainer.appendChild(folderDiv);
        }
    });

    // Função para enviar imagem
    uploadBtn.addEventListener("click", function () {
        const file = fileInput.files[0];
        if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.classList.add("uploaded-image");
            imagesContainer.appendChild(img);
            fileInput.value = ""; // Limpa o campo de entrada
        } else {
            alert("Por favor, selecione uma imagem para enviar.");
        }
    });
});
