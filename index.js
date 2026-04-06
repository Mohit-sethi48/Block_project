const express = require("express");
const app = express();

app.use(express.json()); // body read karne ke liye

// test API
app.get("/", (req, res) => {
  res.json({ message: "API chal rahi hai bhai 😄" });
});

// GET API
app.get("/api/user", (req, res) => {
  res.json({
    id: 1,
    name: "Mohit",
    role: "Developer"
  });
});

// POST API
app.post("/api/user", (req, res) => {
  const data = req.body;
  res.json({
    success: true,
    received: data
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

