const apiVersion = "v1"; // API version
var serverSettings = {};

const fs = require("fs");
const express = require("express");
const app = express();

const https = require("https");
const http = require("http");
var cors = require("cors");

const mysql = require("mysql");
const nodemailer = require("nodemailer");
var transporter;

// Load server settings
if (fs.existsSync("./config/prod.env")) {
  serverSettings = JSON.parse(fs.readFileSync(`./config/prod.json`));
} else {
  serverSettings = JSON.parse(fs.readFileSync(`./config/dev.json`));
}
serverSettings.initialSetup = true;
serverSettings.apiVersion = apiVersion;
const apiV = apiVersion; // For ease of use

// Get HTTPS Certs
var key = fs.readFileSync(
  `./cert/${serverSettings.certID}/${serverSettings.certID}.key`
);
var cert = fs.readFileSync(
  `./cert/${serverSettings.certID}/${serverSettings.certID}.crt`
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

// Check DB and email connection
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
          serverSettings.initialSetup = true; // The initial setup has been done
        } else {
          serverSettings.initialSetup = false;
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
    `VirtualOffice Backend is listening at https://%s:%s/api/${apiV}`,
    host,
    port
  );
});

// HTTP support for development in Expo (React Native mobile frontend) - Defined by 'serverHTTP' in config
var httpServer = http.createServer(app);
if (serverSettings.serverHTTP != null) {
  httpServer.listen(
    serverSettings.serverHTTP,
    serverSettings.serverAddress,
    () => {
      var host = httpServer.address().address;
      var port = httpServer.address().port;
      console.log(
        `[WARNING] HTTP Enabled. Listening at http://%s:%s/api/${apiV}`,
        host,
        port
      );
    }
  );
}

// Welcome message for root
app.get(`/api/${apiV}/`, function (req, res) {
  res.json({ success: "You've reached VirtualOffice API v1.0." });
});

// Download certificate for secure communication
app.get(`/api/${apiV}/get-cert`, function (req, res) {
  res.download("cert/TinyCA/TinyCA.pem", "vo_cert.pem");
});

// User routes
require("./routes/user")(serverSettings, app, db, transporter);

// Admin routes
require("./routes/admin")(serverSettings, app, db, transporter);

// For INTERIMS ONLY
app.get(`/api/${apiV}/interim/todos`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/todoData.json");
  let data = JSON.parse(rawdata).todos;
  res.json(data);
});
app.get(`/api/${apiV}/interim/doing`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/doingData.json");
  let data = JSON.parse(rawdata).doing;
  res.json(data);
});
app.get(`/api/${apiV}/interim/teams`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/teamData.json");
  let data = JSON.parse(rawdata).teams;
  res.json(data);
});
app.delete(`/api/${apiV}/interim/teams/:id`, (req, res) => {
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
app.get(`/api/${apiV}/interim/emps`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/divEmpData.json");
  let data = JSON.parse(rawdata).emps;
  res.json(data);
});

// Global catch all for everything else
const notFoundErr = (res) => {
  res
    .status(404)
    .json({ error: "VirtualOffice Backend did not understand that request." });
};
app.get("*", function (req, res) {
  notFoundErr(res);
});
app.post("*", function (req, res) {
  notFoundErr(res);
});
app.put("*", function (req, res) {
  notFoundErr(res);
});
app.patch("*", function (req, res) {
  notFoundErr(res);
});
app.delete("*", function (req, res) {
  notFoundErr(res);
});
