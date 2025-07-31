document.addEventListener('DOMContentLoaded', () => {
    // "Post a Job" button navigation
    const newProjectBtn = document.getElementById('newProjectBtn');
    if (newProjectBtn) {
      newProjectBtn.addEventListener('click', () => {
        window.location.href = 'projectForm.html';
      });
    }  
  });