// User routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ss = process.env; // Server settings

///////////////////////////////////////////////// Common functions
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
    jwt.verify(bearerToken, ss.JWT_KEY, (err, authData) => {
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
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/login:
 *  post:
 *    summary: User login
 *    tags: [User]
 *    produces:
 *      - application/json
 *    requestBody:
 *       description: Needs email, password and 'remember me'
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: user@email.com
 *                password:
 *                  type: string
 *                  example: user@123
 *                rememberMe:
 *                  type: boolean
 *                  example: true
 *    responses:
 *      200:
 *        description: Authorization successful.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token :
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOiIyMDIxLTA3LTIyVDA4OjAwOjM3LjQyNFoiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2MjY5MzcyMzd9.GQDuIYjccpPFB7BPxMUtRnMurIkO13BJOTG3oq52nq4
 *      401:
 *        description: Authorization failed.
 */
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const rememberMe = req.body.rememberMe; // Increase expire time if this is enabled
  // Hash the password
  const crypto = require("crypto");
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  // TODO: Check for validation
  // Check if user with email and password exist
  req.app.db.query(
    "SELECT id, first_name, last_name, division_id FROM vo_user WHERE email = ? AND password = ?",
    [email, hashedPassword],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        // Indicate frontend that an initial setup is required
        if (!ss.INITIAL_SETUP) {
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
        const expire = new Date().addHours(rememberMe ? 48 : 12); // Logged in for 12/48 hours
        const user = {
          id: results[0].id,
          email: results[0].email,
          first_name: results[0].first_name,
          last_name: results[0].last_name,
          division_id: results[0].division_id,
        };
        jwt.sign({ user: user, expire: expire }, ss.JWT_KEY, (err, token) => {
          res.json({ token }); // Just send back the token
        });
      } else {
        res.status(401).json({ error: "Login failed." });
      }
    }
  );
  return;
});

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/whoami:
 *  get:
 *    summary: Gets data about logged in user [token required]
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Authorization successful, gets data about id, first_name, last_name
 *      401:
 *        description: Authorization failed.
 */
router.get("/whoami", verifyUser, (req, res) => {
  const userID = req.authData.user.id;
  req.app.db.query(
    "SELECT id, first_name, last_name, division_id FROM vo_user WHERE id = ?",
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

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/division-users:
 *  get:
 *    summary: Gets data about all users in current user's division [token required]
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Authorization successful, gets data array about [{id, first_name, last_name, email, contact_number}, ...]
 *      401:
 *        description: Authorization failed.
 */
 router.get("/division-users", verifyUser, (req, res) => {
  const division_id = req.authData.user.division_id;
  req.app.db.query(
    "SELECT id, first_name, last_name, email, contact_number FROM vo_user WHERE division_id = ?",
    [division_id],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        res.json(results);
      }
    }
  );
});

// Logout
router.post("/logout", verifyUser, (req, res) => {
  res.json(req.authData);
});

// Initial setting up
router.get("/initial-setup", (req, res) => {
  res.end("initial user set up");
});

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/team:
 *  get:
 *    summary: Gets data about available teams for user
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Successful.
 */

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/team/id:
 *  get:
 *    summary: Gets data about the specific team
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Successful.
 */

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/team:
 *  post:
 *    summary: Create a new team
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Successful.
 */

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/team/id:
 *  put:
 *    summary: Update a team
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Successful.
 */

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/team/id:
 *  delete:
 *    summary: Delete a team
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Successful.
 */

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/checkin:
 *  post:
 *    summary: Start daily work check-in. Pass in location (not yet).
 *    tags: [User]
 *    responses:
 *      200:
 *        description: id=ID of the worklog, start_time=server epoch time (start)
 */
router.post("/checkin", verifyUser, (req, res) => {
  const userID = req.authData.user.id;
  const startLocation = "startLocation";
  const epochNow = Math.round(Date.now() / 1000);
  req.app.db.query(
    "INSERT INTO vo_worklog(user_id, start_time) VALUES(?, ?)",
    [userID, epochNow],
    (error, results, fields) => {
      if (error) throw error;
      const lastInsert = results.insertId;
      res.json({ id: lastInsert, start_time: epochNow });
    }
  );
});
///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/checkout:
 *  post:
 *    summary: Start daily work check-out. id=worklog's id that was received from checkin. Pass in location (not yet).
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Entire worklog db entry as a JSON object.
 */
router.post("/checkout", verifyUser, (req, res) => {
  const id = req.body.id;
  const endLocation = "endLocation";
  const epochNow = Math.round(Date.now() / 1000);
  const fullDay = 8; // Hours
  const halfDay = 5; // Hours
  req.app.db.query(
    "SELECT start_time FROM vo_worklog WHERE id = ?",
    [id],
    (error, results, fields) => {
      if (error) throw error;
      // Calculate full/half day
      const whatDay = Math.floor((epochNow - results[0].start_time) / 3600);
      var verdict = null;
      // Full!
      if (whatDay >= fullDay) verdict = "F";
      // Half!
      else if (whatDay >= halfDay) verdict = "H";
      req.app.db.query(
        "UPDATE vo_worklog SET end_time = ?, full_half = ? WHERE id = ?",
        [epochNow, verdict, id],
        (error, results, fields) => {
          if (error) throw error;
          req.app.db.query(
            "SELECT * FROM vo_worklog WHERE id = ?",
            [id],
            (error, results, fields) => {
              if (error) throw error;
              res.json(results[0]);
            }
          );
        }
      );
    }
  );
});

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/checkcheckin:
 *  get:
 *    summary: Check if checked in already.
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Entire worklog db entry as a JSON object (only if checked in).
 */
router.get("/checkcheckin", verifyUser, (req, res) => {
  const userID = req.authData.user.id;
  var dayStartEpoch = new Date().setHours(0, 0, 0, 0) / 1000;
  var dayEndEpoch = new Date().setHours(24, 0, 0, 0) / 1000;
  req.app.db.query(
    "SELECT * FROM vo_worklog WHERE start_time BETWEEN ? AND ? AND user_id = ?",
    [dayStartEpoch, dayEndEpoch, userID],
    (error, results, fields) => {
      if (error) throw error;
      res.json(results[0]);
    }
  );
});

///////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /user/all-keys:
 *  get:
 *    summary: Get all client keys.
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Entire key list.
 */
router.get("/all-keys", verifyUser, (req, res) => {
  const error = "Key not found in configuration file.";
  res.json({
    EMAIL_CLIENT_ID: ss.EMAIL_CLIENT_ID ? ss.EMAIL_CLIENT_ID : error,
    EMAIL_API_KEY: ss.EMAIL_API_KEY ? ss.EMAIL_API_KEY : error,
    FILE_SHARE_APP_ID: ss.FILE_SHARE_APP_ID ? ss.FILE_SHARE_APP_ID : error,
    FILE_SHARE_DEV_KEY: ss.FILE_SHARE_DEV_KEY ? ss.FILE_SHARE_DEV_KEY : error,
  });
});

module.exports = router;
