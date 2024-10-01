document.addEventListener("DOMContentLoaded", function () {
    const newFolderBtn = document.getElementById("newFolderBtn");
    const foldersContainer = document.getElementById("foldersContainer");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const imagesContainer = document.getElementById("imagesContainer");

    // Função para carregar pastas e arquivos salvos no localStorage
    function loadFolders() {
        const savedFolders = JSON.parse(localStorage.getItem('folders')) || [];
        savedFolders.forEach(folder => {
            createFolder(folder.name, folder.files);
        });
    }

    // Função para salvar pastas no localStorage
    function saveFolders() {
        const folders = [];
        const folderElements = foldersContainer.querySelectorAll('.folder');
        folderElements.forEach(folderDiv => {
            const folderName = folderDiv.querySelector('h3').textContent;
            const fileElements = folderDiv.querySelectorAll('.filesContainer div');
            const files = [];
            fileElements.forEach(fileDiv => {
                files.push(fileDiv.textContent);
            });
            folders.push({ name: folderName, files });
        });
        localStorage.setItem('folders', JSON.stringify(folders));
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

        // Adiciona arquivos existentes à pasta (se houver)
        const filesContainer = folderDiv.querySelector(".filesContainer");
        files.forEach(fileUrl => {
            const fileDiv = document.createElement("div");
            fileDiv.textContent = fileUrl;
            filesContainer.appendChild(fileDiv);
        });

        // Evento para o botão de adicionar arquivo
        const addFileBtn = folderDiv.querySelector(".addFileBtn");
        addFileBtn.addEventListener("click", function () {
            const fileUrl = prompt("Insira a URL do arquivo:");
            if (fileUrl) {
                const fileDiv = document.createElement("div");
                fileDiv.textContent = fileUrl;
                filesContainer.appendChild(fileDiv);
                saveFolders(); // Salva os dados atualizados
            }
        });

        // Botão para excluir a pasta
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Excluir Pasta";
        deleteBtn.classList.add("deleteBtn");
        folderDiv.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', function () {
            folderDiv.remove();
            saveFolders(); // Salva após exclusão
        });
    }

    // Função para adicionar nova pasta
    newFolderBtn.addEventListener("click", function () {
        const folderName = prompt("Digite o nome da nova pasta:");
        if (folderName) {
            createFolder(folderName);
            saveFolders(); // Salva nova pasta
        }
    });

    // Função para abrir o explorador de arquivos ao clicar no botão de enviar imagem
    uploadBtn.addEventListener("click", function () {
        fileInput.click(); // Isso abrirá o explorador de arquivos
    });

    // Função para enviar imagem
    fileInput.addEventListener("change", function () {
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

    // Carrega pastas salvas ao iniciar a página
    loadFolders();
});
