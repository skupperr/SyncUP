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




// document.addEventListener("DOMContentLoaded",showMenu);
document.addEventListener('DOMContentLoaded', function () {
    fetch(`http://localhost:5000/getAllSavedPost/${userID}`)
        .then(response => response.json())
        .then(data => loadAllPost(data['data']));
})


function getFirstFiveWords(inputText) {
    let wordsArray = inputText.split(" "); // Split the string by spaces to create an array of words
    let firstFiveWords = wordsArray.slice(0, 10); // Extract the first 5 words
    return firstFiveWords.join(" "); // Join the words back into a string
}
function isMoreThanTenWords(str) {
    // Split the string into words based on spaces
    const words = str.trim().split(/\s+/);
    
    // Check if the length of the array is more than 10
    return words.length > 10;
}

function reloadingData() {
    fetch(`http://localhost:5000/getAllSavedPost/${userID}`)
        .then(response => response.json())
        .then(data => loadAllPost(data['data']));
}


const x = document.querySelector('div.fullFeedsArea');

if (x) {
    x.addEventListener('click', function(event) {
        // console.log("yes");
        // Use closest() to find the nearest parent element with the 'feedsLike' class
        const likeElement = event.target.closest('.feedsLikeIcon');
        const disLikeElement = event.target.closest('.feedsDisLikeIcon');

        // Ensure that a feedsLike element was clicked
        if (likeElement) {
            const postID = likeElement.id;  // Get the ID from the clicked element
            console.log('Post ID:', postID); 
            // Log the ID (e.g., id-123)

            // Optionally, extract the actual numeric ID from the string (if needed)
            const numericID = postID.split('-')[1]; 
            console.log('Numeric Post ID:', numericID);
            fetch('http://localhost:5000/updatePostLike/'+localStorage.getItem('userNameLocal'), {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH', 
            body: JSON.stringify({ 
                post_ID: numericID
            })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    reloadingData();
                }
            })

            // Call deleteData with the numericID if needed
            // deleteData(numericID);
        }
        if (disLikeElement) {
            const postID = disLikeElement.id;  // Get the ID from the clicked element
            console.log('Post ID:', postID); 
            // Log the ID (e.g., id-123)

            // Optionally, extract the actual numeric ID from the string (if needed)
            const numericID = postID.split('-')[1]; 
            console.log('Numeric Post ID:', numericID);
            fetch('http://localhost:5000/updatePostDisLike/'+localStorage.getItem('userNameLocal'), {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH', 
            body: JSON.stringify({ 
                post_ID: numericID
            })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    reloadingData();
                }
            })

            // Call deleteData with the numericID if needed
            // deleteData(numericID);
        }
    });
}


const div1 = document.getElementById('fullFeedsArea');

if (div1) {
    div1.addEventListener('click', function (event) {
        const checkurl = event.target.closest(".report-class");
        if (checkurl) {
            const post_id = (checkurl.id).split('-')[1];
            
            fetch(`http://localhost:5000/searchingReport/${userID}/${post_id}`)
                .then(response => response.json())
                .then(data => sendPostReport(data['data'], post_id));
        }

        const checkSave = event.target.closest(".saveIcon");
        if(checkSave){
            const post_id = (checkSave.id).split('-')[1];
            
            fetch(`http://localhost:5000/searchingSave/${userID}/${post_id}`)
                .then(response => response.json())
                .then(data => saveOrUnsave(data['data'], post_id));
        }
    })

    div1.addEventListener('click', function (event) {
        const checkurl = event.target.closest(".report-show");
        if (checkurl) {
            const post_id = (checkurl.id).split('-')[1];
            const feedMenu = document.getElementById('feedMenuID-' + post_id);
    
            // Toggle display between 'block' and 'none'
            if (feedMenu.style.display === 'block') {
                feedMenu.style.display = 'none';
            } else {
                feedMenu.style.display = 'block';
            }
        }
    });
}

