const axios = require('axios');
const cheerio = require('cheerio');
const Scholarship = require('./models/scholarship');

const run = async () => {
  try {
    const { data } = await axios.get('https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory');
    const $ = cheerio.load(data);
    
    const scholarships = [];
    
    $('.scholarship-item').each((i, element) => {
      const title = $(element).find('.scholarship-title').text().trim();
      const amount = $(element).find('.scholarship-amount').text().trim();
      const deadline = $(element).find('.scholarship-deadline').text().trim();
      const link = $(element).find('a').attr('href');
      
      scholarships.push({
        title,
        amount: parseFloat(amount.replace(/[^0-9.]/g, '')),
        deadline: new Date(deadline),
        applicationLink: link,
        eligibleCourses: ['All'],
        minGPA: 2.5,
        eligibleLocations: ['All']
      });
    });
    
    await Scholarship.deleteMany({});
    await Scholarship.insertMany(scholarships);
    
    console.log(`Scraped ${scholarships.length} scholarships`);
  } catch (err) {
    console.error('Scraping error:', err);
  }
};

module.exports = { run };