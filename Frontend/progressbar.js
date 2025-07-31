
document.addEventListener("DOMContentLoaded", function () {
    let user_ID = localStorage.getItem('ownUserID'); 
    fetch("http://localhost:5000/getAllActivity/"+user_ID)
        .then((response) => response.json())
        .then((data) => loadAllActivity(data["data"]));

    
});



async function loadAllActivity(data) {

    var response = await fetch('http://localhost:5000/getUserName/' + localStorage.getItem('ownUserID'));
    var data1 = await response.json();

    console.log(data1.data[0].fullName);

    let totalClickCount = 0;
    console.log(data);

    
    totalClickCount += data[0]["Education and Informative"] + data[0].Technology + data[0].Games +data[0].Sports +data[0].Music +data[0].Politics +data[0]["Movies or TV shows"] +data[0].Lifestyle +data[0].Food +data[0].Business + data[0]["memes and humor"]


   console.log(totalClickCount);
   let percentage = Math.round(100/ totalClickCount);
    // console.log(data[0].Sports);
    const mainProgress_div = document.querySelector(".mainProgress-div");
    const newDiv = document.createElement("div");
    // newDiv.classList.add("feedSection");

    newDiv.innerHTML += `<div class="profile-div">
            <div class="profilePic"><img src="${data1.data[0].Profile_Pic}" alt=""></div>
            <div class="profileName">${data1.data[0].fullName}</div><br>
            <div>(me)</div>
            <div class="showForAll">
                <div class="showText"><h3>show:</h3> </div>
                <div class="btnShow" id="btnShow">OFF</div>
            </div>
        </div>`

    newDiv.innerHTML += `<div class="progressBar-div">
    <div class="nameOfProgress">Education and Informative</div>
    <div class="progressBar">
        <div class="progressStatus" id="Education-and-Informative">
            <div class="progressPercentage" id="educationPercentage">${data[0]["Education and Informative"]*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Technology</div>
    <div class="progressBar">
        <div class="progressStatus" id="technology">
            <div class="progressPercentage" id="technologyPercentage">${data[0].Technology*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Games</div>
    <div class="progressBar">
        <div class="progressStatus" id="games">
            <div class="progressPercentage" id="gamesPercentage">${data[0].Games*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Sports</div>
    <div class="progressBar">
        <div class="progressStatus" id="sports">
            <div class="progressPercentage" id="sportsPercentage">${data[0].Sports*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Music</div>
    <div class="progressBar">
        <div class="progressStatus" id="music">
            <div class="progressPercentage" id="musicPercentage">${data[0].Music*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Politics</div>
    <div class="progressBar">
        <div class="progressStatus" id="politics">
            <div class="progressPercentage" id="politicsPercentage">${data[0].Politics*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Movies or TV shows</div>
    <div class="progressBar">
        <div class="progressStatus" id="movies">
            <div class="progressPercentage" id="moviesPercentage">${data[0]["Movies or TV shows"]*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Lifestyle</div>
    <div class="progressBar">
        <div class="progressStatus" id="lifestyle">
            <div class="progressPercentage" id="lifestylePercentage">${data[0].Lifestyle*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Food</div>
    <div class="progressBar">
        <div class="progressStatus" id="food">
            <div class="progressPercentage" id="foodPercentage">${data[0].Food*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">Business</div>
    <div class="progressBar">
        <div class="progressStatus" id="business">
            <div class="progressPercentage" id="businessPercentage">${data[0].Business*percentage}</div>
        </div>
    </div>
</div>
<div class="progressBar-div">
    <div class="nameOfProgress">memes and humor</div>
    <div class="progressBar">
        <div class="progressStatus" id="memes">
            <div class="progressPercentage" id="memesPercentage">${data[0]["memes and humor"]*percentage}</div>
        </div>
    </div>
</div>`;

mainProgress_div.appendChild(newDiv);


    const education = document.getElementById("Education-and-Informative");
    const educationPercentage = document.getElementById("educationPercentage");
    const technology = document.getElementById("technology");
    const technologyPercentage = document.getElementById("technologyPercentage");
    const games = document.getElementById("games");
    const gamesPercentage = document.getElementById("gamesPercentage");
    const sports = document.getElementById("sports");
    const sportsPercentage = document.getElementById("sportsPercentage");
    const music = document.getElementById("music");
    const musicPercentage = document.getElementById("musicPercentage");
    const politics = document.getElementById("politics");
    const politicsPercentage = document.getElementById("politicsPercentage");
    const movie = document.getElementById("movies");
    const moviePercentage = document.getElementById("moviesPercentage");
    const lifestyle = document.getElementById("lifestyle");
    const lifestylePercentage = document.getElementById("lifestylePercentage");
    const food = document.getElementById("food");
    const foodPercentage = document.getElementById("foodPercentage");
    const business = document.getElementById("business");
    const businessPercentage = document.getElementById("businessPercentage");
    const memes = document.getElementById("memes");
    const memesPercentage = document.getElementById("memesPercentage");

    education.style.width = `${data[0]["Education and Informative"]*percentage}%`;
    educationPercentage.innerHTML = `${data[0]["Education and Informative"]*percentage}%`;
    technology.style.width = `${data[0].Technology*percentage}%`;
    technologyPercentage.innerHTML = `${data[0].Technology*percentage}%`;
    games.style.width = `${data[0].Games*percentage}%`;
    gamesPercentage.innerHTML = `${data[0].Games*percentage}%`;
    sports.style.width = `${data[0].Sports*percentage}%`;
    sportsPercentage.innerHTML = `${data[0].Sports*percentage}%`;
    music.style.width = `${data[0].Music*percentage}%`;
    musicPercentage.innerHTML = `${data[0].Music*percentage}%`;
    politics.style.width = `${data[0].Politics*percentage}%`;
    politicsPercentage.innerHTML = `${data[0].Politics*percentage}%`;
    movie.style.width = `${data[0]["Movies or TV shows"]*percentage}%`;
    moviePercentage.innerHTML = `${data[0]["Movies or TV shows"]*percentage}%`;
    lifestyle.style.width = `${data[0].Lifestyle*percentage}%`;
    lifestylePercentage.innerHTML = `${data[0].Lifestyle*percentage}%`;
    food.style.width = `${data[0].Food*percentage}%`;
    foodPercentage.innerHTML = `${data[0].Food*percentage}%`;
    business.style.width = `${data[0].Business*percentage}%`;
    businessPercentage.innerHTML = `${data[0].Business*percentage}%`;
    memes.style.width = `${data[0]["memes and humor"]*percentage}%`;
    memesPercentage.innerHTML = `${data[0]["memes and humor"]*percentage}%`;
}

const btnCheck = document.getElementById('btnShow');
if(btnCheck){
    btnCheck.addEventListener('click',function(){
        console.log('yes click');
        
        if(btnCheck.innerHTML === `ON`){
            btnCheck.innerHTML = `OFF`;
        }
        else{
            btnCheck.innerHTML = `ON`;
        }
    })
}