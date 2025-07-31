document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.querySelector('button[type="submit"]');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');

  // Handle Save Profile button
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveProfile);
  }

  // Handle Upload CV button click
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => {
      fileInput.click(); // Trigger hidden file input
    });

    // Optional: Show selected file name
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        alert(`Selected file: ${fileName}`); // Optional
        document.getElementById('selectedFileName').textContent = fileName; // ✅ Add this
      }
    });
  }
});

async function handleSaveProfile(event) {
  event.preventDefault();

  const profileData = collectFormData();
  if (!profileData) return;

  try {
    const response = await saveUserProfile(profileData);
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

// ✅ Send form data (includes file)
async function saveUserProfile(formData) {
  return await fetch('/saveUserProfile', {
    method: 'POST',
    body: formData,
  });
}

// ✅ Collect form fields and file
function collectFormData() {
  const fullName = document.getElementById('fullName')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const cvFile = document.getElementById('fileInput')?.files[0];

  console.log(cvFile);

  const user_ID = localStorage.getItem('ownUserID');
  console.log('User ID:', user_ID);

  if (!fullName || !email || !phone) {
    alert('Please fill in all fields.');
    return null;
  }

  const formData = new FormData();
  formData.append('user_ID', user_ID);
  formData.append('fullName', fullName);
  formData.append('email', email);
  formData.append('phone', phone);
  if (cvFile) formData.append('cv', cvFile);

  return formData;
}





// document.addEventListener('DOMContentLoaded', () => {
//   const saveBtn = document.querySelector('button[type="submit"]');
//   if (saveBtn) {
//     saveBtn.addEventListener('click', handleSaveProfile);
//   }
// });

// async function handleSaveProfile(event) {
//   event.preventDefault();

//   const profileData = collectFormData();
//   if (!profileData) return;

//   try {
//     const response = await saveUserProfile(profileData); // ✅ Now this function exists
//     if (response.ok) {
//       alert('Profile saved successfully!');
//     } else {
//       const error = await response.json();
//       console.error(error);
//       alert('Failed to save profile');
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     alert('An error occurred while saving your profile.');
//   }
// }

// // ✅ Define this helper function to send data to backend
// // async function saveUserProfile(data) {
// //   return await fetch('/saveUserProfile', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(data),
// //   });
// // }

// async function saveUserProfile(formData) {
//   return await fetch('/saveUserProfile', {
//     method: 'POST',
//     body: formData, // Don't set Content-Type; browser will set it for FormData
//   });
// }


// function collectFormData() {
//   const fullName = document.getElementById('fullName')?.value.trim();
//   const email = document.getElementById('email')?.value.trim();
//   const phone = document.getElementById('phone')?.value.trim();
//   const cvFile = document.getElementById('cvFile')?.files[0];

//   const user_ID = localStorage.getItem('ownUserID');
//   console.log(user_ID);

//   if (!fullName || !email || !phone) {
//     alert('Please fill in all fields.');
//     return null;
//   }

//   const formData = new FormData();
//   formData.append('user_ID', user_ID);
//   formData.append('fullName', fullName);
//   formData.append('email', email);
//   formData.append('phone', phone);
//   if (cvFile) formData.append('cv', cvFile);

//   return formData;
// }

// ✅ Helper to collect form input data
// function collectFormData() {
//   const fullName = document.getElementById('fullName')?.value.trim();
//   const email = document.getElementById('email')?.value.trim();
//   const phone = document.getElementById('phone')?.value.trim();

//   const user_ID = localStorage.getItem('ownUserID'); // Replace with actual logic to get logged-in user's ID
//   console.log(user_ID);

//   if (!fullName || !email || !phone) {
//     alert('Please fill in all fields.');
//     return null;
//   }

//   return { user_ID, fullName, email, phone };
// }
