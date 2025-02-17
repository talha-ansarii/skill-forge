import axios from "axios";
import puppeteer from "puppeteer";

async function scrapeYouTube(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://www.youtube.com/results?search_query=${query}`, { waitUntil: 'domcontentloaded' });

  // Extract video titles and URLs along with descriptions for filtering by skill level
  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("#dismissible")).map((el) => {
      const titleElement = el.querySelector("#video-title");
      const title = titleElement ? titleElement.innerText : '';
      const href = titleElement ? titleElement.getAttribute("href") : '';
      const description = el.querySelector("#description-text") ? el.querySelector("#description-text").innerText : '';
      
      return {
        title,
        href: `https://www.youtube.com${href}`, // Full URL
        description
      };
    });
  });

  // Filtering videos based on skill level in the title or description
  const filteredData = data.filter((video) => {
    const skillLevels = ['beginner', 'intermediate', 'advanced'];
    return skillLevels.some(level => video.title.toLowerCase().includes(level) || video.description.toLowerCase().includes(level));
  });

  await browser.close();

  return filteredData;
}

(async () => {
  const query = "hello courses"; // Example query
  const data = await scrapeYouTube(query);
  console.log(data);
})();
