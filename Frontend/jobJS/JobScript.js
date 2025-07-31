// script.js

// For homePage.html
function redirectToJobSearch(event) {
  event.preventDefault();
  const searchText = document.getElementById('searchInput').value;
  if (searchText.trim()) {
    window.location.href = `jobSearch.html?query=${encodeURIComponent(searchText)}`;
  }
}

// For jobSearch.html
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  if (query) {
    const inputField = document.getElementById('searchBox');
    if (inputField) {
      inputField.value = decodeURIComponent(query);
    }
  }
});

// Redirect to JobStatus.html when link is clicked
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

// Redirect to JobStatus.html when link is clicked
document.addEventListener('DOMContentLoaded', () => {
  const jobStatusLink = document.getElementById('goToHomeJob');

  if (jobStatusLink) {
    jobStatusLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'homePage.html';
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