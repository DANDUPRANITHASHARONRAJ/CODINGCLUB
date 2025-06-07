const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Scholarship = require('./models/scholarship');
const scraper = require('./scraper');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/scholarship-finder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API endpoint to get matching scholarships
app.post('/api/scholarships/match', async (req, res) => {
  try {
    const { course, gpa, location, specialCriteria } = req.body;
    
    let query = {
      $or: [
        { eligibleCourses: course },
        { eligibleCourses: 'All' }
      ],
      minGPA: { $lte: gpa },
      $or: [
        { eligibleLocations: location },
        { eligibleLocations: 'All' }
      ]
    };
    
    if (specialCriteria) {
      query.specialCriteria = { $in: specialCriteria };
    }
    
    const scholarships = await Scholarship.find(query)
      .sort({ amount: -1 })
      .limit(50);
    
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setInterval(scraper.run, 24 * 60 * 60 * 1000);
});