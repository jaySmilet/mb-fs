const express = require("express");
const path = require("path");
const router = express.Router();
const schema = require("../../data/form-schema.json");

router.get("/form-schema", (req, res) => {
  res.json(schema);
});

module.exports = router;
