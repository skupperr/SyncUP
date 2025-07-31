var username = localStorage.getItem('userNameLocal');
let ownUserID = localStorage.getItem('ownUserID');

document.addEventListener('DOMContentLoaded', function () {

    fetch('http://localhost:5000/gettingFriendReqInfo/' + ownUserID)
        .then(response => response.json())
        .then(data => showing_friends(data['data']));
})


let x = document.querySelector('#profile-container-id')
if (x) {
    x.addEventListener('click', function (event) {
        const accept_friend = event.target.closest('.accept-button')
        if (accept_friend) {
            const otherUserID = accept_friend.dataset.id;
            fetch('http://localhost:5000/AcceptFriendReq/', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'PATCH', 
                body: JSON.stringify({ 
                    ownUserID : ownUserID,
                    otherUserID : otherUserID
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    // Notify
                    sendFriendRelatedNotification(2, otherUserID);              
                }
            })
        }
    })
}

const div1 = document.getElementById('profile-container-id');

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
    document.getElementById('friend-req-count').innerHTML = count;

    const main_div = document.getElementById('profile-container-id')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ fullName, Profile_Pic, user_ID, username }) {
        const new_div = document.createElement("div")
        new_div.innerHTML =
            `<div id='profile-${user_ID}' class="profile">
                <a id="${username}-${user_ID}" class="abc" style="text-decoration: none; color:black;" href = '../other_profile/other_user_profile.html'>

                    <div class="profile-pic-class">
                        <img class="profile-picture" src="${Profile_Pic}">
                    </div>
        
                    <div class="name-class">
                        <p class="name">${fullName}</p>
                    </div>
                </a>
    
                <button id='accept-btn-${user_ID}' class="accept-button" data-id=${user_ID}>Accept</button>
            </div>
                `
        main_div.appendChild(new_div);

    });
}

function sendFriendRelatedNotification(x, otherUserID){
    let id = 0;
    if(x == 1)
        id = ownUserID;
    else if(x == 2){
        id = ownUserID;
    }
        
    
    fetch('http://localhost:5000/gettingNameofSender/' + id)
        .then(response => response.json())
        .then(data => sendNotification(data['data'], x, otherUserID));
}

function sendNotification(data, x, otherUserID){
    const name = data[0].fullName;
    console.log(name, otherUserID);
    let notification_text = '';
    if(x == 1){
        notification_text = name+' sent you a friend request';

        fetch('http://localhost:5000/insertNotification', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ notification_text: notification_text, id: otherUserID })
        })
            .then(response => response.json())
    }
    else if(x == 2){
        notification_text = name+' accepted your friend request';
        fetch('http://localhost:5000/insertNotification', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ notification_text: notification_text, id: otherUserID })
        })
            .then(response => response.json())
    }

    location.reload();  
}