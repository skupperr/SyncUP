const username = localStorage.getItem('userNameLocal');
const ownUserID_1 = localStorage.getItem('ownUserID');
const otherUserID = localStorage.getItem('otherUserID')

document.addEventListener('DOMContentLoaded', function () {

    fetch(`http://localhost:5000/gettingMutualFriend/${ownUserID_1}/${otherUserID}`)
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


function showing_friends(data){
    var count = data.length;
    document.getElementById('mutual-friends-count').innerHTML = count;

    const main_div = document.getElementById('profile-container')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ username, fullName, Profile_Pic, user_ID }) {
        const new_div = document.createElement("div")
        new_div.innerHTML =
            `<div class="sub-container">
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