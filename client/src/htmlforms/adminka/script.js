const categorySelect = document.getElementById('category-select');
const uploadBtn = document.getElementById('upload-btn');
const container = document.getElementById('photos-container');
const fileInput = document.getElementById('fileInput');

function previewImage(files) {
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoItem = document.createElement('div');
                photoItem.classList.add('photo-item');
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Фото';
                
                let fileName = `https://kyiykctigvsqdhixhrvy.supabase.co/storage/v1/object/public/images/${file.name}`;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✖';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.addEventListener('click', async () => {
                    await deletePhoto(fileName, photoItem);
                });

                photoItem.appendChild(img);
                photoItem.appendChild(deleteBtn);
                container.appendChild(photoItem);
            };
            reader.readAsDataURL(file);
        });
    }
}

async function uploadPhotos(category) {
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Будь ласка, виберіть фото для завантаження.');
        return;
    }

    const formData = new FormData();
    for (const file of files) {
        formData.append('photos', file);
    }
    formData.append('categories', JSON.stringify(category));

    try {
        const response = await fetch('http://localhost:3000/photos/uploadPhoto', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Помилка при завантаженні фото');
        }

        console.log('Фото успішно завантажено!');
        fetchPhotos(category);
    } catch (error) {
        console.error('Помилка:', error);
    }
}

async function fetchPhotos(category) {
    try {
        const response = await fetch('http://localhost:3000/photos/getPhotos', {
            method: 'POST',
            body: JSON.stringify({ category }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Помилка при завантаженні фото');
        }

        const photos = await response.json();
        container.innerHTML = '';

        photos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('photo-item');
            const img = document.createElement('img');
            img.src = photo.url;
            img.alt = 'Фото';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✖';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', async () => {
                await deletePhoto(photo.url, photoItem, category);
            });

            photoItem.appendChild(img);
            photoItem.appendChild(deleteBtn);
            container.appendChild(photoItem);
        });
    } catch (error) {
        console.error('Помилка:', error);
    }
}

async function deletePhoto(photoUrl, photoItem, category) {
    try {
        const response = await fetch('http://localhost:3000/photos/deletePhoto', {
            method: 'DELETE',
            body: JSON.stringify({ 
                url: photoUrl, 
                category: category,
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(category);
        console.log(photoUrl);

        if (!response.ok) {
            throw new Error('Помилка при видаленні фото');
        }

        console.log('Фото успішно видалено.');
        photoItem.remove(); // видалити фото з DOM
    } catch (error) {
        console.error('Помилка:', error);
    }
}

categorySelect.addEventListener('change', (event) => {
    localStorage.setItem('category', event.target.value);
    fetchPhotos([event.target.value]);
});

uploadBtn.addEventListener('click', () => {
    uploadPhotos([categorySelect.value]);
});

document.getElementById("fileInput").addEventListener("change", function () {
    document.getElementById("file-count").textContent = `Вибрано файлів: ${this.files.length}`;
});

document.getElementById("upload-btn").addEventListener("click", function () {
    fileInput.value = "";
    document.getElementById("file-count").textContent = "Вибрано файлів: 0";
});
