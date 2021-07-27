// User routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

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
    jwt.verify(bearerToken, req.app.ss.jwtKey, (err, authData) => {
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
router.post(`/login`, (req, res) => {
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
    "SELECT id, first_name, last_name FROM vo_user WHERE email = ? AND password = ?",
    [email, hashedPassword],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length) {
        // Indicate frontend that an initial setup is required
        if (!req.app.ss.initialSetup) {
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
        };
        jwt.sign(
          { user: user, expire: expire },
          req.app.ss.jwtKey,
          (err, token) => {
            res.json({ token }); // Just send back the token
          }
        );
      } else {
        res.status(401).json({ error: "Login failed." });
      }
    }
  );
  return;
});

// Get data about user
router.get(`/whoami`, verifyUser, (req, res) => {
  const userID = req.authData.user.id;
  req.app.db.query(
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
router.post(`/logout`, verifyUser, (req, res) => {
  res.json(req.authData);
});

// Initial setting up
router.get(`/initial-setup`, (req, res) => {
  res.end("initial user set up");
});

module.exports = router;
