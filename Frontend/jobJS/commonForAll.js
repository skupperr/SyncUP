document.addEventListener('DOMContentLoaded', async () => {
    const profileImage = document.getElementById('profileImage');
    const userID = localStorage.getItem('ownUserID');
  
    if (profileImage && userID) {
      try {
        const res = await fetch(`/api/user/profile-pic?userID=${encodeURIComponent(userID)}`);
        if (!res.ok) throw new Error('Failed to fetch profile pic');
  
        const data = await res.json();

        console.log(data);
        profileImage.src = data.profile_pic_url;
      } catch (err) {
        console.error('Profile image load error:', err);
        profileImage.src = 'assets/default-profile.png'; // fallback image
      }
    }
  });
  


document.addEventListener('DOMContentLoaded', () => {
    const jobStatusLink = document.getElementById('jobHomePage');
  
    if (jobStatusLink) {
      jobStatusLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'homePage.html';
      });
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const jobStatusLink = document.getElementById('jobStatusLink');
  
    if (jobStatusLink) {
      jobStatusLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'JobStatus.html';
      });
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const jobStatusLink = document.getElementById('jobSearchSection');
  
    if (jobStatusLink) {
      jobStatusLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'jobSearch.html';
      });
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const jobManagePost = document.getElementById('jobManagePost');
  
    if (jobManagePost) {
      jobManagePost.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'jobPostManage.html';
      });
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    // "Post a Job" button navigation
    const postJobBtn = document.getElementById('postJobBtn');
    if (postJobBtn) {
      postJobBtn.addEventListener('click', () => {
        window.location.href = 'jobCreateForm.html';
      });
    }
  
    // Profile image navigation
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
      profileImage.addEventListener('click', () => {
        window.location.href = 'manageProfile.html';
      });
    }
  });
  