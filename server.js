const apiVersion = "v1";
var serverSettings = {};
var InitialSetup = true;

const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
var cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var transporter;

// Load server settings
if (fs.existsSync("./config/prod.env")) {
  serverSettings = JSON.parse(fs.readFileSync(`./config/prod.json`));
} else {
  serverSettings = JSON.parse(fs.readFileSync(`./config/dev.json`));
}

// Get HTTPS Certs
var key = fs.readFileSync(
  `./cert/${serverSettings.serverAddress}/${serverSettings.serverAddress}.key`
);
var cert = fs.readFileSync(
  `./cert/${serverSettings.serverAddress}/${serverSettings.serverAddress}.crt`
);
var options = {
  key: key,
  cert: cert,
};

// Start MySql connection
const db = mysql.createConnection({
  host: serverSettings.DBHost, //mysql database host name
  user: serverSettings.DBUser, //mysql database user name
  password: serverSettings.DBPassword, //mysql database password
  database: serverSettings.DBDatabase, //mysql database name
});

db.connect(function (err) {
  if (err) {
    console.log(
      "Error connecting to VirtualOffice database. Maybe MySQL isn't running?"
    );
    // throw err;
    process.exit();
  }
  console.log("Connected with VirtualOffice database.");
  // Check if VO DB needs initial setup
  db.query(
    `SELECT vo_value FROM vo_settings WHERE vo_option = "org_setup"`,
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        if (results[0].vo_value == "done") {
          // Load all the related variables for API services
          InitialSetup = true; // The initial setup has been done
        } else {
          InitialSetup = false;
          console.log(
            "VirtualOffice DB requires an initial setup by the administrator."
          );
        }
      }
    }
  );
  // Connect with email service
  transporter = nodemailer.createTransport({
    host: serverSettings.emailHost,
    port: serverSettings.emailPort,
    auth: {
      user: serverSettings.emailAddress,
      pass: serverSettings.emailPassword,
    },
  });
  console.log("Connected with VirtualOffice email.");
});

app.use(express.json()); // to support JSON-encoded bodies
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());

var server = https.createServer(options, app);
server.listen(serverSettings.serverPort, serverSettings.serverAddress, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log(
    "VirtualOffice Backend is listening at https://%s:%s",
    host,
    port
  );
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
  // TODO: Check for validation
  // Check if user with email and password exist
  db.query(
    "SELECT id, first_name, last_name FROM user WHERE email = ? AND password = ?",
    [email, hashedPassword],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        // Indicate frontend that an initial setup is required
        if (!InitialSetup) {
          res.json({
            error:
              "VirtualOffice database is not setup yet. Contact administrator.",
          });
        }
        // Adding in hours to the current avail.
        Date.prototype.addHours = function (h) {
          this.setHours(this.getHours() + h);
          return this;
        };
        const expire = new Date().addHours(keepLogged ? 48 : 12); // Logged in for 12/48 hours
        const user = {
          id: results[0].id,
          email: results[0].email,
          first_name: results[0].first_name,
          last_name: results[0].last_name,
          expire: expire,
        };
        jwt.sign({ user: user }, serverSettings.jwtKey, (err, token) => {
          res.json({ token }); // Just send back the token
        });
      } else {
        res.json({ error: "Login failed." });
      }
    }
  );
  return;
});
// Get data about user
app.get(`/api/${apiVersion}/whoami`, verifyUser, (req, res) => {
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
// Logout
app.post(`/api/${apiVersion}/logout`, verifyUser, (req, res) => {
  res.json(req.authData);
});

// Initial setting up
app.post(`/api/${apiVersion}/initial-setup`, function (req, res) {
  res.end("initial user set up");
});

// This can be used to verify login status
function verifyUser(req, res, next) {
  const badToken = () => {
    res.status(403).json({
      error: "You are not authenticated.",
    });
  };
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, serverSettings.jwtKey, (err, authData) => {
      if (err) {
        // Token is bad
        badToken();
      } else {
        // Token is good
        if (dateNow < new Date(req.authData.expire)) {
          req.authData = authData; // Store authData
          next();
        } else {
          badToken();
        }
      }
    });
    next();
  } else {
    badToken();
  }
}
function verifyAdmin(req, res, next) {
  const badToken = () => {
    res.status(403).json({
      error: "You are not authenticated.",
    });
  };
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, serverSettings.jwtKey, (err, authData) => {
      if (err) {
        // Token is bad
        badToken();
      } else {
        // Token is good, check if it is admin
        const dateNow = new Date();
        if (authData.isAdmin && dateNow < new Date(authData.expire)) {
          req.authData = authData; // Store authData
          next();
        } else {
          badToken();
        }
      }
    });
  } else {
    badToken();
  }
}

