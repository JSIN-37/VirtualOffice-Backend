const serverAddress = "localhost";
const serverPort = 3030;

const DBHost = "localhost";
const DBUser = "VO";
const DBPassword = "123";
const DBDatabase = "VO";
var DBInitialSetup = 0;

const jwtKey = "keykeykey";
const apiVersion = "v1";

const express = require("express");
var cors = require("cors");
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
  if (err) {
    console.log(
      "Error connecting to VirtualOffice DB. Maybe MySQL isn't running?"
    );
    // throw err;
    process.exit();
  }
  console.log("Connected with VirtualOffice DB.");
  // Check if VO DB needs initial setup
  db.query(
    "SELECT value FROM vo_settings WHERE option = 'org_setup'",
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        if (results[0].value == "done") {
          DBInitialSetup = 1; // The initial setup has been done
        } else {
          DBInitialSetup = 0;
          console.log(
            "VirtualOffice DB requires an initial setup by the administrator."
          );
        }
      }
    }
  );
});

app.use(express.json()); // to support JSON-encoded bodies
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());

var server = app.listen(serverPort, serverAddress, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("VirtualOffice Backend is listening at http://%s:%s", host, port);
});

// Welcome message for root
app.get(`/api/${apiVersion}/`, function (req, res) {
  res.json({ success: "You've reached VirtualOffice API." });
});

// General
// Get all users
app.get(`/api/${apiVersion}/user`, function (req, res) {
  db.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
// Login
app.post(`/api/${apiVersion}/login`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const keepLogged = req.body.keepLogged; // Increase expire time if this is enabled
  // Hash the password
  const crypto = require("crypto");
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  // TO DO: Check for validation
  // Check if user with email and password exist
  db.query(
    "SELECT id, first_name, last_name FROM user WHERE email = ? AND password = ?",
    [email, hashedPassword],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        let info;
        // Indicate frontend that an initial setup is required
        if (!DBInitialSetup) {
          // First check if this is the admin
          // Admin user id is 0
          if (results[0].id == "0") {
            // console.log(
            //   `Admin user logged in @ ${new Date().toLocaleString()}`
            // );
            info = { initialSetup: true };
          } else {
            res.json({
              error:
                "VirtualOffice DB is not setup yet. Contact administrator.",
            });
          }
        }
        const user = {
          id: results[0].id,
          email: results[0].email,
          first_name: results[0].first_name,
          last_name: results[0].last_name,
          expire: 7200, // Logged in for 2 hours
        };
        jwt.sign({ user: user }, jwtKey, (err, token) => {
          res.json({ token, info }); // Just send back the token
        });
      } else {
        res.json({ error: "Login failed." });
      }
    }
  );
  return;
});
// Logout
app.post(`/api/${apiVersion}/logout`, verifyJWT, (req, res) => {
  res.json(req.authData);
});
// Initial setting up
app.post(`/api/${apiVersion}/initial-setup`, function (req, res) {
  res.end("initial user set up");
});

// This can be used to verify login status
function verifyJWT(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    // req.token = bearerToken;
    jwt.verify(bearerToken, jwtKey, (err, authData) => {
      if (err) {
        // Token is bad
        res.status(403).json({
          error: "You are not authenticated.",
        });
      } else {
        // Token is good
        req.authData = authData; // Store authData
      }
    });
    next();
  } else {
    res.status(403).json({
      error: "You are not authenticated.",
    });
  }
}

// Admin routes
// https://www.restapitutorial.com/lessons/httpmethods.html

app.post(
  `/api/${apiVersion}/admin/initial-setup`,
  verifyJWT,
  function (req, res) {
    res.end("initial setting up");
  }
);
// Get all existing users
app.get(`/api/${apiVersion}/admin/users`, verifyJWT, function (req, res) {
  // First check if the logged in user is an admin
  if (req.authData.user.id != "0") {
    res.status(403).json({
      error: "You are not authorized to access this resource.",
    });
  }
  db.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});
app.post(`/api/${apiVersion}/admin/user`, function (req, res) {
  res.end("Add new user, email+name");
});
app.delete(`/api/${apiVersion}/admin/user/:id`, function (req, res) {
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

// Helpful to reset entire thing to start from scratch
app.get(`/api/${apiVersion}/admin/reset-db`, async function (req, res) {
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
