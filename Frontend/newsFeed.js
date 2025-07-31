const image_url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/image/upload';
const video_url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/video/upload';
// const form = document.querySelector('form');



function fileUploadToCloudinary(postID) {
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
        if (name === "image")
            url = image_url;
        else if (name === "video")
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
                show_image(postID, imageUrl);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    alert('Your post has been uploaded');
}



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




// document.addEventListener("DOMContentLoaded",showMenu);
document.addEventListener('DOMContentLoaded', function () {

    fetch('http://localhost:5000/getAllPost')
        .then(response => response.json())
        .then(data => loadAllPost(data['data']));
})


function showMenu() {

    const showMenu = document.getElementById("showMenuButton");
    const navMenue = document.getElementById("nav-div");
    // const nav = document.getElementById();
    // showMenu.addEventListener("click",function(){
    //     navMenue.classList.add("nave-div-Show");
    //     console.log("yes1");
    // });
    console.log(showMenu.innerText);
    if (showMenu.innerText == "=") {
        showMenu.innerText = "x";
        console.log("yes00");
        // showMenu.classList.add("MenueButton");
        showMenu.style.color = "white";
        showMenu.style.backgroundColor = "black";
        navMenue.classList.add("nav-div-Show");
    }
    else if (showMenu.innerText == "x") {
        showMenu.innerText = "=";
        // console.log("yes11");
        showMenu.style.color = "black";
        showMenu.style.backgroundColor = "white";
        navMenue.classList.remove("nav-div-Show");
    }
    //  console.log("yes22");
}
function showFilter() {

    const filterIcon = document.getElementById("filterIcon");
    const navMenue = document.getElementById("ulList");
    // console.log(navMenue);

    navMenue.classList.toggle("showUlList");

}
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

