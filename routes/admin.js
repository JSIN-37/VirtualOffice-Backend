// Admin routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

///////////////////////////////////////////////// Common functions
function verifyAdmin(req, res, next) {
  const badToken = () => {
    res.status(403).json({
      error: "You are not authenticated.",
    });
  };
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, req.app.ss.jwtKey, (err, authData) => {
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
function sendMail(email, recipients, subject, body) {
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
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /admin/login:
 *  post:
 *    summary: System administrator login
 *    tags: [Admin]
 *    requestBody:
 *       description: Plain administrator password
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                  example: Admin@123
 *    responses:
 *      200:
 *        description: Authorization successful.
 *        produces:
 *          - application/json
 *        schema:
 *          type: object
 *          properties:
 *            token :
 *               type: string
 *            initialSetup:
 *               type: boolean
 *      401:
 *        description: Authorization failed.
 */
router.post(`/login`, (req, res) => {
  const password = req.body.password;
  // Hash the password
  const crypto = require("crypto");
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  // Check if user with email and password exist
  req.app.db.query(
    "SELECT vo_value FROM vo_settings WHERE vo_option = 'admin_password'",
    [hashedPassword],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        // Check if the password matches!
        if (results[0].vo_value == hashedPassword) {
          console.log("System administrator just logged in.");
          // Adding in hours to the current avail.
          Date.prototype.addHours = function (h) {
            this.setHours(this.getHours() + h);
            return this;
          };
          const expire = new Date().addHours(1); // Logged in for 2 hours
          jwt.sign(
            { expire: expire, isAdmin: true },
            req.app.ss.jwtKey,
            (err, token) => {
              res.json({ token, initialSetup: req.app.ss.initialSetup }); // Send back the token, expire etc.
            }
          );
        } else {
          res.status(401).json({ error: "Admin login failed." });
        }
      } else {
        res.status(401).json({ error: "Admin login failed." });
      }
    }
  );
});

router.post(`/initial-setup`, verifyAdmin, function (req, res) {
  // Get organization name and all VO settings
  const org_setup = "done";
  const org_name = req.body.org_name;
  const org_country = req.body.org_country;
  const updateVOSetting = (vo_option, vo_value) => {
    req.app.db.query(
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
  req.app.ss.initialSetup = true;
});
// Get all existing users
router.get(`/users`, verifyAdmin, function (req, res) {
  req.app.db.query("SELECT * FROM vo_user", function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});
router.post(`/user`, function (req, res) {
  const first_name = req.body.first_name;
  const email = req.body.email;
  const password = Math.random().toString(36).slice(-8);
  // Hash the password
  const crypto = require("crypto");
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  req.app.db.query(
    "INSERT INTO vo_user(first_name, email, password) VALUES(?, ?, ?)",
    [first_name, email, hashedPassword]
  );
  sendMail(
    req.app.email,
    email,
    "VirtualOffice Account Registration",
    `<center>
      <b>Please click the link below to login to your VirtualOffice account,</b><br>
      <a href=${req.app.ss.frontendURL}>Login to VirtualOffice</a> <br><br>
      Username: ${email} <br>
      Password: ${password} <br>
      </center>`
  );
  res.json({ success: "User added!" });
});
router.delete(`/user/:id`, verifyAdmin, function (req, res) {
  const id = req.params.id;
  req.app.db.query(
    "DELETE FROM vo_user WHERE id=?",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      console.log(id);
      res.json({ success: "User was deleted from the database." });
    }
  );
});

module.exports = router;
