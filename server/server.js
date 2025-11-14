const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env.local") });
const apiRoutes = require("./routes/api");
const ensureDatabase = require("./db/ensureDatabase");

ensureDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["https://madi0300.github.io", "http://localhost:5173"],
  })
);
app.use(express.json());

app.use(
  "/Footer/socialMedia",
  express.static(path.join(__dirname, "public", "images", "footer", "socialMedia"))
);

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port${PORT}`);
});
