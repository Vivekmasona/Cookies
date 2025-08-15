const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.get("/cookies", (req, res) => {
  const tempFile = path.join(__dirname, `cookies-${uuidv4()}.txt`);

  exec(`yt-dlp --cookies-from-browser chrome --dump-cookies ${tempFile}`, (err) => {
    if (err) return res.status(500).send("Error generating cookies");

    fs.createReadStream(tempFile)
      .on("end", () => fs.unlinkSync(tempFile))
      .pipe(res);
  });
});

app.listen(3000, () => console.log("Server running"));
