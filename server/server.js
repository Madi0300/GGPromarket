const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./routes/api");

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

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port${PORT}`);
});
