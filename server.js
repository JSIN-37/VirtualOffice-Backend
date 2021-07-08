const serverAddress = "localhost";
const serverPort = 3000;

const DBHost = "localhost";
const DBUser = "VO";
const DBPassword = "123";
const DBDatabase = "VO";

const express = require("express");
const app = express();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

//start mysql connection
const db = mysql.createConnection({
  host: DBHost, //mysql database host name
  user: DBUser, //mysql database user name
  password: DBPassword, //mysql database password
  database: DBDatabase, //mysql database name
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected with VirtualOffice DB.");
});

app.use(express.json()); // to support JSON-encoded bodies
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

var server = app.listen(serverPort, serverAddress, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("VirtualOffice Backend is listening at http://%s:%s", host, port);
});

// Welcome message for root
app.get("/api/", function (req, res) {
  res.json({ success: "You've reached VirtualOffice API." });
});

// General
// Get all users
app.get("/api/user", function (req, res) {
  db.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
// Login
app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    email: req.body.email,
    expireTime: 1000,
  };
  jwt.sign({ user: user }, "secretkey", (err, token) => {
    res.json({ token });
  });
});
// Logout
app.post("/api/logout", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        success: "Logged out",
        authData,
      });
    }
  });
});
// Initial setting up
app.post("/initial-setup", function (req, res) {
  res.end("initial setting up");
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

// Admin routes
// https://www.restapitutorial.com/lessons/httpmethods.html

app.put("/api/admin/initial-setup", function (req, res) {
  res.end("initial setting up");
});
// Get all existing users
app.get("/api/admin/user", function (req, res) {
  db.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});
app.post("/api/admin/user", function (req, res) {
  res.end("Add new user, email+name");
});
app.delete("/api/admin/user/:id", function (req, res) {
  db.query(
    "DELETE FROM user WHERE id=?",
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      res.json({ success: "User was deleted from the database." });
    }
  );
  res.end("Remove user");
});

// Helpful to rest entire thing to start from scratch
app.get("/api/admin/reset-db", async function (req, res) {
  console.log("Resetting database...");
  db.query(
    `SELECT CONCAT('DROP TABLE IF EXISTS ${"`"}', table_name, '${"`"};')
    AS stm FROM information_schema.tables
    WHERE table_schema = 'VO';`,
    function (error, results, fields) {
      if (error) throw error;
      console.log("Received list of DROP TABLE statements...");
      for (var row of results) {
        db.query(row.stm);
      }
      console.log("Dropped all tables.");
      const Importer = require("mysql-import");
      const importer = new Importer({
        host: DBHost,
        user: DBUser,
        password: DBPassword,
        database: DBDatabase,
      });

      importer.onProgress((progress) => {
        var percent =
          Math.floor(
            (progress.bytes_processed / progress.total_bytes) * 10000
          ) / 100;
        console.log(`Database reset ${percent}% completed...`);
      });

      importer
        .import("./db/mainDB.sql")
        .then(() => {
          var files_imported = importer.getImported();
          console.log(`${files_imported.length} SQL file(s) imported.`);
        })
        .catch((err) => {
          console.error(err);
        });
      res.json({ success: "VirtualOffice database reset complete." });
    }
  );
});

// Global catch all for everything else
app.get("*", function (req, res) {
  res
    .status(404)
    .json({ error: "VirtualOffice Backend did not understand that request." });
});
app.post("*", function (req, res) {
  res
    .status(404)
    .json({ error: "VirtualOffice Backend did not understand that request." });
});
app.put("*", function (req, res) {
  res
    .status(404)
    .json({ error: "VirtualOffice Backend did not understand that request." });
});
app.patch("*", function (req, res) {
  res
    .status(404)
    .json({ error: "VirtualOffice Backend did not understand that request." });
});
app.delete("*", function (req, res) {
  res
    .status(404)
    .json({ error: "VirtualOffice Backend did not understand that request." });
});
