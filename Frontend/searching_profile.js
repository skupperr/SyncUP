document.getElementById('body').addEventListener('click', function () {
    const x = document.getElementById('search-dropdown-id');
    x.style.display = 'none';
})

const ownUserID_2 = localStorage.getItem('ownUserID');
console.log(ownUserID_2);

function searching() {
    const text = document.getElementById('search-profile').value;

    console.log(text);

    const x = document.getElementById('search-dropdown-id');
    x.style.display = 'block';

    document.getElementById('search-dropdown-id').innerHTML = '';

    fetch(`http://localhost:5000/searchingProfile/${ownUserID_2}/${text}`)
        .then(response => response.json())
        .then(data => showingData(data['data']));
}




// document.addEventListener('DOMContentLoaded', () => {
//     const ownUserID_2 = localStorage.getItem('ownUserID');

//     if (!ownUserID_2) {
//         console.warn('ownUserID not found in localStorage');
//         return;
//     }

//     const body = document.getElementById('body');
//     const input = document.getElementById('search-profile');
//     const dropdown = document.getElementById('search-dropdown-id');

//     if (!body || !input || !dropdown) {
//         console.error('DOM elements not found');
//         return;
//     }

//     // Hide dropdown on body click
//     body.addEventListener('click', function () {
//         dropdown.style.display = 'none';
//     });

//     // Show dropdown on input
//     input.addEventListener('input', function () {
//         const text = this.value;
//         console.log('Search text:', text);

//         if (!text.trim()) {
//             dropdown.style.display = 'none';
//             return;
//         }

//         dropdown.style.display = 'block';
//         dropdown.innerHTML = 'Loading...';

//         fetch(`http://localhost:5000/searchingProfile/${ownUserID_2}/${text}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (data?.data) {
//                     showingData(data.data);
//                 } else {
//                     dropdown.innerHTML = '<p>No results found</p>';
//                 }
//             })
//             .catch(err => {
//                 console.error('Fetch error:', err);
//                 dropdown.innerHTML = '<p>Error loading results</p>';
//             });
//     });
// });




const div = document.getElementById('search-dropdown-id');

if (div) {
    div.addEventListener('click', function (event) {
        const checkurl = event.target.closest(".abc");
        if (checkurl) {
            const username_ID = checkurl.id;
            let x = username_ID.split('-');
            const otherUserName = x[0];
            const otherUserID = x[1];
            
            localStorage.setItem('otherUserName', otherUserName);
            localStorage.setItem('otherUserID', otherUserID);
        }
    })
}

function showingData(data) {
    const div = document.getElementById('search-dropdown-id');

    data.forEach(function ({ fullName, username, Profile_Pic, user_ID }) {
        const new_div = document.createElement("div");

        new_div.innerHTML = `
                    <a id="${username}-${user_ID}" class="abc" style="text-decoration: none; color:black;" href = '../other_profile/other_user_profile.html'>
                    <div class="search-dropdown-container" id="profile-name-${username}">
                        <img src="${Profile_Pic}" alt="">
                        <div class="search-dropdown-profile-name">${fullName}</div>
                    </div>
                </a>
        
        `
        div.appendChild(new_div);
    });
}