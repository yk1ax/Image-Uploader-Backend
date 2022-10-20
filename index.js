const express = require("express");
const bodyParser = require("body-parser");

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.send("Response of GET request");
});

app.listen(port, (err) => {
    console.log("App is listening on port " + port);
})