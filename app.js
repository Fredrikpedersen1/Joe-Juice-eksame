require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cloudinary = require("cloudinary").v2;

const PORT = 3000;

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL
)`);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Middleware to redirect logged-in users
app.use((req, res, next) => {
    const user = req.cookies.user;

    // Redirect logged-in users away from login.html and signup.html
    if (user && (req.path === '/login.html' || req.path === '/signup.html')) {
        return res.redirect('/');
    }

    next();
});

// Routes
app.get('/', (req, res) => {
    const user = req.cookies.user;
    if (!user) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/tutorial.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "tutorial.html"));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'signup.html'));
});

app.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;

    const query = `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, phone, password], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(400).send('Error creating user');
        }
        res.status(200).send('Signup successful');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err || !row) {
            return res.status(401).send('Invalid credentials');
        }
        res.cookie('user', email, { httpOnly: true, path: '/' });

        res.status(200).send('Login successful');
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('user', { path: '/' });
    res.redirect('/login.html');
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});



// CLOUDINARY -----------------------------------------------------------------

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // api_secret
  secure: true,
});


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


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