function sendMail(recipients, subject, body) {
  transporter
    .sendMail({
      from: '"VirtualOffice" <virtualoffice@jsin37.com>', // sender address
      to: recipients, // list of receivers
      subject: subject, // Subject line
      // text: "This is a summary", // plain text body
      html: body, // html body
    })
    .then((info) => {
      // console.log({ info });
      console.log(`VirtualOffice sent an email to ${recipients}`);
    })
    .catch(console.error);
}

// Admin routes
// https://www.restapitutorial.com/lessons/httpmethods.html

// Admin login
app.post(`/api/${apiVersion}/admin/login`, (req, res) => {
  const password = req.body.password;
  // Hash the password
  const crypto = require("crypto");
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  // Check if user with email and password exist
  db.query(
    "SELECT vo_value FROM vo_settings WHERE vo_option = 'admin_password'",
    [hashedPassword],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        console.log("System administrator just logged in.");
        let initialSetup = false;
        // Indicate frontend that an initial setup is required
        if (!InitialSetup) {
          initialSetup = true; // Needs an initial setup
        } else {
          initialSetup = false;
        }
        // Adding in hours to the current avail.
        Date.prototype.addHours = function (h) {
          this.setHours(this.getHours() + h);
          return this;
        };
        const expire = new Date().addHours(1); // Logged in for 2 hours
        jwt.sign(
          { expire: expire, isAdmin: true },
          serverSettings.jwtKey,
          (err, token) => {
            res.json({ token, initialSetup }); // Send back the token, expire etc.
          }
        );
      } else {
        res.json({ error: "Admin login failed." });
      }
    }
  );
});

app.post(
  `/api/${apiVersion}/admin/initial-setup`,
  verifyUser,
  function (req, res) {
    // Get organization name and all VO settings
    const org_setup = "done";
    const org_name = req.body.org_name;
    const org_country = req.body.org_country;
    const updateVOSetting = (vo_option, vo_value) => {
      db.query(
        `UPDATE vo_settings SET vo_value = ? WHERE vo_option='${vo_option}'`,
        [vo_value],
        (error) => {
          if (error) throw error;
          res.json({ error: "VO Settings update failed." });
        }
      );
    };
    updateVOSetting("org_setup", org_setup);
    updateVOSetting("org_name", org_name);
    updateVOSetting("org_country", org_country);
    res.json({ success: "VO Settings updated." });
    InitialSetup = 1;
  }
);
// Get all existing users
app.get(`/api/${apiVersion}/admin/users`, verifyAdmin, function (req, res) {
  db.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});
app.post(`/api/${apiVersion}/admin/user`, function (req, res) {
  const first_name = req.body.first_name;
  const email = req.body.email;
  const password = Math.random().toString(36).slice(-8);
  // Hash the password
  const crypto = require("crypto");
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  db.query("INSERT INTO user(first_name, email, password) VALUES(?, ?, ?)", [
    first_name,
    email,
    hashedPassword,
  ]);
  sendMail(
    email,
    "VirtualOffice Account Registration",
    `<center>
    <b>Please click the link below to login to your VirtualOffice account,</b><br>
    <a href=${serverSettings.frontendURL}>Login to VirtualOffice</a> <br><br>
    Username: ${email} <br>
    Password: ${password} <br>
    </center>`
  );
  res.json({ success: "User added!" });
});
app.delete(
  `/api/${apiVersion}/admin/user/:id`,
  verifyAdmin,
  function (req, res) {
    const id = req.params.id;
    db.query(
      "DELETE FROM user WHERE id=?",
      [id],
      function (error, results, fields) {
        if (error) throw error;
        console.log(id);
        res.json({ success: "User was deleted from the database." });
      }
    );
  }
);

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
        host: serverSettings.DBHost,
        user: serverSettings.DBUser,
        password: serverSettings.DBPassword,
        database: serverSettings.DBDatabase,
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

// For INTERIMS ONLY
app.get(`/api/${apiVersion}/interim/todos`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/todoData.json");
  let data = JSON.parse(rawdata).todos;
  res.json(data);
});
app.get(`/api/${apiVersion}/interim/doing`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/doingData.json");
  let data = JSON.parse(rawdata).doing;
  res.json(data);
});
app.get(`/api/${apiVersion}/interim/teams`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/teamData.json");
  let data = JSON.parse(rawdata).teams;
  res.json(data);
});
app.delete(`/api/${apiVersion}/interim/teams/:id`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/teamData.json");
  let data = JSON.parse(rawdata).teams;
  var filtered = data.filter((a) => a.id != req.params.id);
  fs.writeFileSync(
    "./interim/teamData.json",
    JSON.stringify({ teams: filtered }),
    "utf8"
  );
  res.json(filtered);
});
app.get(`/api/${apiVersion}/interim/emps`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/divEmpData.json");
  let data = JSON.parse(rawdata).emps;
  res.json(data);
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
