// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
// so it will work in heroku

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reservation Data
// =============================================================
var Reservations = [{
    table: "",
    name: "test",
    phoneNumber: 911,
    uniqueID: 900,
}];

var waitingList = [];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/add", function(req, res) {
    res.sendFile(path.join(__dirname, "add.html"));
});

app.get("/reservation", function(req, res) {
    res.sendFile(path.join(__dirname, "display.html"));
});

// Displays all reservations
app.get("/api/reservations", function(req, res) {
    return res.json(Reservations);
});

// Displays a single reservation, or returns false
app.get("/api/reservations/:name", function(req, res) {
    var chosen = req.params.name;

    console.log(chosen);

    for (var i = 0; i < Reservations.length; i++) {
        if (chosen === Reservations[i].routeName) {
            return res.json(Reservations[i]);
        }
    }

    return res.json(false);
});

// Create New Reservations - takes in JSON input
app.post("/api/reservations", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newReservation = req.body;

    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newReservation.routeName = newReservation.name.replace(/\s+/g, "").toLowerCase();

    console.log(newReservation);

    Reservations.push(newReservation);

    if (Reservations.length >= 5) {
        waitingList.push(newReservation);
    }

    res.json(newReservation);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});