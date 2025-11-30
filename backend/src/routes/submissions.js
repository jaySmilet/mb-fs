const express = require("express");
const { v4: uuid } = require("uuid");
const { readSubmissions, writeSubmissions } = require("../utils/fileStore");
const validateSubmission = require("../validation/validateSubmission");

const router = express.Router();

// create submission
router.post("/submissions", validateSubmission, async (req, res, next) => {
  try {
    const list = await readSubmissions();
    const id = uuid();
    const createdAt = new Date().toISOString();

    const newItem = {
      id,
      createdAt,
      data: req.body,
    };

    list.push(newItem);
    await writeSubmissions(list);

    return res.status(201).json({
      success: true,
      id,
      createdAt,
    });
  } catch (err) {
    next(err);
  }
});

// list submissions
router.get("/submissions", async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(limit) || limit < 1) limit = 10;
    if (!["createdAt"].includes(sortBy)) sortBy = "createdAt";
    if (!["asc", "desc"].includes(sortOrder)) sortOrder = "desc";

    const all = await readSubmissions();
    const sorted = all.sort((a, b) => {
      const aVal = new Date(a[sortBy]).getTime();
      const bVal = new Date(b[sortBy]).getTime();
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    const totalItems = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit);

    res.json({
      success: true,
      items,
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
