
const express = require("express");
const cloudinary = require("cloudinary").v2;
const path = require("path");

const app = express();

// Konfigurer Cloudinary med dine API-nøkler
cloudinary.config({
  cloud_name: "dzdqa29e2", // cloud_name
  api_key: "742529828128419", // api_key
  api_secret: "3PkOoQ4WOwO9LoPkI2DxDAhqJXQ", // api_secret
  secure: true,
});

// Endepunkt for å hente media fra Cloudinary
app.get("/api/uploads", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      prefix: "cdn-example/", // Bruk riktig mappe her
      type: "upload",
      resource_type: "image", // Henter både bilder og videoer
      max_results: 100, // Juster antall ressurser
    });
    res.json(result.resources); // Returnerer ressurser som JSON
  } catch (error) {
    console.error("Error fetching Cloudinary resources:", error);
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

