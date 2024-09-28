const express = require("express");
const { removeBackground } = require("@imgly/background-removal-node");
const fs = require("fs");

fs.mkdirSync("./temp", { recursive: true });
const app = express();

app.use(express.json({ limit: "10mb" }));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/rbg", function (req, res) {
  console.log(JSON.stringify(req.body, null, 2));
  const base64 = req.body?.base64;
  const buffer = Buffer.from(base64, "base64");
  const fileName = `temp/file-${Date.now()}.jpg`;
  fs.writeFileSync(fileName, buffer);
  removeBackground(fileName, {
    debug: true,
    progress: (key, current, total) => {
      console.log(`Downloading ${key}: ${current} of ${total}`);
    },
  })
    .then((blob) => blob.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer))
    .then((buffer) => res.send(buffer));
});

app.listen(5000, () => console.log("App running on port", 5000));

module.exports = app
