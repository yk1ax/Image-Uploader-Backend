const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {

    const allowedOrigins = ['http://localhost:3000', 'https://yk-image-uploader.herokuapp.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    return next();
});

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

app.get("/", (req, res) => {
    res.send("Response of GET request");
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
        } else if (err) {
            console.log("An unknown error occurred when uploading: " + err);
        }
        
        console.log("Image upload received");
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