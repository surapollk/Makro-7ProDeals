const axios = require('axios');
const Papa = require('papaparse');

const BASE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1FlUt328voq_BWmmt52gys_hOjrpsNagmjGt9AUrUplY/export?format=csv';
const SHEET_HTML_URL = 'https://docs.google.com/spreadsheets/d/1FlUt328voq_BWmmt52gys_hOjrpsNagmjGt9AUrUplY/htmlview';

async function testFetch() {
  try {
    console.log("Fetching HTML view to get sheet names (categories)...");
    const response = await axios.get(SHEET_HTML_URL);
    const html = response.data;
    const flatCategories = [];
    const regex = /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:.*?gid=([0-9]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      // Decode unicode escapes like \u003e
      const decodedName = match[1].replace(/\\u[\dA-F]{4}/gi, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
      flatCategories.push({ name: decodedName.trim(), gid: match[2] });
    }
    console.log("Categories found:", flatCategories);

    if (flatCategories.length > 0) {
      console.log(`\nFetching data for first category: ${flatCategories[0].name} (gid: ${flatCategories[0].gid})`);
      const fetchUrl = `${BASE_SHEET_URL}&gid=${flatCategories[0].gid}`;
      const csvRes = await axios.get(fetchUrl);
      const parsedData = Papa.parse(csvRes.data, { header: true, skipEmptyLines: true });
      console.log(`Found ${parsedData.data.length} products in first sheet.`);
      if (parsedData.data.length > 0) {
        console.log("Sample product fields:", Object.keys(parsedData.data[0]));
        console.log("Sample product:", parsedData.data[0]);
      }
    }
  } catch (err) {
    console.error("Error during test:", err);
  }
}

testFetch();
