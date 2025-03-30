import { load } from "mime";

document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("photo-displaying-page");

    const pageCategory = document.body.getAttribute("data-category");

    function loadPhotos(category) {
        fetch("http://localhost:3000/photos/getPhotos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: "About" })
        })
        .then(response => response.json())
        .then(data => {
            gallery.innerHTML = "";

            if (!data.image || data.image.length === 0) {
                gallery.innerHTML = "<p>No photos found.</p>";
                return;
            }

            data.image.forEach(photo => {
                const img = document.createElement("img");
                img.src = 'http://localhost:3000/images/${photo}';
                img.alt = "Photo",
                gallery.appendChild(img);
            });
        })
        .catch(error => cosnole.error("Error loading photos: ", error));
    }
    if (pageCategory) {
        loadPhotos(pageCategory);
    }
})

async function getPhoto(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(data),  // Send data in request body
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
}

// Usage
const endpoint = "http://localhost:3000/photos/getPhotos";
getPhoto(endpoint, { category: "About" })  // Sending { category: "About" } in req.body
    .then(data => console.log(data))
    .catch(error => console.error("Error fetching photos:", error));
