import puppeteer from "puppeteer";
import fs from "fs";

async function getYoutubeCookies() {
  const browser = await puppeteer.launch({
    headless: false, // login ke liye visible rakho
  });

  const page = await browser.newPage();
  await page.goto("https://accounts.google.com/signin/v2/identifier?service=youtube");

  console.log("👉 Please login with your Google account manually...");

  // Wait until user is logged in
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.goto("https://www.youtube.com");

  // Get cookies
  const cookies = await page.cookies();

  // Save cookies.txt format for yt-dlp
  const cookiesTxt = cookies
    .map(
      (c) =>
        [
          ".youtube.com", // domain
          "TRUE",
          c.path || "/",
          c.secure ? "TRUE" : "FALSE",
          Math.floor(c.expires || Date.now() / 1000 + 3600),
          c.name,
          c.value,
        ].join("\t")
    )
    .join("\n");

  fs.writeFileSync("cookies.txt", cookiesTxt);
  console.log("✅ Fresh cookies.txt saved!");
  
  await browser.close();
}

getYoutubeCookies();
