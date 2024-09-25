const express = require("express");

const app = express();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get("/", (req, resp) => {
  resp.status(200).send("Hello World!");
});

module.exports = app;
