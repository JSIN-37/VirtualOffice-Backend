const apiV = "v1"; // API version
var serverSettings = {};
// Essentials
const fs = require("fs");
const express = require("express");
// HTTPS, HTTP and CORS
const https = require("https");
const http = require("http");
var cors = require("cors");
// DB and Email
const mysql = require("mysql");
const nodemailer = require("nodemailer");
var transporter;
// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
// Routes
const backdoorRouter = require("./routes/backdoor");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const interimRouter = require("./routes/interim");

// Load server settings
if (fs.existsSync("./config/prod.env")) {
  serverSettings = JSON.parse(fs.readFileSync(`./config/prod.json`));
} else {
  serverSettings = JSON.parse(fs.readFileSync(`./config/dev.json`));
}
serverSettings.initialSetup = true;

// Get HTTPS Certs
var key = fs.readFileSync(
  `./cert/${serverSettings.certID}/${serverSettings.certID}.key`
);
var cert = fs.readFileSync(
  `./cert/${serverSettings.certID}/${serverSettings.certID}.crt`
);
var certOptions = {
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
  app.email = transporter;
  console.log("Connected with VirtualOffice email.");
});

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());

var server = https.createServer(certOptions, app);
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
var httpServer;
if (serverSettings.serverHTTP != null) {
  httpServer = http.createServer(app);
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

// Swagger configuration
let swServers = [];
swServers.push({
  url: `https://${serverSettings.serverAddress}:${serverSettings.serverPort}/api/${apiV}`,
  description: "HTTPS",
});
if (serverSettings.serverHTTP) {
  swServers.push({
    url: `http://${serverSettings.serverAddress}:${serverSettings.serverHTTP}/api/${apiV}`,
    description: "HTTP",
  });
}
const swOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VirtualOffice API",
      version: `${apiV.charAt(1)}.0.0`,
      description: "Backend of VirtualOffice Software Suite",
    },
    servers: swServers,
  },
  apis: ["./routes/*.js"],
};

const swSpecs = swaggerJSDoc(swOptions);
app.use(`/api/${apiV}/docs`, swaggerUI.serve, swaggerUI.setup(swSpecs));

// Welcome message for root
app.get(`/api/${apiV}/`, function (req, res) {
  res.json({ success: `You've reached VirtualOffice API ${apiV}.0.` });
});

// Pass down global objects to use in routes
app.db = db;
app.email = transporter; // This is also defined when transporter is configured ^
app.ss = serverSettings;

// Load all routes
app.use(`/api/${apiV}/user`, userRouter);
app.use(`/api/${apiV}/admin`, adminRouter);
app.use(`/api/${apiV}/interim`, interimRouter);
app.use(`/api/${apiV}/backdoor`, backdoorRouter);

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
