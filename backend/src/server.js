const express = require("express");
const cors = require("cors");
const formSchemaRoutes = require("./routes/formSchema");
const submissionsRoutes = require("./routes/submissions");

const app = express();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", formSchemaRoutes);
app.use("/api", submissionsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
