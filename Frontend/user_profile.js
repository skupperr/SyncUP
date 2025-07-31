let x = document.getElementById("profile-share-button");
x.addEventListener('click', function () {
    let qr_area = document.getElementById("qr-code");
    qr_area.style.display = 'block';

    let container_id = document.getElementById("container")
    container_id.classList.add('containerFilter');
})

x = document.getElementById("cancel-button");
x.addEventListener('click', function () {
    let con = document.getElementById("qr-code");
    con.style.display = 'none';

    let container_id = document.getElementById("container");
    container_id.classList.remove('containerFilter');
})

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


    // About info
    fetch('http://localhost:5000/getAllWorkData/' + userID)
        .then(response => response.json())
        .then(data => loadWorkData(data['data']));

    fetch('http://localhost:5000/getAllEduData/' + userID)
        .then(response => response.json())
        .then(data => loadEduData(data['data']));

    fetch('http://localhost:5000/getAllAddressData/' + userID)
        .then(response => response.json())
        .then(data => loadAddressData(data['data']));

    fetch('http://localhost:5000/getAllLinksData/' + userID)
        .then(response => response.json())
        .then(data => loadLinksData(data['data']));
})


function loadUserProfileWithCurrentUser(data) {
    const user_profile_pic_id = document.getElementById('user-profile-pic');
    user_profile_pic_id.src = data[0].Profile_Pic;

    const user_post_pic_id = document.getElementById('myPostPic');
    user_post_pic_id.src = data[0].Profile_Pic;

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

function loadWorkData(data) {
    const main_div = document.getElementById('info-class')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ Role_ID, Company, Field, start_date, end_date, user_ID }) {
        const new_div = document.createElement("div")

        if (end_date === '') {
            new_div.innerHTML =
                `<div class="work-info">
                                    <div>
                                        <i class="fa-solid fa-briefcase" style="width: 20px; margin-right: 20px;"></i>
                                            ${Field} at ${Company}
                                    </div>
                </div>
                `
            main_div.appendChild(new_div);
        }
        else {
            new_div.innerHTML = `<div class="work-info">
                                    <div>
                                        <i class="fa-solid fa-briefcase" style="width: 20px; margin-right: 20px;"></i>
                                            Former ${Field} at ${Company}
                                    </div>
                                </div>
                                 `
            main_div.appendChild(new_div);
        }

    });
}

function loadEduData(data) {
    const main_div = document.getElementById('info-class')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ edu_list, Field, School, start_date, end_date, user_ID }) {
        const new_div = document.createElement("div")

        if (end_date === '') {
            new_div.innerHTML =
                `<div class="work-info">
                                    <div>
                                        <i class="fa-solid fa-graduation-cap" style="color: #000000 ;margin-right: 20px;"></i>
                                            Studying ${Field} at ${School} 
                                    </div>
                </div>
                `
            main_div.appendChild(new_div);
        }
        else {
            new_div.innerHTML = `<div class="work-info">
                                    <div>
                                        <i class="fa-solid fa-graduation-cap" style="color: #000000 ;margin-right: 20px;"></i>
                                            Studied ${Field} at ${School} 
                                    </div>
                                </div>
                                 `
            main_div.appendChild(new_div);
        }

    });
}
function loadAddressData(data) {
    const main_div = document.getElementById('info-class')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ list, present_address, start_date, end_date, user_ID }) {
        const new_div = document.createElement("div")

        if (end_date === '') {
            new_div.innerHTML =
                `<div class="work-info">
                                    <div>
                                        <i class="fa-solid fa-house" style="color: #000000 ;margin-right: 20px;"></i>
                                            Lives in ${present_address}
                                    </div>
                </div>
                `
            main_div.appendChild(new_div);
        }
        else {
            new_div.innerHTML = `<div class="work-info">
                                    <div>
                                        <i class="fa-solid fa-house" style="color: #000000 ;margin-right: 20px;"></i>
                                            Lived in ${present_address}
                                    </div>
                                </div>
                                 `
            main_div.appendChild(new_div);
        }

    });
}
function loadLinksData(data) {
    const main_div = document.getElementById('info-class')

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ link_id, link, site_name, user_ID }) {
        const new_div = document.createElement("div")
        new_div.innerHTML =
            `<div class="work-info">
                                    <div>
                                        <i class="fa-solid fa-link" style="color: #000000 ;margin-right: 20px;"></i>
                                            <a style="text-decoration:none; color:black" href="${link}" target="_blank">${site_name}</a>
                                    </div>
                </div>
                `
        main_div.appendChild(new_div);

    });
}





const image_url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/image/upload';
const video_url = 'https://api.cloudinary.com/v1_1/drxvggxwj/video/upload';
// const form = document.querySelector('form');

function show_image(postID, imageUrl) {
    console.log("show image" + postID);
    console.log("show image" + imageUrl);
  
    fetch("http://localhost:5000/insertPostFile", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ postID: postID, imageURL: imageUrl }),
    }).then((response) => response.json());
  }

