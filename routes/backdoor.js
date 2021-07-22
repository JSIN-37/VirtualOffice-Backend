// Backdoor routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// TODO: Implement a secret authentication for this backdoor, for now its open for anyone

/**
 * @swagger
 * /backdoor/cert:
 *  get:
 *    summary: Download the self-signed certificate for secure communication
 *    tags: [Backdoor]
 *    produces:
 *      - application/x-pem-file
 *    responses:
 *      200:
 *        description: OK
 *        schema:
 *          type: file
 *      404:
 *        description: Certificate not found.
 */
router.get(`/cert`, function (req, res) {
  res.download("cert/TinyCA/TinyCA.pem", "vo_cert.pem");
});

/**
 * @swagger
 * /backdoor/update:
 *  get:
 *    summary: Update VirtualOffice backend with the latest commits on-the-fly
 *    tags: [Backdoor]
 *    responses:
 *      200:
 *        description: Update to latest version successful.
 *      500:
 *        description: Error, couldn't update backend. Failed on restore/delete.
 */
router.get(`/update`, (req, res) => {
  const { exec } = require("child_process");
  exec("git pull", (err, stdout, stderr) => {
    if (err) {
      res.status(500).json({ error: "Couldn't update backend." });
      return;
    } else {
      let stdout1 = stdout;
      // Install any changed packages
      exec("npm install", (err, stdout, stderr) => {
        res.json({ success: `${stdout1}${stdout}` });
        process.exit(1); // Force forever to restart app after
      });
    }
  });
});

/**
 * @swagger
 * /backdoor/resetdb:
 *  get:
 *    summary: Reset VirtualOffice database with base-dummy data
 *    tags: [Backdoor]
 *    responses:
 *      200:
 *        description: Database reset successful.
 *      500:
 *        description: Error, couldn't reset database.
 */
router.get(`/resetdb`, async function (req, res) {
  console.log("Resetting database...");
  const Importer = require("mysql-import");
  const importer = new Importer({
    host: req.app.ss.DBHost,
    user: req.app.ss.DBUser,
    password: req.app.ss.DBPassword,
    database: req.app.ss.DBDatabase,
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
          res
            .status(500)
            .json({ error: "Couldn't reset database. Failed on restore." });
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "Couldn't reset database. Failed on delete." });
    });
  res.json({ success: "VirtualOffice database reset complete." });
});

module.exports = router;
