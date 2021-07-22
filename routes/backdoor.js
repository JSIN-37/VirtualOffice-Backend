// Backdoor routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// TODO: Implement a secret authentication for this backdoor, for now its open for anyone

// Download certificate for secure communication
router.get(`/cert`, function (req, res) {
  res.download("cert/TinyCA/TinyCA.pem", "vo_cert.pem");
});

// Helpful to update the backend on-the-fly
router.get(`/update`, (req, res) => {
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
        });
    })
    .catch((err) => {
      console.error(err);
    });
  res.json({ success: "VirtualOffice database reset complete." });
});

module.exports = router;
