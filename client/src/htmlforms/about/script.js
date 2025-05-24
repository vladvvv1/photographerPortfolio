// document.addEventListener("DOMContentLoaded", function () {
//     const gallery = document.getElementById("photo-displaying-page");
//     const loader = document.getElementById("loader");

//     async function loadPhotos(category) {
//         try {
//             loader.style.display = "block";
//             gallery.style.display = "none";

//             const response = await fetch("http://localhost:3000/photos/getPhotos", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ category }),
//             });

//             if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//             const photos = await response.json();
//             gallery.innerHTML = "";

//             if (!photos || photos.length === 0) {
//                 loader.textContent = "Фото не знайдено.";
//                 return;
//             }

//             const fragment = document.createDocumentFragment();
//             let loadedCount = 0;
//             const totalPhotos = photos.length;

//             photos.reverse().forEach(photo => {
//                 const photoItem = document.createElement("div");
//                 photoItem.classList.add("photo-item");

//                 const imgLink = document.createElement("a");
//                 imgLink.setAttribute("data-fslightbox", "gallery");
//                 imgLink.href = photo.url;

//                 const img = new Image();
//                 img.src = photo.url;
//                 img.alt = "Фото";
//                 img.loading = "lazy";
//                 img.classList.add("lazy-fade");

//                 img.onload = img.onerror = () => {
//                     loadedCount++;
//                     if (loadedCount === totalPhotos) {
//                         loader.style.display = "none";
//                         gallery.style.display = "flex";
//                         refreshFsLightbox();
//                     }
//                 };

//                 imgLink.appendChild(img);
//                 photoItem.appendChild(imgLink);
//                 fragment.appendChild(photoItem);
//             });

//             gallery.appendChild(fragment);
//         } catch (error) {
//             loader.textContent = "Сталася помилка при завантаженні.";
//             console.error("Error loading photos:", error);
//         }
//     }

//     const pageCategory = document.body.getAttribute("data-category") || "About";
//     loadPhotos(pageCategory);
// });
document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("photo-displaying-page");
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    async function loadPhotos(category) {
        try {
            const response = await fetch("http://localhost:3000/photos/getPhotos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const photos = await response.json();
            gallery.innerHTML = "";

            if (!photos || photos.length === 0) {
                gallery.innerHTML = "<p>No photos found.</p>";
                return;
            }

            const fragment = document.createDocumentFragment();

            photos.reverse().forEach(photo => {
                const photoItem = document.createElement("div");
                photoItem.classList.add("photo-item");

                const imgLink = document.createElement("a");
                imgLink.setAttribute("data-fslightbox", "gallery");
                imgLink.href = photo.url;

                const img = document.createElement("img");
                img.src = photo.url;
                img.alt = "Photo";
                img.loading = "lazy"; // ✅ lazy loading
                img.classList.add("lazy-fade");
                
                imgLink.appendChild(img);
                photoItem.appendChild(imgLink);
                gallery.appendChild(photoItem);
            });
            gallery.appendChild(fragment); // все додається за

            refreshFsLightbox();
        } catch (error) {
            console.error("Error loading photos:", error);
        }
    }

    const pageCategory = document.body.getAttribute("data-category") || "About";
    loadPhotos(pageCategory);
});

