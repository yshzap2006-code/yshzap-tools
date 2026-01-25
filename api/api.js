import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    // Fetch the official results page
    const { data } = await axios.get('https://statelottery.kerala.gov.in/index.php/lottery-result-view', {
      headers: { 'User-Agent': 'Mozilla/5.0' } // Helps bypass simple blocks
    });

    const $ = cheerio.load(data);
    const results = [];

    // The site uses a table. We target the first few rows.
    $('table tr').each((index, element) => {
      if (index === 0) return; // Skip table header

      const columns = $(element).find('td');
      if (columns.length >= 3) {
        results.push({
          name: $(columns[0]).text().trim(),
          date: $(columns[1]).text().trim(),
          pdf_link: $(columns[2]).find('a').attr('href')
        });
      }
    });

    // Return the top 5 latest results
    res.status(200).json({
      success: true,
      last_updated: new Date().toLocaleString(),
      results: results.slice(0, 5) 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