function fileUploadToCloudinary(postID){
    // e.preventDefault();
    console.log("cooudinary");
    let imageUrl = '';

    const files = document.querySelector('[type=file]').files;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        let name = file.type;
        name = name.split('/')[0];

        let url = '';
        if(name === "image")
            url = image_url;
        else if(name === "video")
            url = video_url;

        formData.append('file', file);
        formData.append('upload_preset', 'm6rlhvol');

        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json()) // parse the response as JSON
            .then((data) => {
                imageUrl = data.url; // get the image URL
                console.log(imageUrl);
                show_image(postID,imageUrl);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    alert('Your post has been uploaded');
}


document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAllPostPerOwner/'+userID)
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

async function submitPost(){
    console.log("hellooooo");
    const submitButton = document.getElementById("postSubmitButton");
    const myPostText = document.getElementById("myPostText").value;
    const fullFeedArea = document.querySelector(".fullFeedsArea");
    // const feedSection = document.getElementById("feedSection");
    // Caption,	content,Category_Name, Privacy
    // console.log(feedSection.className);
    var postSubstring ;
    if(isMoreThanTenWords(myPostText)){
        postSubstring = getFirstFiveWords(myPostText)+"....See more";
    }
    else{
        postSubstring = getFirstFiveWords(myPostText);
    }
    
    // console.log(postSubstring);
    let selectPrivacyElement = document.getElementById("privacy-option");
    let privacySelectedValue = selectPrivacyElement.value; // Get the value of the selected option
    let selectCategoryElement = document.getElementById("category-option");
    let categorySelectedValue = selectCategoryElement.value; // Get the value of the selected option
    // document.getElementById("output").innerText = "Selected option: " + selectedValue;
    // console.log(privacySelectedValue);
    // console.log(categorySelectedValue);

    // const response =  fetch('http://localhost:5000/addPost/'+localStorage.getItem('userNameLocal'), {
    //             headers:{
    //                 'Content-type' : 'application/json'
    //             },
    //             method: 'POST',
    //             body: JSON.stringify({Caption:postSubstring,content: myPostText,Category_Name: categorySelectedValue, Privacy: privacySelectedValue })
    //         })
    //         .then(response => response.json())
    //         .then(data=> console.log("postId:: "+data));
    const response = fetch('http://localhost:5000/addPost/' + localStorage.getItem('userNameLocal'), {
    headers: {
        'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
        Caption: postSubstring,
        content: myPostText,
        Category_Name: categorySelectedValue,
        Privacy: privacySelectedValue
    })
})
    .then(response => response.json())
    .then(data => {
        if (data.postID) {
            console.log("Post ID:", data.postID); // Access the postID here
            fileUploadToCloudinary(data.postID)

        } else {
            console.error("Error creating post:", data.error);
        }
    })
    .catch(error => console.error('Error:', error));

            
    // const newDiv = document.createElement("div");
    // newDiv.classList.add("feedSection");

    // newDiv.innerHTML = `<div class="feedsHeader">
    //                             <div class="feedsProfile">
    //                                 <img src="ProfilePic.jpg" alt="">
    //                                 <div class="nameAndTime">
    //                                     <div class="feedOwnerName">Md.Rifat Hossain</div>
    //                                     <div class="feedsTime">Time and Date</div>
    //                                 </div>
                                    
    //                             </div>
    //                             <div class="feedsMenu">
    //                                 <button >:</button>
    //                             </div>
    //                         </div>
    //                         <div class="feedsMediaReaction">
    //                             <div class="feedsArea">
    //                                 <details>
    //                                     <summary>${postSubstring}</summary>
    //                                     <p>${myPostText}</p>
    //                                 </details>
    //                             </div>
    //                             <div class="feedsMediaArea"></div>
    //                             <div class="feedReactionArea">
    //                                 <div class="likeComment">
    //                                     <div class="feedsLike reactionArea">
    //                                         <i class="fa-regular fa-thumbs-up likeIcon"></i>
    //                                     </div>
    //                                     <div class="feedsComment reactionArea">
    //                                         <i class="fa-regular fa-comment commentIcon"></i>
    //                                     </div>
    //                                 </div>
    //                                 <div class="shareSave">
    //                                     <div class="share reactionArea">
    //                                         <i class="fa-solid fa-share shareIcon"></i>
    //                                     </div>
    //                                     <div class="save reactionArea">
    //                                         <i class="fa-regular fa-bookmark saveIcon"></i>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>`
    
    // fullFeedArea.appendChild(newDiv);
    // console.log("yes");
    document.getElementById("myPostText").value = ""
    reloadingData();
    
}

function reloadingData() {
    fetch('http://localhost:5000/getAllPostPerUser/'+userID)
        .then(response => response.json())
        .then(data => loadAllPost(data['data']));
}


const y = document.querySelector('div.fullFeedsArea');

if (y) {
    y.addEventListener('click', function(event) {
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

            fetch(`http://localhost:5000/DeletePost/${userID}/${post_id}` , {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    location.reload();
                }
            });

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



async function loadAllPost(data) {
    


    const newDiv = document.createElement("div");
    newDiv.classList.add("feedSection");
    // console.log(data);
    

    const fullFeedArea = document.querySelector(".fullFeedsArea");
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
        var postDate = decreaseOneDay(formattedDate);
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
                    Delete Post
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
