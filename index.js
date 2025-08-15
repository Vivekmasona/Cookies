import express from "express";
import YTDlpWrap from "yt-dlp-wrap";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import os from "os";

const app = express();
const ytDlp = new YTDlpWrap();

app.get("/cookies", async (req, res) => {
  try {
    const tempFile = path.join(os.tmpdir(), `cookies-${uuidv4()}.txt`);

    // yt-dlp command to export cookies (replace with actual login if needed)
    await ytDlp.exec([
      "--cookies-from-browser",
      "chrome",
      "--dump-cookies",
      tempFile
    ]);

    if (fs.existsSync(tempFile)) {
      res.setHeader("Content-Type", "text/plain");
      fs.createReadStream(tempFile).pipe(res);
    } else {
      res.status(500).send("Cookies file not generated");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating cookies file");
  }
});

app.listen(3000, () => console.log("Server running"));
