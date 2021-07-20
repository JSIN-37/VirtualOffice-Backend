// User routes
// https://www.restapitutorial.com/lessons/httpmethods.html

module.exports = (serverSettings, app, db, email) => {
  const jwt = require("jsonwebtoken");
  const apiV = serverSettings.apiVersion;

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
          const dateNow = new Date();
          if (dateNow < new Date(authData.expire)) {
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

  app.post(`/api/${apiV}/login`, (req, res) => {
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
      "SELECT id, first_name, last_name FROM vo_user WHERE email = ? AND password = ?",
      [email, hashedPassword],
      (error, results, fields) => {
        if (error) throw error;
        if (results.length) {
          // Indicate frontend that an initial setup is required
          if (!serverSettings.initialSetup) {
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
          };
          jwt.sign(
            { user: user, expire: expire },
            serverSettings.jwtKey,
            (err, token) => {
              console.log(expire);
              res.json({ token }); // Just send back the token
            }
          );
        } else {
          res.json({ error: "Login failed." });
        }
      }
    );
    return;
  });

  // Get data about user
  app.get(`/api/${apiV}/whoami`, verifyUser, (req, res) => {
    const userID = req.authData.user.id;
    db.query(
      "SELECT id, first_name, last_name FROM vo_user WHERE id = ?",
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
  app.post(`/api/${apiV}/logout`, verifyUser, (req, res) => {
    res.json(req.authData);
  });

  // Initial setting up
  app.post(`/api/${apiV}/initial-setup`, function (req, res) {
    res.end("initial user set up");
  });
};
