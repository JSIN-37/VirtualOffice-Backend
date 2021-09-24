const apiV = "v1"; // API version

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

// LOGGING
// https://stackoverflow.com/questions/8393636/node-log-in-a-file-instead-of-the-console
var todayEPOCH = new Date()
  .toISOString()
  .replace(
    /^(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T.*$/,
    "$<year>_$<month>_$<day>"
  );
var util = require("util");
var log_file = fs.createWriteStream(`log/${todayEPOCH}.log`, { flags: "a" });
var log_stdout = process.stdout;

console.log = function (d) {
  log_file.write(new Date() + util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};
console.error = console.log;

// Load server settings
if (fs.existsSync("./config/prod")) {
  require("dotenv").config({ path: "./config/prod" });
} else {
  if (fs.existsSync("./config/dev")) {
    require("dotenv").config({ path: "./config/dev" });
  } else {
    console.log(
      "Couldn't find a valid configuration.\nCheck config 'directory' for either 'prod' or 'dev' files?"
    );
    process.exit();
  }
}
const ss = process.env;
ss.INITIAL_SETUP = true;

// Get HTTPS Certs
var key = fs.readFileSync(
  `./cert/${ss.CERTIFICATE_ID}/${ss.CERTIFICATE_ID}.key`
);
var cert = fs.readFileSync(
  `./cert/${ss.CERTIFICATE_ID}/${ss.CERTIFICATE_ID}.crt`
);
var certOptions = {
  key: key,
  cert: cert,
};

// Start MySql connection
const db = mysql.createConnection({
  host: ss.DB_HOST, //mysql database host name
  user: ss.DB_USER, //mysql database user name
  password: ss.DB_PASSWORD, //mysql database password
  database: ss.DB_DATABASE, //mysql database name
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
          ss.INITIAL_SETUP = true; // The initial setup has been done
        } else {
          ss.INITIAL_SETUP = false;
          console.log(
            "VirtualOffice DB requires an initial setup by the administrator."
          );
        }
      }
    }
  );
  // Connect with email service
  transporter = nodemailer.createTransport({
    host: ss.EMAIL_HOST,
    port: ss.EMAIL_PORT,
    auth: {
      user: ss.EMAIL_ADDRESS,
      pass: ss.EMAIL_PASSWORD,
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
server.listen(ss.SERVER_PORT, ss.SERVER_ADDRESS, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log(
    `VirtualOffice Backend is listening at https://${host}:${port}/api/${apiV}`
  );
});

// HTTP support for development in Expo (React Native mobile frontend) - Defined by 'SERVER_HTTP' in config
var httpServer;
if (ss.SERVER_HTTP != null) {
  httpServer = http.createServer(app);
  httpServer.listen(ss.SERVER_HTTP, ss.SERVER_ADDRESS, () => {
    var host = httpServer.address().address;
    var port = httpServer.address().port;
    console.log(
      `[WARNING] HTTP Enabled. Listening at http://${host}:${port}/api/${apiV}`
    );
  });
}

// Swagger configuration - 'SWAGGER_IP' in config
let swaggerIP = ss.SWAGGER_IP ? ss.SWAGGER_IP : ss.SERVER_ADDRESS;
let swServers = [];
swServers.push({
  url: `https://${swaggerIP}:${ss.SERVER_PORT}/api/${apiV}`,
  description: "HTTPS",
});
if (ss.SERVER_HTTP) {
  swServers.push({
    url: `http://${swaggerIP}:${ss.SERVER_HTTP}/api/${apiV}`,
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
console.log(
  `
  -------------------------------------------------------------------------------------
  VirtualOffice Documentation - https://${swaggerIP}:${ss.SERVER_PORT}/api/${apiV}/docs
  -------------------------------------------------------------------------------------
  `
);

// Welcome message for root
app.get(`/api/${apiV}/`, function (req, res) {
  res.json({ success: `You've reached VirtualOffice API ${apiV}.0.` });
});

// Pass down global objects to use in routes
app.db = db;
app.email = transporter; // This is also defined when transporter is configured ^
// global.ss = ss; // Make this global for use with auth

// Routers that need server settings(ss)
const authRouter = require("./routes/auth");
const { stderr } = require("process");

// Load all routes
app.use(`/api/${apiV}/user`, userRouter);
app.use(`/api/${apiV}/admin`, adminRouter);
app.use(`/api/${apiV}/interim`, interimRouter);
app.use(`/api/${apiV}/backdoor`, backdoorRouter);
app.use(`/api/${apiV}/auth`, authRouter);

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
