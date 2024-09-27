document.addEventListener('DOMContentLoaded', loadFolders);
document.getElementById('newFolderBtn').addEventListener('click', function() {
    const folderName = prompt('Digite o nome da nova pasta:');
    if (folderName) {
        createFolder(folderName);
        saveFolders();
    }
});

function createFolder(name) {
    const folder = document.createElement('div');
    folder.classList.add('folder');
    folder.innerHTML = `<h3>${name}</h3>
                        <button class="addFileBtn">Adicionar Arquivo</button>
                        <input type="text" class="file-input" placeholder="Insira o link da imagem ou URL">
                        <div class="filesContainer"></div>`;
    
    document.getElementById('foldersContainer').appendChild(folder);
    
    const addFileBtn = folder.querySelector('.addFileBtn');
    const fileInput = folder.querySelector('.file-input');
    const filesContainer = folder.querySelector('.filesContainer');

    addFileBtn.addEventListener('click', function() {
        fileInput.style.display = 'block';
        fileInput.focus();
    });

    fileInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && fileInput.value.trim() !== '') {
            addFile(fileInput.value, filesContainer);
            fileInput.value = '';
            fileInput.style.display = 'none';
            saveFolders();  // Save to localStorage
        }
    });
}

function addFile(url, container) {
    const fileItem = document.createElement('div');
    fileItem.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    container.appendChild(fileItem);
}

function saveFolders() {
    const folders = [];
    document.querySelectorAll('.folder').forEach(folder => {
        const name = folder.querySelector('h3').innerText;
        const files = Array.from(folder.querySelectorAll('.filesContainer div'))
                          .map(file => file.innerText);
        folders.push({ name, files });
    });
    localStorage.setItem('folders', JSON.stringify(folders));
}

function loadFolders() {
    const folders = JSON.parse(localStorage.getItem('folders'));
    if (folders) {
        folders.forEach(folder => {
            const newFolder = createFolder(folder.name);
            folder.files.forEach(file => addFile(file, newFolder.querySelector('.filesContainer')));
        });
    }
}
