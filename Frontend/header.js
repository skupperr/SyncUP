const user_name = localStorage.getItem('userNameLocal');

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/gettingCurrentUserInfo/' + user_name)
    .then(response => response.json())
    .then(data => xyz(data['data']));
})

function xyz(data) {
    const header_profile_pic = document.getElementById('header-profile-pic');
    header_profile_pic.src = data[0].Profile_Pic;
    header_profile_pic.style.backgroundImage = `url("${data[0].Profile_Pic}")`;
}