/*
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

*/

/*
document.addEventListener("DOMContentLoaded", async () => {
    const videoGallery = document.getElementById("video-gallery");
    const videoPopup = document.getElementById("video-popup");
    const popupVideo = document.getElementById("popup-video");
    const closePopup = document.getElementById("close-popup");

    try {
        // Hent videoene fra Cloudinary-endepunktet
        const response = await fetch("/api/uploads");
        const videos = await response.json();

        // Bygg galleriet dynamisk
        videos.forEach(video => {
            if (video.resource_type === "video") {
                // Opprett en container for video og navn
                const videoContainer = document.createElement("div");
                videoContainer.classList.add("video-container");

                // Opprett miniatyrvideo
                const videoElement = document.createElement("video");
                videoElement.src = video.secure_url;
                videoElement.setAttribute("controls", false);
                videoElement.setAttribute("muted", true);
                videoElement.classList.add("thumbnail");

                // Legg til click-event for popup
                videoElement.addEventListener("click", () => {
                    popupVideo.src = video.secure_url;
                    videoPopup.classList.add("visible");

                    // Pause alle miniatyrvideoer
                    const allThumbnails = document.querySelectorAll(".thumbnail");
                    allThumbnails.forEach(thumbnail => thumbnail.pause());
                });

                // Fjern mappenavnet fra public_id for å vise kun filnavnet
                const fileName = video.public_id.split("/").pop(); // Fjerner mappenavn

                // Legg til videoens navn
                const videoName = document.createElement("div");
                videoName.classList.add("video-name");
                videoName.textContent = fileName;

                // Sett sammen containeren
                videoContainer.appendChild(videoElement);
                videoContainer.appendChild(videoName);

                // Legg containeren i galleriet
                videoGallery.appendChild(videoContainer);
            }
        });

        // Lukk popup-en
        closePopup.addEventListener("click", () => {
            videoPopup.classList.remove("visible");
            popupVideo.pause();
            popupVideo.src = ""; // Fjern kilden for å stoppe avspilling
        });

        // Lukk popup når du klikker utenfor videoen
        videoPopup.addEventListener("click", (event) => {
            if (event.target === videoPopup) {
                videoPopup.classList.remove("visible");
                popupVideo.pause();
                popupVideo.src = ""; // Fjern kilden for å stoppe avspilling
            }
        });
    } catch (error) {
        console.error("Feil ved henting av videoer:", error);
    }
});

*/

document.addEventListener("DOMContentLoaded", async () => {
    const videoGallery = document.getElementById("video-gallery");
    const newVideoGallery = document.getElementById("new-video-gallery");
    const videoPopup = document.getElementById("video-popup");
    const popupVideo = document.getElementById("popup-video");
    const closePopup = document.getElementById("close-popup");

    // Funksjon for å vise videoer i galleriet
    const displayVideos = (videos, container) => {
        videos.forEach(video => {
            if (video.resource_type === "video") {
                const videoContainer = document.createElement("div");
                videoContainer.classList.add("video-container");

                const videoElement = document.createElement("video");
                videoElement.src = video.secure_url;
                videoElement.setAttribute("controls", false);
                videoElement.setAttribute("muted", true);
                videoElement.classList.add("thumbnail");

                // Legg til klikkfunksjon for popup
                videoElement.addEventListener("click", () => {
                    popupVideo.src = video.secure_url; // Sett popup-videoens kilde
                    videoPopup.classList.add("visible"); // Vis popup
                    popupVideo.play(); // Start videoen automatisk

                    // Pause alle bakgrunnsvideoer
                    const allThumbnails = document.querySelectorAll(".thumbnail");
                    allThumbnails.forEach(thumbnail => thumbnail.pause());
                });

                const videoName = document.createElement("div");
                videoName.classList.add("video-name");
                videoName.textContent = video.public_id.split("/").pop();

                videoContainer.appendChild(videoElement);
                videoContainer.appendChild(videoName);
                container.appendChild(videoContainer);
            }
        });
    };

    try {
        // Hent eksisterende videoer og vis dem
        const response = await fetch("/api/uploads");
        const videos = await response.json();
        displayVideos(videos, videoGallery);

        // Hent nye videoer og vis dem
        const newResponse = await fetch("/api/uploads/newfolder");
        const newVideos = await newResponse.json();
        displayVideos(newVideos, newVideoGallery);
    } catch (error) {
        console.error("Error fetching videos:", error);
    }

    // Lukk popup når du klikker på "lukk"-knappen
    closePopup.addEventListener("click", () => {
        videoPopup.classList.remove("visible");
        popupVideo.pause(); // Pause popup-videoen
        popupVideo.src = ""; // Fjern kilden for å stoppe avspilling
    });

    // Lukk popup når du klikker utenfor selve videoen
    videoPopup.addEventListener("click", (event) => {
        if (event.target === videoPopup) {
            videoPopup.classList.remove("visible");
            popupVideo.pause(); // Pause popup-videoen
            popupVideo.src = ""; // Fjern kilden for å stoppe avspilling
        }
    });
});