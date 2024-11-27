
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require("express");
const cloudinary = require("cloudinary").v2;
//const path = require("path");

const app = express();

// Konfigurer Cloudinary med dine API-nøkler
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // api_secret
  secure: true,
});

// Endepunkt for å hente media fra Cloudinary
app.get("/api/uploads", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      prefix: "JOEsandwich/", // Bruk riktig mappe her
      type: "upload",
      resource_type: "video", // Henter både bilder og videoer
      max_results: 100, // Juster antall ressurser
    });
    res.json(result.resources); // Returnerer ressurser som JSON
  } catch (error) {
    console.error("Error fetching Cloudinary resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});


app.get("/api/uploads/newfolder", async (req, res) => {
    try {
      const result = await cloudinary.api.resources({
        prefix: "JOEsmoothie/", // Sett mappenavnet her
        type: "upload",
        resource_type: "video", // Juster til "all" hvis du vil ha både bilder og videoer
        max_results: 100, // Juster etter behov
      });
      res.json(result.resources); // Returnerer dataen som JSON
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });



// Serverer statiske filer fra riktig mappe
app.use(express.static(path.join(__dirname, "../../public")));

// Logg stien for debugging
console.log("Serving static files from:", path.join(__dirname, "../../public"));

// Start serveren
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);