function saveOrUnsave(data, post_id){
    if(data.length == 0){
        fetch('http://localhost:5000/insertSavePost', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ ownUserID:userID, post_id: post_id })
        })
            .then(response => response.json())
            .then(data => alert("Post has been saved"));
    }
    else{
        fetch(`http://localhost:5000/deleteSavedPost/${userID}/${post_id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                alert('Post is removed from saved');
            }
        });
    }
}

function sendPostReport(data, post_ID){
    if(data.length === 0){
        console.log('hello');
        
        fetch('http://localhost:5000/insertNewReport', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ownUserID : userID, post_ID: post_ID })
        })
            .then(response => response.json())
            .then(data => alert("Your report will be considered"));
        
            document.getElementById('feedMenuID-'+post_ID).style.display = 'none';
        return;
    }

    alert("You've already reported this post");
    document.getElementById('feedMenuID-'+post_ID).style.display = 'none';
}


async function loadAllPost(data) {
    
    const fullFeedArea = document.querySelector(".fullFeedsArea");

    const newDiv = document.createElement("div");
    newDiv.classList.add("feedSection");
    // console.log(data);
    




    
    data.forEach(async function ({post_ID,Caption,content,Category_Name,Created_Date,Like_Count,Dislike_Count,Views_Count,Comment_Count,Share_Count,Privacy,user_ID, Profile_Pic}) {
        // console.log(user_ID);



        var response = await fetch('http://localhost:5000/getUserName/'+user_ID);
        var data1 = await response.json();

        var response2 = await fetch('http://localhost:5000/getPostFile/' + post_ID);
        var data2 = await response2.json();
        // console.log(data2.data.length);

        var postFileHtmlPart1 = ''
        var postFileHtmlPart2 = ''
        var postFileHtmlPart3 = ''
        var postFileHtmlPart4 = ''
        var postFileHtmlPart5 = ''
        postFileHtmlPart1+=`<section class="container">
                            <div class="slider-wrapper">
                                <div class="slider">`

        postFileHtmlPart4+=`</div>
                            <div class="slider-nav">`              

        // data2.forEach(function ({file_url}) {
            
        const imagePattern = /\.(png|jpg|jpeg|gif|bmp)$/i; // Regular expression for image formats
        for(var i=0;i<data2.data.length;i++){

            if (imagePattern.test(data2.data[i].file_url)) {
                // console.log("The file is an image");
                postFileHtmlPart2 += `<img id="slide-${post_ID}-${i+1}" src="${data2.data[i].file_url}" alt="3D rendering of an imaginary orange planet in space" />`;
                postFileHtmlPart5 += `<a href="#slide-${post_ID}-${i+1}"></a>`;
            } else {
                // console.log("The file is not an image");
                postFileHtmlPart3 += `<video id="slide-${post_ID}-${i+1}" controls muted loop>
                                                        <source src="${data2.data[i].file_url}" type="video/mp4">
                                                        Your browser does not support the video tag.
                                                    </video>`;
                postFileHtmlPart5 += `<a href="#slide-${post_ID}-${i+1}"></a>`;
            }
            

            
            // console.log(data2.data[i].file_url);
        }
            
                                        
            
        // });

        postFileHtmlPart5+= `</div>
                            </div>
                        </section>`

        postFileHtmlPart1 += postFileHtmlPart2 + postFileHtmlPart3 + postFileHtmlPart4 + postFileHtmlPart5;
        // console.log(postFileHtmlPart1);
        // postFileHtmlPart2 += ;
        // postFileHtmlPart3 += ;
        // postFileHtmlPart4 += ;
        // postFileHtmlPart5 += ;

        // if (data2 && data2.length > 0) {
        //     console.log(data2);
        // } else {
        //     console.log('No data found for the given post_ID.');
        // }
        // console.log("image: "+post_ID);
        // console.log(data2);

        // console.log(Created_Date);

        // var formattedDate = Created_Date.includes('T') ? Created_Date.split('T')[0] : Created_Date;
        // var postDate = decreaseOneDay(formattedDate);
        const dateObj = new Date(Created_Date);

        // Extract the date in 'YYYY-MM-DD' format
        // const date = dateObj.toISOString().split('T')[0];
        var formattedDate = Created_Date.includes('T') ? Created_Date.split('T')[0] : Created_Date;
        var postDate = formattedDate;
        const time = dateObj.toTimeString().split(' ')[0];

        var userName = data1.data[0].fullName;
        var userPic = data1.data[0].Profile_Pic;
        // console.log("hello");
        const newDiv = document.createElement("div");
        newDiv.classList.add("feedSection");
        newDiv.innerHTML = `<div class="feedsHeader">
                                <div class="feedsProfile">
                                    <img src="${userPic}" alt="">
                                    <div class="nameAndTime">
                                        <div class="feedOwnerName">${userName}</div>
                                        <div class="feedsTime">${postDate+ "&nbsp;&nbsp;&nbsp;&nbsp;"+time}</div>
                                    </div>
                                    
                                </div>

                                <div style="position: relative;" class="feedsMenu">
                                        <div class="report-class" id="feedMenuID-${post_ID}" style="display:none;">
                                            Report Post
                                        </div>
                                        <button class="report-show" id="reportShow-${post_ID}">:</button>
                                </div>

                    
                            </div>
                            <div class="feedsMediaReaction">
                                <div class="feedsArea">
                                    <details>
                                        <summary>${Caption}</summary>
                                        <p>${content}</p>
                                    </details>
                                </div>`

        if(data2.data.length>0){
            newDiv.innerHTML += postFileHtmlPart1;
        }
            newDiv.innerHTML+=`<div class="feedsMediaArea"></div>
                    <div class="feedReactionCount">
                            <div class="likeComment">
                                
                                <div class="feedsLike reactionArea">
                                    <div style="text-align: center;margin-left: 10px;">${Like_Count}</div>
                                
                                </div>
                                <div class="feedsLike reactionArea">
                                    <div style="text-align: center;margin-left: 20px;">${Dislike_Count}</div>
                                
                                </div>
                                <div class="feedsComment reactionArea">
                                    <div style="text-align: center;margin-left: 20px;">${Comment_Count}</div>
                                    
                                </div>
                            </div>
                            <div class="shareSave">
                                <div class="share reactionArea">
                            
                                </div>
                                <div class="save reactionArea">
                                
                                </div>
                            </div>
                        </div>
                        <div class="feedReactionArea">
                            <div class="likeComment likecCommentIcon">
                                
                                <div class="feedsLike reactionArea feedsLikeIcon" id = "likeId-${post_ID}">
                                    
                                    <i class="fa-regular fa-thumbs-up likeIcon"></i>
                                </div>
                                <div class="feedsLike reactionArea feedsDisLikeIcon" id = "disLikeId-${post_ID}">
                                    
                                    <i class="fa-regular fa-thumbs-down dislikeIcon"></i>
                                </div>
                                <div class="feedsComment reactionArea">
                                    
                                    <i class="fa-regular fa-comment commentIcon"></i>
                                </div>
                            </div>
                            <div class="shareSave">
                                <div class="share reactionArea">
                                    <i class="fa-solid fa-share shareIcon"></i>
                                </div>
                                <div class="save reactionArea">
                                    <i class="fa-regular fa-bookmark saveIcon" id="save-${post_ID}"></i>
                                </div>
                            </div>
                        </div>
                </div>`;
                fullFeedArea.appendChild(newDiv);
                // fullFeedArea.appendChild(newDiv);

                // Reattach event listeners for newly added slider-nav anchor tags
                document.querySelectorAll('.slider-nav a').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        // Prevent the default anchor click behavior
                        e.preventDefault();

                        // Get the ID of the slide to scroll to
                        const targetId = this.getAttribute('href').substring(1);

                        // Scroll to the selected slide inside the slider
                        document.getElementById(targetId).scrollIntoView({
                            behavior: 'smooth',  // Smooth scrolling effect
                            block: 'nearest',    // Make sure the target element is shown
                            inline: 'start'      // Aligns the slide to the start
                        });
                    });
                });
        });

        // reloadingData();

}

function decreaseOneDay(dateString) {
    // Create a Date object from the input string (assumed in 'YYYY-MM-DD' format)
    const date = new Date(dateString);

    // Add one day to the date
    date.setDate(date.getDate() + 1);

    // Format back to 'YYYY-MM-DD'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


