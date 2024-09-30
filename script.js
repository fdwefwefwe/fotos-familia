document.addEventListener('DOMContentLoaded', loadFolders);
document.getElementById('newFolderBtn').addEventListener('click', function () {
    const folderName = prompt('Digite o nome da nova pasta:');
    if (folderName) {
        createFolder(folderName);
        saveFolders();
    }
});

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
                saveFolders();  // Save to localStorage
            } else {
                alert('Por favor, insira um URL válido.');
            }
        }
    });
}

function addFile(url, container) {
    const fileItem = document.createElement('div');
    fileItem.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    container.appendChild(fileItem);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function saveFolders() {
    const folders = [];
    document.querySelectorAll('.folder').forEach(folder => {
        const name = folder.querySelector('h3').innerText;
        const files = Array.from(folder.querySelectorAll('.filesContainer div a'))
                          .map(file => file.href);
        folders.push({ name, files });
    });
    localStorage.setItem('folders', JSON.stringify(folders));
}

function loadFolders() {
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    folders.forEach(folder => {
        createFolder(folder.name);
        const newFolder = document.querySelectorAll('.folder');
        const filesContainer = newFolder[newFolder.length - 1].querySelector('.filesContainer');
        folder.files.forEach(file => addFile(file, filesContainer));
    });
}
