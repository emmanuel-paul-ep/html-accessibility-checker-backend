const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
