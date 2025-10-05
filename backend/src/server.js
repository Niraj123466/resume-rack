const express = require("express");
const cors = require("cors");
const config = require("./config");
const apiRoutes = require("./routes/api");

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Start Server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

module.exports = app;