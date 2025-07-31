document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.querySelector('button[type="submit"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', handleSaveProfile);
    }
  });
  
  async function handleSaveProfile(event) {
    event.preventDefault();
  
    const profileData = collectFormData();
    if (!profileData) return;
  
    try {
      const response = await add_new_job(profileData); // ✅ Now this function exists
      if (response.ok) {
        alert('Profile saved successfully!');
      } else {
        const error = await response.json();
        console.error(error);
        alert('Failed to save profile');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while saving your profile.');
    }
  }
  
  // ✅ Define this helper function to send data to backend
  async function add_new_job(data) {
    return await fetch('/add_new_job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  
  // ✅ Helper to collect form input data
  function collectFormData() {
    const job_title = document.getElementById('job-title')?.value.trim();
    const company_name = document.getElementById('company-name')?.value.trim();
    const location = document.getElementById('location')?.value.trim();
    const job_description = document.getElementById('job-description')?.value.trim();
    const requirement = document.getElementById('requirements')?.value.trim();
    const salary_min = document.getElementById('salary-min')?.value.trim();
    const salary_max = document.getElementById('salary-max')?.value.trim();
    const apply_process = document.getElementById('application-instructions')?.value.trim();
    const selectedJobLevel = document.getElementById("jobLevel").value;
    const job_resposibility = document.getElementById("responsibilities").value.trim();
    const benefits = document.getElementById("benefits").value.trim();
    const about_company = document.getElementById("about-company").value.trim();
  
    const user_ID = localStorage.getItem('ownUserID'); // Replace with actual logic to get logged-in user's ID
    console.log(user_ID);
  
    if (!job_title || !company_name || !location || !job_description || !requirement || !salary_min || !salary_max || !apply_process || !selectedJobLevel || !job_resposibility || !benefits || !about_company) {
      alert('Please fill in all fields.');
      return null;
    }
  
    return { user_ID, job_title ,company_name ,location ,job_description ,requirement ,salary_min ,salary_max ,apply_process, selectedJobLevel, job_resposibility, benefits, about_company};
  }

  
  