document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.querySelector('button[type="submit"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', handleSaveProfile);
    }
  });
  
  async function handleSaveProfile(event) {
    event.preventDefault();
  
    const projectFormData = collectFormData();
    if (!projectFormData) return;
  
    try {
      const response = await projectCreationForm(projectFormData); // ✅ Now this function exists
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
  async function projectCreationForm(data) {
    return await fetch('/projectCreationForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  
  // ✅ Helper to collect form input data
  function collectFormData() {
    const project_name = document.getElementById('project-name')?.value.trim();
    const project_details = document.getElementById('project-details')?.value.trim();

  
    const user_ID = localStorage.getItem('ownUserID'); // Replace with actual logic to get logged-in user's ID
    console.log(user_ID);
  
    if (!project_name  || !project_details) {
      alert('Please fill in all fields.');
      return null;
    }
  
    return { user_ID, project_name ,project_details};
  }

  
  