async function submitPost() {
    console.log("hellooooo");
    const submitButton = document.getElementById("postSubmitButton");
    const myPostText = document.getElementById("myPostText").value;
    const fullFeedArea = document.querySelector(".fullFeedsArea");
    // const feedSection = document.getElementById("feedSection");
    // Caption,	content,Category_Name, Privacy
    // console.log(feedSection.className);
    var postSubstring;
    if (isMoreThanTenWords(myPostText)) {
        postSubstring = getFirstFiveWords(myPostText) + "....See more";
    }
    else {
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
    fetch('http://localhost:5000/getAllPost')
        .then(response => response.json())
        .then(data => loadAllPost(data['data']));
}


const x = document.querySelector('div.fullFeedsArea');

if (x) {
    x.addEventListener('click', function (event) {
        // console.log("yes");
        // Use closest() to find the nearest parent element with the 'feedsLike' class
        const likeElement = event.target.closest('.feedsLikeIcon');
        const disLikeElement = event.target.closest('.feedsDisLikeIcon');
        // const commentIcon = event.target.closest('.commentIcon');
        const activityClickCount = event.target.closest('.feedSection');


        const targetCommenTextBtn = event.target.closest('.commentSbt');

        // Ensure that a feedsLike element was clicked
        if (targetCommenTextBtn) {
            const postID = targetCommenTextBtn.id;
            const numericID = postID.split('-')[1]; 
            console.log('Numeric Post ID:', numericID);

            const commentText = document.getElementById("myCommentText-"+numericID).value;
            console.log(commentText);
            
            // const idString = targetCommenTextArea.value;  // Get the ID from the clicked element
            // console.log('Post ID:', postID); 
            // Log the ID (e.g., id-123)

            // Optionally, extract the actual numeric ID from the string (if needed)
            

            // console.log('Post ID:', postID);

            const response2 = fetch('http://localhost:5000/storePostCommentByViewrs', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    user_ID: localStorage.getItem('ownUserID'),
                    post_ID: numericID,
                    commentText: commentText

                })
            })
                .then(response2 => response2.json())
                .then(data => {
                })
                .catch(error => console.error('Error:', error));

            // const response = fetch('http://localhost:5000/insertUserPostActivity', {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     method: 'POST',
            //     body: JSON.stringify({
            //         user_ID: localStorage.getItem('ownUserIDLocal'),
            //         post_ID: postID,
            //         column: categoryName

            //     })
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //     })
            //     .catch(error => console.error('Error:', error));



            // Call deleteData with the numericID if needed
            // deleteData(numericID);
        }
        if (activityClickCount) {
            const idString = activityClickCount.id;  // Get the ID from the clicked element
            const parts = idString.split('-');

            // Extract the values
            const categoryName = parts[1]; // "News"
            const postID = parts[2];       // "12345"

            // Now you have Category_Name and post_ID
            console.log('Category Name:', categoryName);
            console.log('Post ID:', postID);

            const response2 = fetch('http://localhost:5000/incrementActivity', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    user_ID: localStorage.getItem('ownUserID'),
                    post_ID: postID,
                    column: categoryName

                })
            })
                .then(response2 => response2.json())
                .then(data => {
                })
                .catch(error => console.error('Error:', error));

            const response = fetch('http://localhost:5000/insertUserPostActivity', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    user_ID: localStorage.getItem('ownUserID'),
                    post_ID: postID,
                    column: categoryName

                })
            })
                .then(response => response.json())
                .then(data => {
                })
                .catch(error => console.error('Error:', error));



            // Call deleteData with the numericID if needed
            // deleteData(numericID);
        }


        // // Ensure that a feedsLike element was clicked
        // if (commentIcon) {
        //     const showComment = document.querySelector('.comment-class');
        //     const postID = showComment.id;  // Get the ID from the clicked element
        //     console.log('Post ID:', postID);
        //     // Log the ID (e.g., id-123)

        //     // Optionally, extract the actual numeric ID from the string (if needed)
        //     const numericID = postID.split('-')[1];
        //     console.log('Numeric Post ID:', numericID);
        //     const feedMenu = document.getElementById('commentDivId-' + post_id);

        //     // Toggle display between 'block' and 'none'
        //     if (feedMenu.style.display === 'block') {
        //         feedMenu.style.display = 'none';
        //     } else {
        //         feedMenu.style.display = 'block';
        //     }

        //     // Call deleteData with the numericID if needed
        //     // deleteData(numericID);
        // }
        if (likeElement) {
            const postID = likeElement.id;  // Get the ID from the clicked element
            console.log('Post ID:', postID);
            // Log the ID (e.g., id-123)

            // Optionally, extract the actual numeric ID from the string (if needed)
            const numericID = postID.split('-')[1];
            console.log('Numeric Post ID:', numericID);
            fetch('http://localhost:5000/updatePostLike/' + localStorage.getItem('userNameLocal'), {
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
                    if (data.success) {
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
            fetch('http://localhost:5000/updatePostDisLike/' + localStorage.getItem('userNameLocal'), {
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
                    if (data.success) {
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

            fetch(`http://localhost:5000/searchingReport/${ownUserID}/${post_id}`)
                .then(response => response.json())
                .then(data => sendPostReport(data['data'], post_id));
        }

        const checkSave = event.target.closest(".saveIcon");
        if (checkSave) {
            const post_id = (checkSave.id).split('-')[1];

            fetch(`http://localhost:5000/searchingSave/${ownUserID}/${post_id}`)
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

function saveOrUnsave(data, post_id) {
    if (data.length == 0) {
        fetch('http://localhost:5000/insertSavePost', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ ownUserID: ownUserID, post_id: post_id })
        })
            .then(response => response.json())
            .then(data => alert("Post has been saved"));
    }
    else {
        fetch(`http://localhost:5000/deleteSavedPost/${ownUserID}/${post_id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Post is removed from saved');
                }
            });
    }
}

function sendPostReport(data, post_ID) {
    if (data.length === 0) {
        console.log('hello');

        fetch('http://localhost:5000/insertNewReport', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ ownUserID: ownUserID, post_ID: post_ID })
        })
            .then(response => response.json())
            .then(data => alert("Your report will be considered"));

        document.getElementById('feedMenuID-' + post_ID).style.display = 'none';
        return;
    }

    alert("You've already reported this post");
    document.getElementById('feedMenuID-' + post_ID).style.display = 'none';
}
//change

function applyFilters() {
    // Get all checked checkboxes
    const selectedCategories = [];
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    checkboxes.forEach((checkbox) => {
        selectedCategories.push(checkbox.value);
    });
    console.log(selectedCategories);

    if(selectedCategories.length == 0){
        const fullFeedArea = document.querySelector(".fullFeedsArea");
        fullFeedArea.innerHTML = '';
        reloadingData();

        const navMenue = document.getElementById("ulList");
        navMenue.classList.toggle("showUlList");

        return;
    }

    // Send the selected categories to the backend to filter posts
    fetchFilteredPosts(selectedCategories);
    const navMenue = document.getElementById("ulList");
    navMenue.classList.toggle("showUlList");
}

function fetchFilteredPosts(categories) {
    console.log("Categories being sent to the server:", categories);
    // Make a POST request to send the selected categories to the server
    fetch('http://localhost:5000/filterPosts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: categories }), // Send selected categories as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log("Filtered Posts: ", data.data);
        loadAllPost(data['data']); // Call the function to load filtered posts
    })
    .catch(error => console.error('Error fetching filtered posts:', error));
}

// function filterFriendsPosts() {
//     // Make a POST request to get only the friends' posts
//     fetch('http://localhost:5000/filterFriedPosts', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ category: 'friends' }), // Send 'friends' as the category
//     })
//     .then(response => response.json())
//     .then(data => {
//         loadAllPost(data['data']); // Call function to load filtered posts
//     })
//     .catch(error => console.error('Error fetching friend posts:', error));
// }

async function loadAlarmDiv() {
    console.log("loadAlarmDiv.....");
    const fullFeedArea = document.querySelector(".fullFeedsArea");

    // Remove any existing alarm divs to prevent duplication
    const existingAlarmDiv = document.querySelector(".alarm_Div_emergency, .alarm_Div_normal");
    if (existingAlarmDiv) {
        fullFeedArea.removeChild(existingAlarmDiv);
    }

    var response3 = await fetch('http://localhost:5000/getAlarmDataForFeed/' + localStorage.getItem('ownUserID'));
    var data3 = await response3.json();
    // console.log(data3.data);

    if (data3.data.length > 0) {
        const alarmNotifyDiv = document.createElement("div");
        alarmNotifyDiv.innerHTML = ``;

        var formattedDate = data3.data[0].Created_Date.includes('T') ? data3.data[0].Created_Date.split('T')[0] : data3.data[0].Created_Date;
        var alarm_Date = decreaseOneDay(formattedDate);
        if (data3.data[0].alarm_level === "emergency") {
            alarmNotifyDiv.classList.add("alarm_Div_emergency");
            alarmNotifyDiv.innerHTML += `<div style="color: red; font-weight: bold; font-size: 20px;">Alarm: </div>`
        } else {
            alarmNotifyDiv.classList.add("alarm_Div_normal");
            alarmNotifyDiv.innerHTML += `<div style="font-weight: bold; font-size: 20px;">Alarm: </div>`
        }
        alarmNotifyDiv.innerHTML += `
            <div>Date: ${alarm_Date}</div>
            <div>Time: ${data3.data[0].Notify_Time}</div>
            <div>Message: ${data3.data[0].Content}</div>`

        fullFeedArea.appendChild(alarmNotifyDiv);
    }
}


// function autoReload(callback, interval) {
//     console.log("Auto reload started");  // Debugging log to ensure function is called

//     // Use setInterval to repeatedly call the callback function
//     setInterval(() => {
//         console.log("Calling function...");  // Debugging log to confirm it's running
//         callback();  // Call the passed function
//     }, interval);
// }

async function loadAllPost(data) {

    const fullFeedArea = document.querySelector(".fullFeedsArea");
    fullFeedArea.innerHTML = '';

    const newDiv = document.createElement("div");
    newDiv.classList.add("feedSection");
    // console.log(data);


    loadAlarmDiv();
    // startAutoReload();


    // var response3 = await fetch('http://localhost:5000/getAlarmDataForFeed/' + localStorage.getItem('ownUserID'));
    // var data3 = await response3.json();
    // // console.log(data3.data);
    // if (data3.data.length > 0) {
    //     const alarmNotifyDiv = document.createElement("div");

    //     var formattedDate = data3.data[0].Created_Date.includes('T') ? data3.data[0].Created_Date.split('T')[0] : data3.data[0].Created_Date;
    //     var alarm_Date = decreaseOneDay(formattedDate);
    //     if (data3.data[0].alarm_level === "emergency") {
    //         alarmNotifyDiv.classList.add("alarm_Div_emergency");
    //         alarmNotifyDiv.innerHTML += `<div style="color: red; font-weight: bold; font-size: 20px;">Alarm: </div>`
    //     }
    //     else {
    //         alarmNotifyDiv.classList.add("alarm_Div_normal");
    //         alarmNotifyDiv.innerHTML += `<div style="font-weight: bold; font-size: 20px;">Alarm: </div>`
    //     }
    //     alarmNotifyDiv.innerHTML += `
    //                                 <div>Date: ${alarm_Date}</div>
    //                                 <div>Time: ${data3.data[0].Notify_Time}</div>
    //                                 <div>Message: ${data3.data[0].Content}</div>`

    //     fullFeedArea.appendChild(alarmNotifyDiv);
    // }






    data.forEach(async function ({ post_ID, Caption, content, Category_Name, Created_Date, Like_Count, Dislike_Count, Views_Count, Comment_Count, Share_Count, Privacy, user_ID, Profile_Pic }) {
        // console.log(user_ID);



        var response = await fetch('http://localhost:5000/getUserName/' + user_ID);
        var data1 = await response.json();

        var response2 = await fetch('http://localhost:5000/getPostFile/' + post_ID);
        var data2 = await response2.json();

        var response3 = await fetch('http://localhost:5000/getPostComment/' + post_ID);
        var data3 = await response3.json();

        console.log(data3.data);

        var postFileHtmlPart1 = ''
        var postFileHtmlPart2 = ''
        var postFileHtmlPart3 = ''
        var postFileHtmlPart4 = ''
        var postFileHtmlPart5 = ''
        postFileHtmlPart1 += `<section class="container">
                            <div class="slider-wrapper">
                                <div class="slider">`

        postFileHtmlPart4 += `</div>
                            <div class="slider-nav">`

        // data2.forEach(function ({file_url}) {

        const imagePattern = /\.(png|jpg|jpeg|gif|bmp)$/i; // Regular expression for image formats
        for (var i = 0; i < data2.data.length; i++) {

            if (imagePattern.test(data2.data[i].file_url)) {
                // console.log("The file is an image");
                postFileHtmlPart2 += `<img id="slide-${post_ID}-${i + 1}" src="${data2.data[i].file_url}" alt="3D rendering of an imaginary orange planet in space" />`;
                postFileHtmlPart5 += `<a href="#slide-${post_ID}-${i + 1}"></a>`;
            } else {
                // console.log("The file is not an image");
                postFileHtmlPart3 += `<video id="slide-${post_ID}-${i + 1}" controls muted loop>
                                                        <source src="${data2.data[i].file_url}" type="video/mp4">
                                                        Your browser does not support the video tag.
                                                    </video>`;
                postFileHtmlPart5 += `<a href="#slide-${post_ID}-${i + 1}"></a>`;
            }



            // console.log(data2.data[i].file_url);
        }



        // });

        postFileHtmlPart5 += `</div>
                            </div>
                        </section>`

        postFileHtmlPart1 += postFileHtmlPart2 + postFileHtmlPart3 + postFileHtmlPart4 + postFileHtmlPart5;

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
        newDiv.id = `feedSection-${Category_Name}-${post_ID}`; 
        newDiv.innerHTML = `<div class="feedsHeader">
                                <div class="feedsProfile">
                                    <img src="${userPic}" alt="">
                                    <div class="nameAndTime">
                                        <div class="feedOwnerName">${userName}</div>
                                        <div class="feedsTime">${postDate + "&nbsp;&nbsp;&nbsp;&nbsp;" + time}</div>
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

        if (data2.data.length > 0) {
            newDiv.innerHTML += postFileHtmlPart1;
        }
        newDiv.innerHTML += `<div class="feedsMediaArea"></div>
                    <div class="feedReactionCount">
                            <div class="likeComment">
                                
                                <div class="feedsLike reactionArea">
                                    <div style="text-align: center;margin-left: 10px;">${Like_Count}</div>
                                
                                </div>
                                <div class="feedsLike reactionArea">
                                    <div style="text-align: center;margin-left: 20px;">${Dislike_Count}</div>
                                
                                </div>
                                <div class="feedsComment reactionArea">
                                    <div style="text-align: center;margin-left: 20px;"></div>
                                    
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

        let htmlContent = `<div class="comment-class" id="commentDivId-${post_ID}" >
                    
                <h3>Comments</h3>

                <div class="comment-input">
                    <div class="myComment">

                        <div class="commentText">
                            <textarea name="myCommentText" id="myCommentText-${post_ID}" class="myCommentText" placeholder="What's your comment?"></textarea>
                            <i class="fa-solid fa-location-arrow comment-submit commentSbt" id="commentSbt-${post_ID}"></i>
                        </div>

                    </div>
                </div>`
        data3.data.forEach(comment => {
            const dateObj = new Date(comment.time);

            // Extract the date in 'YYYY-MM-DD' format
            // const date = dateObj.toISOString().split('T')[0];
            var formattedDate = comment.time.includes('T') ? comment.time.split('T')[0] : comment.time;
            var commentDate = decreaseOneDay(formattedDate);
            const time = dateObj.toTimeString().split(' ')[0];

            htmlContent += `<div class="comments-container">
                                    <div class="profile-imgInComment">
                                        <img class="img" src="${comment.Profile_Pic}">
                                    </div>

                                    <div class="comment">
                                        <div class="name">
                                            <div class="profile-name">${comment.fullName}</div>
                                            <div class="comment_At">${commentDate}</div>
                                            <div class="comment_At">${time}</div>
                                        </div>

                                        <div class="post">${comment.Content}</div>
                                    </div>
                                </div>`

        })



        // htmlContent += `<div class="comments-container">
        //                 <div class="profile-imgInComment">
        //                     <img class="img" src="#">
        //                 </div>

        //                 <div class="comment">
        //                     <div class="name">
        //                         <div class="profile-name">Asif U. Ahmed</div>
        //                         <div class="comment_At">Date time</div>
        //                     </div>

        //                     <div class="post">Hi everyone, It's me, an annoying dickhead. I hate my life</div>
        //                 </div>
        //             </div>`

        htmlContent += `</div>`;  // Closing comment-class div

        // Now append the entire HTML content at once
        newDiv.innerHTML += htmlContent;


        fullFeedArea.appendChild(newDiv);
        // fullFeedArea.appendChild(newDiv);

        // Reattach event listeners for newly added slider-nav anchor tags
        document.querySelectorAll('.slider-nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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


//                  ASIF                    //

var username = localStorage.getItem("userNameLocal");
var ownUserID = localStorage.getItem("ownUserID");

// getting data related to current user

fetch('http://localhost:5000/gettingCurrentUserInfo/' + username)
    .then(response => response.json())
    .then(data => loadNewsFeedWithCurrentUser(data['data']));


function loadNewsFeedWithCurrentUser(data) {
    const user_profile_pic_id = document.getElementById('user-profile-pic');
    user_profile_pic_id.src = data[0].Profile_Pic;

    console.log(data[0].Profile_Pic);

    const user_profile_name_id = document.getElementById('user-profile-name');
    user_profile_name_id.innerText = data[0].fullName;

    const user_profile_username = document.getElementById('user-profile-username');
    user_profile_username.innerHTML = '@' + data[0].username;

    const myPostPic = document.getElementById('myPostPic');
    myPostPic.src = data[0].Profile_Pic;
}

const logout = document.getElementById('logout');
logout.addEventListener('click', function () {
    localStorage.setItem('userNameLocal', '');
    localStorage.setItem('ownUserID', 0);
    localStorage.setItem('otherUserName', '');
    localStorage.setItem('otherUserID', 0);
    window.close()

    window.open('../web page/LoginRegistrationPage.html')
})



function showFileNames(event) {
    const files = event.target.files;
    const fileList = Array.from(files).map(file => file.name).join(', ');
    document.getElementById('fileNames').textContent = fileList || '';
}

