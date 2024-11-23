const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
  
app.get("/tutorial.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "tutorial.html"));
  });

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "signup.html"));
  });

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "login.html"));
  } );

app.get("/res", (req, res) => {
  res.send("Response message from server");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});