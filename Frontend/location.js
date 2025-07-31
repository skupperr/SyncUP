const profile_container = document.getElementById('profile-container');
const location_permission = document.getElementById('location-access-btn');

const ownUserID = localStorage.getItem('ownUserID');
var username = localStorage.getItem('userNameLocal');

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/locationPermission/' + ownUserID)
        .then(response => response.json())
        .then(data => Permission_Status(data['data']));
})

function Permission_Status(data) {
    if (data[0].location_permission === 'yes') {
        location_permission.innerHTML = 'ON';
        a();
    }
    else if (data[0].location_permission === 'no') {
        location_permission.innerHTML = 'OFF';
        profile_container.style.display = 'none';
    }
}

function a() {

    const now = new Date();
    const year = now.getFullYear();        // 2024
    const month = now.getMonth() + 1;      // 10 (Months are zero-indexed, so add 1)
    const day = now.getDate();             // 3
    const hours = now.getHours();          // 12
    const minutes = now.getMinutes();      // 34
    const seconds = now.getSeconds();      // 56

// Format the current date and time in a custom format
const DateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const watchid = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;

        fetch('http://localhost:5000/insertLocationInfo/', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH', 
            body: JSON.stringify({ 
                ownUserID: ownUserID,
                latitude: latitude,
                longitude:longitude,
                DateTime: DateTime
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
            }
        })
    })

    profile_container.style.display = 'block';
}

location_permission.addEventListener('click', function () {
    if (location_permission.innerHTML === 'OFF') {

        fetch('http://localhost:5000/updateLocationPermission/', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                ownUserID: ownUserID,
                x: 1
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location_permission.innerHTML = 'ON';
                }
            })
    }
    else if (location_permission.innerHTML === 'ON') {
        profile_container.style.display = 'none';

        fetch('http://localhost:5000/updateLocationPermission/', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                ownUserID: ownUserID,
                x: 0
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location_permission.innerHTML = 'OFF';
                }
            })
    }
});


document.addEventListener('DOMContentLoaded', function () {

    fetch('http://localhost:5000/gettingFriendsInfo/' + ownUserID)
        .then(response => response.json())
        .then(data => showing_friends(data['data']));
})

function showing_friends(data) {

    const main_div = document.getElementById('profile-container')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ username, fullName, Profile_Pic, user_ID, Location_Permission, location_req_sender }) {
        console.log(username);

        const new_div = document.createElement("div")
        if (Location_Permission === 'YES') {
            new_div.innerHTML =
                `<div class="sub-container">
                <div class="pic-class">
                    <img class="profile-pic" src="${Profile_Pic}" alt="">
                </div>
        
                <div id='user-${user_ID}' class="profile-details">
                    <div class="profile-name">${fullName}</div>
                    <div class="user-name">${username}</div>
                </div>
        
                <div class="status-button">
                    <button class="friends-button" data-id=${user_ID}>Cancel</button>
                </div>
            </div>
        
            <div id='view-location-${user_ID}' style='display:none; margin-bottom:30px'>
                
            </div>
            `
            main_div.appendChild(new_div);
            view_location(user_ID);
        }
        else if (Location_Permission === null) {
            new_div.innerHTML =
                `<div class="sub-container">
                                        <div class="pic-class">
                                            <img class="profile-pic" src="${Profile_Pic}" alt="">
                                        </div>
                                        <div class="profile-details">
                                            <div class="profile-name">${fullName}</div>
                                            <div class="user-name">${username}</div>
                                        </div>
                                        <div class="status-button">
                                            <button class="friends-button" data-id=${user_ID}>Share</button>
                                        </div>
                </div>
                `
                main_div.appendChild(new_div);
        }
        else if (Location_Permission === 'NO' && location_req_sender == ownUserID) {
            console.log('efe');
            new_div.innerHTML =
                `<div class="sub-container">
                                        <div class="pic-class">
                                            <img class="profile-pic" src="${Profile_Pic}" alt="">
                                        </div>
                                        <div class="profile-details">
                                            <div class="profile-name">${fullName}</div>
                                            <div class="user-name">${username}</div>
                                        </div>
                                        <div class="status-button">
                                            <button class="friends-button" data-id=${user_ID}>Pending</button>
                                        </div>
                </div>
                `
                main_div.appendChild(new_div);
        }
        else if (Location_Permission === 'NO' && location_req_sender == user_ID) {
            new_div.innerHTML =
                `<div class="sub-container">
                                        <div class="pic-class">
                                            <img class="profile-pic" src="${Profile_Pic}" alt="">
                                        </div>
                                        <div class="profile-details">
                                            <div class="profile-name">${fullName}</div>
                                            <div class="user-name">${username}</div>
                                        </div>
                                        <div class="status-button">
                                            <button class="friends-button" data-id=${user_ID}>Accept</button>
                                        </div>
                </div>
                `
                main_div.appendChild(new_div);
        }
        

    });
}

let x = document.querySelector('#profile-container')
if (x) {
    x.addEventListener('click', function (event) {
        const share = event.target.closest('.friends-button')
        if (share) {
            const otherUserID = share.dataset.id;

            if (share.innerHTML === 'Share') {
                fetch('http://localhost:5000/sendingLocationPermission/', {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({
                        ownUserID: ownUserID,
                        otherUserID: otherUserID,
                        x: 0
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            share.innerHTML = 'Pending';
                            
                            // Notification
                            location.reload();
                        }
                    })
            }
            else if (share.innerHTML === 'Pending' || share.innerHTML === 'Cancel') {
                fetch('http://localhost:5000/sendingLocationPermission/', {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({
                        ownUserID: ownUserID,
                        otherUserID: otherUserID,
                        x: 1
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            share.innerHTML = 'Share';
                            location.reload();
                        }
                    })
            }

            else if (share.innerHTML === 'Accept') {
                fetch('http://localhost:5000/sendingLocationPermission/', {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({
                        ownUserID: ownUserID,
                        otherUserID: otherUserID,
                        x: 2
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            share.innerHTML = 'Cancel';
                            // Notification
                            location.reload();
                        }
                    })
            }
        }
    })
}

function view_location(id){
    const x = document.getElementById('user-'+id);
    if(x){
        x.addEventListener('click', function(){
            const y = document.getElementById('view-location-'+id);
            y.style.display = 'block';
            
        fetch('http://localhost:5000/gettingSpecificLocation/' + id)
            .then(response => response.json())
            .then(data => view_map(data['data'], y));
        })
    }
}
function view_map(data, y){
    var latitude = data[0].Latitude;
    var longitude = data[0].Longitude;
    
    y.innerHTML = '<div>'+data[0].Date_Time+'</div><iframe width="500" height="400" src="https://maps.google.com/maps?q='+latitude+','+longitude+'&amp;z=15&amp;output=embed"></iframe>';

}
