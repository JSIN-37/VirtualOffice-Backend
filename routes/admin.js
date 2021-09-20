// Admin routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ss = process.env; // Server settings

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
    jwt.verify(bearerToken, ss.JWT_KEY, (err, authData) => {
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
router.post("/login", (req, res) => {
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
            ss.JWT_KEY,
            (err, token) => {
              res.json({ token, initialSetup: ss.INITIAL_SETUP }); // Send back the token, expire etc.
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

router.post("/initial-setup", verifyAdmin, function (req, res) {
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
  ss.INITIAL_SETUP = true;
});
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /admin/users:
 *  get:
 *    summary: Gets data about all users. [TOKEN REQUIRED]
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: Array in the form, [{id, first_name, last_name, email, contact_number}, {...}, ...]
 */
router.get("/users", (req, res) => {
  req.app.db.query(
    "SELECT id, first_name, last_name, email, contact_number FROM vo_user",
    [],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        res.json(results);
      }
    }
  );
});
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /admin/user:
 *  post:
 *    summary: Create new user and send activation email. [TOKEN REQUIRED]
 *    description: Input data in the form, {first_name, email} **[REQUIRED]**
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: Array in the form, [{id, first_name, last_name, email, contact_number}, {...}, ...]
 */
router.post("/user", function (req, res) {
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
      <a href=${ss.FRONTEND_URL}>Login to VirtualOffice</a> <br><br>
      Username: ${email} <br>
      Password: ${password} <br>
      </center>`
  );
  res.json({ success: "User added!" });
});
router.delete("/user/:id", verifyAdmin, function (req, res) {
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
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /admin/divisions:
 *  get:
 *    summary: Get all divisions. [TOKEN REQUIRED]
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: Array in the form, [{id, name, description, hod_id}, {...}, ...]
 */
router.get("/divisions", verifyAdmin, function (req, res) {
  req.app.db.query(
    "SELECT * FROM vo_division",
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /admin/divisions:
 *  get:
 *    summary: Get all divisions. [TOKEN REQUIRED]
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: Array in the form, [{id, name, description, hod_id}, {...}, ...]
 */
router.post("/division", verifyAdmin, function (req, res) {
  console.log(req.body);
  const division_name = req.body.divisionName;
  const description = req.body.description;
  req.app.db.query(
    "INSERT INTO vo_division(name, description) VALUES(?, ?)",
    [division_name, description],
    (error, results, fields) => {
      if (error) throw error;
      req.app.db.query(
        "SELECT * FROM vo_division WHERE id = ?",
        [results.insertId],
        (error, results, fields) => {
          if (error) throw error;
          res.json(results[0]);
        }
      );
    }
  );
});
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /admin/division/{id}:
 *  delete:
 *    summary: Delete division by given ID. [TOKEN REQUIRED]
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: Success, division deleted from database.
 */
router.delete("/division/:id", verifyAdmin, function (req, res) {
  req.app.db.query(
    "DELETE FROM vo_division WHERE id = ?",
    [req.params.id],
    (error, results, fields) => {
      if (error) throw error;
      res.json({ success: "Division was deleted from the database." });
    }
  );
});
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /admin/divisions/{id}:
 *  patch:
 *    summary: Update division by given ID. [TOKEN REQUIRED]
 *    description: Input data in the form, {name, description, hod_id} **[REQUIRED]**
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: Updated array in the form, [{id, name, description, hod_id}, {...}, ...]
 */
router.patch("/division/:id", verifyAdmin, function (req, res) {
  req.app.db.query(
    "UPDATE vo_division SET description = ? WHERE id = ?",
    [req.body.description, req.params.id],
    (error, results, fields) => {
      if (error) throw error;
      req.app.db.query(
        "SELECT * FROM vo_division WHERE id = ?",
        [req.params.id],
        (error, results, fields) => {
          if (error) throw error;
          res.json(results[0]);
        }
      );
    }
  );
});

module.exports = router;
