const fs = require("fs-extra");
const path = require("path");

const submissionsPath = path.join(__dirname, "../../data/submissions.json");

async function readSubmissions() {
  try {
    const exists = await fs.pathExists(submissionsPath);
    if (!exists) return [];
    const raw = await fs.readFile(submissionsPath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function writeSubmissions(list) {
  await fs.ensureFile(submissionsPath);
  await fs.writeFile(submissionsPath, JSON.stringify(list, null, 2));
}

module.exports = { readSubmissions, writeSubmissions };
