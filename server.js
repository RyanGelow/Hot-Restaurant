// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const mysql = require("mysql2/promise");

// Sets up the Express App
// =============================================================
var app = express();

// so it will work in heroku
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reservation Data
// =============================================================
var Reservations = [];

var StartConnection = async function(reservationName, phoneNumber, callback) {
    const connection = await mysql.createConnection({
        host: "localhost",

        // Your port; if not 3306
        port: 3306,

        // Your username
        user: "root",

        // Your password
        password: "password",
        database: "restaurant_db"
    });

    return callback(connection, reservationName, phoneNumber);
}

const query = async function(con, tableName) {
    try {
        return con.query(`SELECT * FROM tables`);

    } catch (err) {
        throw err;
    }
}

const postToSql = async function(con, name, phoneNumber) {
    console.log(name);
    console.log(phoneNumber);
    try {
        const response = await con.query("INSERT INTO tables (reservationName, phoneNumber) VALUES (?, ?);", [name, phoneNumber]);
        // posts in to sql
        // console.log(response[0])
    } catch (err) {
        throw err;
    }
}


// to search for your table

// enter your name
// unique id?
// pulls the rest


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
    res.sendFile(path.join(__dirname, "view.html"));
});

// Displays all reservations
app.get("/api/reservations", async function(req, res) {

    if (Reservations.length == 0) {
        // GET method data before continuing
        const response = await StartConnection("", "", query);

        for (key in response[0]) {
            Reservations.push(AddTable(response[0][key]['id'], response[0][key]['reservationName'], response[0][key]["phoneNumber"]))
                // console.log(JSON.stringify(response[0]['reservationName']));
        }
    }
     console.log(Reservations);
    return res.json(Reservations);

});

// Displays a single reservation, or returns false
app.get("/api/reservations/:name", function(req, res) {
    var chosen = req.params.name;

    // console.log(chosen);

    for (var i = 0; i < Reservations.length; i++) {
        if (chosen === Reservations[i].routeName) {
            return res.json(Reservations[i]);
        }
    }

    return res.json(false);
});
//table constr
const AddTable = function(table=Reservations.length+1, name, phoneNumber) {
        tableRes = {
            id: table,
            name: name,
            phoneNumber: phoneNumber,
            uniqueID: Reservations.length
                // auto generates a unique id per the reservations length
        }
    //}
    console.log(tableRes)
    return tableRes;
    // returns above obj 

}


// Create New Reservations - takes in JSON input
app.post("/api/reservations", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newReservation = req.body;
    console.log(JSON.stringify(newReservation));
    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newReservation.routeName = newReservation.name.replace(/\s+/g, "").toLowerCase();

    console.log(newReservation);

    Reservations.push(AddTable(newReservation.table, newReservation.name, newReservation.phoneNumber));
    StartConnection(newReservation.name, newReservation.phoneNumber, postToSql)
        // runs post to sql when connection is made
        // if (Reservations.length >= 5) {
        //     waitingList.push(newReservation);
        // } else {
        //     Reservations.push(newReservation);
        // }

    res.json(newReservation);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});