document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const course = document.getElementById('course').value;
  const gpa = parseFloat(document.getElementById('gpa').value);
  const location = document.getElementById('location').value;
  
  const specialCriteria = [];
  document.querySelectorAll('input[name="specialCriteria"]:checked').forEach(cb => {
    specialCriteria.push(cb.value);
  });
  
  try {
    const response = await fetch('http://localhost:5000/api/scholarships/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ course, gpa, location, specialCriteria }),
    });
    
    const scholarships = await response.json();
    displayResults(scholarships);
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('results').innerHTML = 
      '<div class="error">Error fetching scholarships. Please try again.</div>';
  }
});

function displayResults(scholarships) {
  const resultsContainer = document.getElementById('results');
  
  if (scholarships.length === 0) {
    resultsContainer.innerHTML = '<div class="no-results">No matching scholarships found.</div>';
    return;
  }
  
  let html = '<h2>Matching Scholarships</h2><div class="scholarship-list">';
  
  scholarships.forEach(scholarship => {
    html += `
      <div class="scholarship-card">
        <h3>${scholarship.title}</h3>
        <p><strong>Amount:</strong> $${scholarship.amount.toLocaleString()}</p>
        <p><strong>Deadline:</strong> ${new Date(scholarship.deadline).toLocaleDateString()}</p>
        <p><strong>Eligibility:</strong> GPA ${scholarship.minGPA}+</p>
        <a href="${scholarship.applicationLink}" target="_blank" class="apply-btn">Apply Now</a>
      </div>
    `;
  });
  
  html += '</div>';
  resultsContainer.innerHTML = html;
}