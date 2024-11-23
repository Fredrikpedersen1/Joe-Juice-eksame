async function fetchMedia() {
    try {
        const response = await fetch("/api/uploads"); // Henter fra API
        const media = await response.json(); // Konverterer til JSON

        const container = document.getElementById("media-container"); // Finn containeren der media skal vises

        media.forEach(item => {
            if (item.resource_type === "image") {
                // Opprett et bilde-element
                const img = document.createElement("img");
                img.src = item.secure_url; // Sett Cloudinary-URL som kilde
                img.alt = item.public_id; // Bruk public_id som alt-tekst
                img.style.width = "100%"; // Valgfri styling
                img.style.marginBottom = "20px";
                container.appendChild(img);
            } else if (item.resource_type === "video") {
                // Opprett et video-element
                const video = document.createElement("video");
                video.src = item.secure_url; // Sett Cloudinary-URL som kilde
                video.controls = true; // Aktiver video-kontroller (play/pause)
                video.style.width = "100%"; // Valgfri styling
                video.style.marginBottom = "20px";
                container.appendChild(video);
            }
        });
    } catch (error) {
        console.error("Error fetching media:", error);
    }
}

// Kall funksjonen når siden lastes
fetchMedia();