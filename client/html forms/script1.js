const apiUrl = "http://localhost:3000/api";

async function fetchPhoto() {
    const response = await fetch(`${apiUrl}/getPhoto`);
    const photos = await response.json();
}
