import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" });

    const cookies = await page.cookies();
    await browser.close();

    res.json({ cookies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
