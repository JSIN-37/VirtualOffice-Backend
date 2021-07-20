// Admin routes
// https://www.restapitutorial.com/lessons/httpmethods.html

module.exports = (serverSettings, app, db, email) => {
  const jwt = require("jsonwebtoken");
  const apiV = serverSettings.apiVersion;

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
    email
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
  // Admin login
  app.post(`/api/${apiV}/admin/login`, (req, res) => {
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
          // Adding in hours to the current avail.
          Date.prototype.addHours = function (h) {
            this.setHours(this.getHours() + h);
            return this;
          };
          serverSettings.initialSetup = false;
          const expire = new Date().addHours(1); // Logged in for 2 hours
          jwt.sign(
            { expire: expire, isAdmin: true },
            serverSettings.jwtKey,
            (err, token) => {
              res.json({ token, initialSetup: serverSettings.initialSetup }); // Send back the token, expire etc.
            }
          );
        } else {
          res.json({ error: "Admin login failed." });
        }
      }
    );
  });

  app.post(
    `/api/${apiV}/admin/initial-setup`,
    verifyAdmin,
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
      serverSettings.initialSetup = true;
    }
  );
  // Get all existing users
  app.get(`/api/${apiV}/admin/users`, verifyAdmin, function (req, res) {
    db.query("SELECT * FROM vo_user", function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    });
  });
  app.post(`/api/${apiV}/admin/user`, function (req, res) {
    const first_name = req.body.first_name;
    const email = req.body.email;
    const password = Math.random().toString(36).slice(-8);
    // Hash the password
    const crypto = require("crypto");
    const hashedPassword = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");
    db.query(
      "INSERT INTO vo_user(first_name, email, password) VALUES(?, ?, ?)",
      [first_name, email, hashedPassword]
    );
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
  app.delete(`/api/${apiV}/admin/user/:id`, verifyAdmin, function (req, res) {
    const id = req.params.id;
    db.query(
      "DELETE FROM vo_user WHERE id=?",
      [id],
      function (error, results, fields) {
        if (error) throw error;
        console.log(id);
        res.json({ success: "User was deleted from the database." });
      }
    );
  });

  // Helpful to update the backend on-the-fly
  app.get(`/api/${apiV}/admin/backend-update`, (req, res) => {
    const { exec } = require("child_process");
    exec("git pull", (err, stdout, stderr) => {
      if (err) {
        res.json({ error: "Couldn't update backend." });
        return;
      } else {
        res.json({ success: `${stdout}` });
        process.exit(1);
      }
    });
  });

  // Helpful to reset entire thing to start from scratch
  app.get(`/api/${apiV}/admin/backend-resetdb`, async function (req, res) {
    console.log("Resetting database...");
    const Importer = require("mysql-import");
    const importer = new Importer({
      host: serverSettings.DBHost,
      user: serverSettings.DBUser,
      password: serverSettings.DBPassword,
      database: serverSettings.DBDatabase,
    });

    importer.onProgress((progress) => {
      var percent =
        Math.floor((progress.bytes_processed / progress.total_bytes) * 10000) /
        100;
      console.log(`Loading SQL file ${percent}% completed.`);
    });

    importer
      .import("./db/deleteDB.sql")
      .then(() => {
        console.log(`Deleted entire database.`);
        importer
          .import("./db/mainDB.sql")
          .then(() => {
            console.log(`MainDB restored.`);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
    res.json({ success: "VirtualOffice database reset complete." });
  });
};
