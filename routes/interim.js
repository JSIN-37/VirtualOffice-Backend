// Interim routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");

router.get(`/todos`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/todoData.json");
  let data = JSON.parse(rawdata).todos;
  res.json(data);
});
router.get(`/doing`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/doingData.json");
  let data = JSON.parse(rawdata).doing;
  res.json(data);
});
router.get(`/teams`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/teamData.json");
  let data = JSON.parse(rawdata).teams;
  res.json(data);
});
router.delete(`/teams/:id`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/teamData.json");
  let data = JSON.parse(rawdata).teams;
  var filtered = data.filter((a) => a.id != req.params.id);
  fs.writeFileSync(
    "./interim/teamData.json",
    JSON.stringify({ teams: filtered }),
    "utf8"
  );
  res.json(filtered);
});
router.get(`/emps`, (req, res) => {
  let rawdata = fs.readFileSync("./interim/divEmpData.json");
  let data = JSON.parse(rawdata).emps;
  res.json(data);
});

module.exports = router;
