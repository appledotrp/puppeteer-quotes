import puppeteer from "puppeteer";

const getQuotes = async (page) => {
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll(".quote");
    return Array.from(quoteList).map((quote) => {
      const text = quote.querySelector(".text").innerText;
      const author = quote.querySelector(".author").innerText;
      const tags = Array.from(quote.querySelectorAll(".tags .tag")).map(
        (el) => el.textContent.trim()
      );
      return { text, author, tags };
    });
  });
  console.log(quotes);
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  while (true) {
    const selectorExists = await page.evaluate(() => {
      const element = document.querySelector(".pager > .next > a");
      return element !== null;
    });

    if (selectorExists) {
      await page.click(".pager > .next > a");
      await page.waitForTimeout(1000); // Optional: Add a small delay to avoid overwhelming the website
      await getQuotes(page);
    } else {
      console.log("End of page!");
      break; // Exit the loop when the "Next" button is not present
    }
  }

  await browser.close(); // Close the browser once you're done scraping all pages
};

main();
