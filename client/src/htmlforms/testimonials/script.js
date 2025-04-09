

document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("photo-displaying-page");

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

            photos.forEach(photo => {
                const photoItem = document.createElement("div");
                photoItem.classList.add("photo-item");

                const imgLink = document.createElement("a");
                imgLink.setAttribute("data-fslightbox", "gallery");
                imgLink.href = photo.url;

                const img = document.createElement("img");
                img.src = photo.url;
                img.alt = "Photo";

                imgLink.appendChild(img);
                photoItem.appendChild(imgLink);
                gallery.appendChild(photoItem);
            });

            // Initialize FS Lightbox
            refreshFsLightbox();
        } catch (error) {
            console.error("Error loading photos:", error);
        }
    }

    const pageCategory = document.body.getAttribute("data-category") || 'Testimonials';
    loadPhotos(pageCategory);
});
