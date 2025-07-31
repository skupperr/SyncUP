var username = localStorage.getItem('userNameLocal');
let userID = localStorage.getItem('ownUserID');

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/gettingCurrentUserInfo/' + username)
        .then(response => response.json())
        .then(data => loadUserProfileWithCurrentUser(data['data']));

    fetch('http://localhost:5000/gettingFriendsInfo/' + userID)
        .then(response => response.json())
        .then(data => set_friends(data['data']));

    fetch('http://localhost:5000/gettingFollowersInfo/' + userID)
        .then(response => response.json())
        .then(data => set_followers(data['data']));

    fetch('http://localhost:5000/gettingFollowingsInfo/' + userID)
        .then(response => response.json())
        .then(data => set_followings(data['data']));
})

function loadUserProfileWithCurrentUser(data) {
    console.log('dwwd');
    const user_profile_pic_id = document.getElementById('user-profile-pic');
    user_profile_pic_id.src = data[0].Profile_Pic;

    const user_cover_pic_id = document.getElementById('user-cover-pic');
    user_cover_pic_id.src = data[0].cover_pic;

    const user_profile_name_id = document.getElementById('user-profile-name');
    user_profile_name_id.innerText = data[0].fullName;

    const user_profile_username = document.getElementById('user-profile-username');
    user_profile_username.innerHTML = '@' + data[0].username;

    const bio = document.getElementById('bio');
    bio.innerHTML = data[0].Bio;
}
function set_friends(data) {
    var count = data.length;
    document.getElementById('friends-count').innerHTML = count;
}
function set_followers(data) {
    var count = data.length;
    document.getElementById('followers-count').innerHTML = count;
}
function set_followings(data) {
    var count = data.length;
    document.getElementById('followings-count').innerHTML = count;
}
