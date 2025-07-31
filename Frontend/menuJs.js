// // document.addEventListener("DOMContentLoaded",showMenu);


// function showMenu(){
    
//     const showMenu = document.getElementById("showMenuButton");
//     const navMenue = document.getElementById("nav-div");
//     // const nav = document.getElementById();
//     // showMenu.addEventListener("click",function(){
//     //     navMenue.classList.add("nave-div-Show");
//     //     console.log("yes1");
//     // });
//     console.log(showMenu.innerText);
//     if(showMenu.innerText=="="){
//         showMenu.innerText = "x";
//         console.log("yes00");
//         // showMenu.classList.add("MenueButton");
//         showMenu.style.color = "white";
//         showMenu.style.backgroundColor = "black";
//         navMenue.classList.add("nav-div-Show");
//     }
//     else if(showMenu.innerText=="x"){
//         showMenu.innerText="=";
//         // console.log("yes11");
//         showMenu.style.color = "black";
//         showMenu.style.backgroundColor = "white";
//         navMenue.classList.remove("nav-div-Show");
//     }
//     //  console.log("yes22");
// }
// function showFilter(){
    
//     const filterIcon = document.getElementById("filterIcon");
//     const navMenue = document.getElementById("ulList");
//     console.log(navMenue);

//     navMenue.classList.toggle("showUlList");
    
// }


// function submitPost(){
//     const submitButton = document.getElementById("postSubmitButton");
//     const myPostText = document.querySelector("#myPostText");
//     const fullFeedArea = document.querySelector(".fullFeedsArea");
//     // const feedSection = document.getElementById("feedSection");

//     // console.log(feedSection.className);

//     const newDiv = document.createElement("div");
//     newDiv.classList.add("feedSection");

//     newDiv.innerHTML = `<div class="feedsHeader">
//                                 <div class="feedsProfile">
//                                     <img src="ProfilePic.jpg" alt="" id="ownerPic">
//                                     <div class="nameAndTime">
//                                         <div class="feedOwnerName">Md.Rifat Hossain</div>
//                                         <div class="feedsTime">Time and Date</div>
//                                     </div>

//                                 </div>
//                                 <div class="feedsMenu">
//                                     <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
//                                 </div>
//                             </div>
//                             <div class="feedsMediaReaction">
//                                 <div class="feedsArea">
//                                     <details>
//                                         <summary id="feedsTitle">New Story!!</summary>
//                                         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure voluptas unde
//                                             atque hic ut
//                                             quaerat adipisci dignissimos voluptates quas, error dolorem officia nam
//                                             facere
//                                             consequuntur neque accusamus. Sapiente, consequuntur corporis?</p>
//                                     </details>
//                                 </div>
//                                 <div class="feedsMediaArea"></div>
//                                 <div class="feedReactionArea">
//                                     <div class="likeCommentShare">
//                                         <div class="feedsLike reactionArea">
//                                             <i class="fa-regular fa-thumbs-up likeIcon"></i>
//                                         </div>
//                                         <div class="feedsComment reactionArea">
//                                             <i class="fa-regular fa-comment commentIcon"></i>
//                                         </div>
//                                         <div class="share reactionArea">
//                                             <i class="fa-solid fa-share shareIcon"></i>
//                                         </div>
//                                     </div>
//                                     <div class="shareSave">
//                                         <div class="save">
//                                             <i class="fa-regular fa-bookmark saveIcon"></i>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>`
    
//     fullFeedArea.appendChild(newDiv);
//     console.log("yes");
    
// }

