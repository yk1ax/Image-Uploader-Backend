const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = "./uploads"
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single("image");
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.send("Response of GET request");
});

app.post('/upload', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
        } else if (err) {
            console.log("An unknown error occurred when uploading: " + err);
        }
        
        res.send("POST request received")
    });
});

app.get('/images/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(__dirname + "/uploads/" + fileName);
});

app.listen(port, () => {
    console.log("App is listening on port " + port);
});