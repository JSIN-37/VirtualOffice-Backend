const serverAddress = "localhost";
const serverPort = 3030;
const frontendURL = "localhost:3000";

const DBHost = "localhost";
const DBUser = "VO";
const DBPassword = "123";
const DBDatabase = "VO";
var DBInitialSetup = 0;
const adminID = 1;

var emailHost = "smtp.gmail.com";
var emailPort = "587";
var emailAddress = "";
var emailPassword = "";

const jwtKey = "keykeykey";
const apiVersion = "v1";

const express = require("express");
var cors = require("cors");
const app = express();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var transporter;

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
  console.log("Connected with VirtualOffice database.");
  // Check if VO DB needs initial setup
  db.query(
    "SELECT value FROM vo_settings WHERE option = 'org_setup'",
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        if (results[0].value == "done") {
          // Grab all the email settings
          db.query(
            "SELECT value FROM vo_settings WHERE option IN ('email_host','email_port','email_address','email_password')",
            (error, results, fields) => {
              if (error) throw error;
              emailHost = results[0].value;
              emailPort = results[1].value;
              emailAddress = results[2].value;
              emailPassword = results[3].value;
              transporter = nodemailer.createTransport({
                host: emailHost,
                port: emailPort,
                auth: {
                  user: emailAddress,
                  pass: emailPassword,
                },
              });
              console.log("Connected with VirtualOffice email.");
            }
          );

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
  res.json({ success: "You've reached VirtualOffice API v1.0." });
});

// General
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
          if (results[0].id == adminID) {
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
// Get data about user
app.get(`/api/${apiVersion}/whoami`, verifyJWT, (req, res) => {
  const userID = req.authData.user.id;
  db.query(
    "SELECT id, first_name, last_name FROM user WHERE id = ?",
    [userID],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        res.json(results[0]);
      } else {
        res.json({ error: "You have been deleted lmao." });
      }
    }
  );
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

function sendMail(recipients, subject, body) {
  transporter
    .sendMail({
      from: '"VirtualOffice" <virtualoffice@jsin37.com>', // sender address
      to: recipients, // list of receivers
      subject: subject, // Subject line
      // text: "There is a new article. It's about sending emails, check it out!", // plain text body
      html: body, // html body
    })
    .then((info) => {
      // console.log({ info });
      console.log("VirtualOffice sent an email.");
    })
    .catch(console.error);
}

// Admin routes
// https://www.restapitutorial.com/lessons/httpmethods.html

app.post(
  `/api/${apiVersion}/admin/initial-setup`,
  verifyJWT,
  function (req, res) {
    // Get organization name and all VO settings
    const org_setup = "done";
    const org_name = req.body.org_name;
    const org_country = req.body.org_country;
    const email_host = req.body.email_host;
    const email_port = req.body.email_port;
    const email_address = req.body.email_address;
    const email_password = req.body.email_password;
    db.query("UPDATE vo_settings SET value = ? WHERE option='org_setup'", [
      org_setup,
    ]);
    db.query("UPDATE vo_settings SET value = ? WHERE option='org_name'", [
      org_name,
    ]);
    db.query("UPDATE vo_settings SET value = ? WHERE option='org_country'", [
      org_country,
    ]);
    db.query("UPDATE vo_settings SET value = ? WHERE option='email_host'", [
      email_host,
    ]);
    db.query("UPDATE vo_settings SET value = ? WHERE option='email_port'", [
      email_port,
    ]);
    db.query("UPDATE vo_settings SET value = ? WHERE option='email_address'", [
      email_address,
    ]);
    db.query("UPDATE vo_settings SET value = ? WHERE option='email_password'", [
      email_password,
    ]);
    res.json({ success: "VO Settings updated." });
    DBInitialSetup = 1;
  }
);
// Get all existing users
app.get(`/api/${apiVersion}/admin/users`, verifyJWT, function (req, res) {
  // First check if the logged in user is an admin
  if (req.authData.user.id != adminID) {
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
  const first_name = req.body.first_name;
  const email = req.body.email;
  const password = Math.random().toString(36).slice(-8);
  db.query("INSERT INTO user(first_name, email, password) VALUES(?, ?, ?)", [
    first_name,
    email,
    password,
  ]);
  sendMail(
    email,
    "VirtualOffice Account Registration",
    `<center>
    <b>Please click the link below to login to your VirtualOffice account,</b><br>
    <a href=${frontendURL}>Login to VirtualOffice</a> <br><br>
    Username: ${email} <br>
    Password: ${password} <br>
    </center>`
  );
  res.json({ success: "User added!" });
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
