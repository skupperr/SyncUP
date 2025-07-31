const username = localStorage.getItem('userNameLocal');
const ownUserID_1 = localStorage.getItem('ownUserID');

document.addEventListener('DOMContentLoaded', function () {

    fetch('http://localhost:5000/gettingFriendsInfo/' + ownUserID_1)
        .then(response => response.json())
        .then(data => showing_friends(data['data']));
})

let x = document.querySelector('#profile-container')
if (x) {
    x.addEventListener('click', function (event) {
        const unfriend = event.target.closest('.friends-button')
        if (unfriend) {
            const otherUserID = unfriend.dataset.id;
            fetch(`http://localhost:5000/cancelFriendReq/${ownUserID_1}/${otherUserID}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload()
                    }
                });
        }
    })
}

const div1 = document.getElementById('profile-container');

if (div1) {
    div1.addEventListener('click', function (event) {
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

function showing_friends(data){
    var count = data.length;
    document.getElementById('friends-count').innerHTML = count;

    const main_div = document.getElementById('profile-container')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ username, fullName, Profile_Pic, user_ID }) {
        const new_div = document.createElement("div")
        new_div.innerHTML =
            `<div class="sub-container">
                                <a id="${username}-${user_ID}" class="abc" style="text-decoration: none; color:black;" href = '../other_profile/other_user_profile.html'>
                                    <div class="pic-class">
                                        <img class="profile-pic" src="${Profile_Pic}" alt="">
                                    </div>
                                </a>
                                    <div class="profile-details">
                                        <div class="profile-name">${fullName}</div>
                                        <div class="user-name">${username}</div>
                                    </div>
                                    <div class="status-button">
                                        <button class="friends-button" data-id=${user_ID}>Friends</button>
                                    </div>
                </div>
                `
        main_div.appendChild(new_div);

    });
}

function searching_friend() {
    const text = document.getElementById('search-friend').value;

    document.getElementById('profile-container').innerHTML = '';

    if(text === ''){
        fetch('http://localhost:5000/gettingFriendsInfo/' + ownUserID_1)
        .then(response => response.json())
        .then(data => showing_friends(data['data']));
    }

    fetch(`http://localhost:5000/searchingFriend/${ownUserID_1}/${text}`)
        .then(response => response.json())
        .then(data => showing_friends(data['data']));
}
