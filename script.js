document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const imagesContainer = document.getElementById('imagesContainer');

    // Lidar com o envio de imagem
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(uploadForm);
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            addImageToPage(result.fileUrl); // Adiciona a nova imagem na página
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
        }
    });

    // Função para exibir uma imagem na página
    function addImageToPage(fileUrl) {
        const img = document.createElement('img');
        img.src = fileUrl;
        img.alt = 'Imagem enviada';
        img.classList.add('uploaded-image');
        imagesContainer.appendChild(img);
    }

    // Carregar e exibir as imagens já enviadas
    async function loadImages() {
        try {
            const response = await fetch('/images');
            const imageUrls = await response.json();
            imageUrls.forEach(url => addImageToPage(url));
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
        }
    }

    // Carregar as imagens quando a página for carregada
    loadImages();
});
