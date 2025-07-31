// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
// import { auth, db } from "lib/firebase";
// import { doc, setDoc } from "firebase/firestore"

import { auth, db } from "./lib/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const image_url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/image/upload';
const video_url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/video/upload';

function uploadBothPics(userID) {
    const profilePicInput = document.getElementById('profilePic').files[0];
    const coverPicInput = document.getElementById('coverPic').files[0];

    if (!profilePicInput && !coverPicInput) {
        alert("Choose profile photo & cover photo!!")
        return Promise.resolve(); // So it doesn't block registration
    }

    const uploadPromises = [];

    if (profilePicInput) {
        uploadPromises.push(fileUploadToCloudinary('profilePic', profilePicInput, userID));
    }

    if (coverPicInput) {
        uploadPromises.push(fileUploadToCloudinary('coverPic', coverPicInput, userID));
    }

    return Promise.all(uploadPromises); // Waits for all uploads to finish
}


function fileUploadToCloudinary(type, file, userID) {
    let name = file.type.split('/')[0];
    let url = name === "image" ? image_url : name === "video" ? video_url : '';

    if (!url) {
        console.error("Unsupported file type.");
        return Promise.resolve(); // Return a resolved promise so it doesn't block
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'm6rlhvol');

    return fetch(url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            let imageUrl = data.url;
            console.log(`${type} uploaded: ${imageUrl}`);
            show_image(type, imageUrl, userID);
            localStorage.setItem(`${type}Local`, imageUrl);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function show_image(type, imageUrl, userID) {
    let postID = type === "profilePic" ? "Profile Picture" : "Cover Picture";  // For simplicity, using type as the postID
    console.log("show image" + postID);
    console.log("show image" + imageUrl);
    if (type === "profilePic") {
        fetch("http://localhost:5000/insertRegistrationProfilePic", {
            headers: {
                "Content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ userID: userID, imageURL: imageUrl }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Image URL saved to the server:", data);
            })
            .catch((error) => {
                console.error("Error saving image URL:", error);
            });
    }
    if (type === "coverPic") {
        fetch("http://localhost:5000/insertRegistrationCoverPic", {
            headers: {
                "Content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ userID: userID, imageURL: imageUrl }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Image URL saved to the server:", data);
            })
            .catch((error) => {
                console.error("Error saving image URL:", error);
            });
    }


}



var userName = document.getElementById("UserName");
var Password = document.getElementById("UserPassword");
var LoginButton = document.getElementById("LoginButton");




LoginButton.addEventListener("click", async function (e) {
    e.preventDefault();

    // console.log(LoginButton.className);    
    // console.log(userName.value);
    // console.log(Password.value);

    const emailInput = userName.value;
    const pass = Password.value;

    const response = await fetch('http://localhost:5000/getAll');
    const data = await response.json();

    // Call the function findDuplicate() with the data and email1
    const count = findSameInfo(data, emailInput, pass);

    if(count==0){
        localStorage.setItem('userNameLocal', emailInput)
        userName.value= "";
        Password.value= "";

        window.close();
        window.open("../newsFeed/newsFeed.html");
    }
    else if (count == -5) {
        alert("Invalid Info!!!");
    }
    else {
        alert("Server problem!!!")
    }


});

var LoginForm = document.getElementById("RegistrationLink");
LoginForm.addEventListener("click", function () {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
})



function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

var Password1 = document.getElementById("UserPasswordOfRegistration");
var Password2 = document.getElementById("ConfirmPassword");
const login_passwordField = document.getElementById('login-showPass');
const registration_passwordField1 = document.getElementById('registration-showPass1');
const registration_passwordField2 = document.getElementById('registration-showPass2');
login_passwordField.addEventListener('click', () => {

    if (Password.type === 'password') {
        Password.type = 'text';  // Show password
        login_passwordField.classList.remove('fa-eye');
        login_passwordField.classList.add('fa-eye-slash');
    } else {
        Password.type = 'password';  // Hide password
        login_passwordField.classList.remove('fa-eye-slash');
        login_passwordField.classList.add('fa-eye');
    }
});
registration_passwordField1.addEventListener('click', () => {

    if (Password1.type === 'password') {
        Password1.type = 'text';  // Show password
        registration_passwordField1.classList.remove('fa-eye');
        registration_passwordField1.classList.add('fa-eye-slash');
    } else {
        Password1.type = 'password';  // Hide password
        registration_passwordField1.classList.remove('fa-eye-slash');
        registration_passwordField1.classList.add('fa-eye');
    }
});
registration_passwordField2.addEventListener('click', () => {

    if (Password2.type === 'password') {
        Password2.type = 'text';  // Show password
        registration_passwordField2.classList.remove('fa-eye');
        registration_passwordField2.classList.add('fa-eye-slash');
    } else {
        Password2.type = 'password';  // Hide password
        registration_passwordField2.classList.remove('fa-eye-slash');
        registration_passwordField2.classList.add('fa-eye');
    }
});


// function togglePassword() {
//     const passwordField = document.getElementById('UserPasswordOfRegistration');
//     const togglePasswordIcon = document.getElementById('togglePasswordIcon');

//     if (passwordField.type === 'password') {
//         passwordField.type = 'text';  // Show password
//         togglePasswordIcon.classList.remove('fa-eye');
//         togglePasswordIcon.classList.add('fa-eye-slash');  // Change icon to eye-slash
//     } else {
//         passwordField.type = 'password';  // Hide password
//         togglePasswordIcon.classList.remove('fa-eye-slash');
//         togglePasswordIcon.classList.add('fa-eye');  // Change icon back to eye
//     }
// }


RegistrationButton.addEventListener("click", async function (e) {
    e.preventDefault();

    var fullName = document.getElementById("FullName");
    var userNameR = document.getElementById("UserNameOfRegistration");
    var email = document.getElementById("email");
    var dateOfBirth = document.getElementById("dateOfBirth");
    var gender = document.querySelector('input[name="gender"]:checked');
    var Password1 = document.getElementById("UserPasswordOfRegistration");
    var Password2 = document.getElementById("ConfirmPassword");
    var RegistrationButton = document.getElementById("RegistrationButton");
    // console.log(fullName.value);
    // console.log(userNameR.value);
    // console.log(email.value);
    // console.log(dateOfBirth.value);
    // const gender = document.querySelector('input[name="gender"]:checked'); // Select the checked gender input
    var user_gender;
    if (gender) {
        user_gender = gender.value;
        // console.log(gender.value);  // Logs the selected gender ("male" or "female")
    } else {
        // console.log("No gender selected");
        // alert("Please select a gender!");  // Alert if no gender is selected
    }


    const fullname1 = fullName.value;
    const userName1 = userNameR.value;
    const email1 = email.value;
    const dateofbirth = dateOfBirth.value;
    // const user_gender = gender.value;
    const pass1 = Password1.value;
    const pass2 = Password2.value;

    const response = await fetch('http://localhost:5000/getAll');
    const data = await response.json();

    // Call the function findDuplicate() with the data and email1
    const count = findDuplicate(data, email1, userName1);
    // console.log("Count returned from findDuplicate:", count);
    // console.log("hello ",count);


    if (count == 0) {
        if (fullname1 == "" || userName1 == "" || email1 == "" || dateofbirth == "" || gender == null || pass1 == "" || pass2 == "") {
            alert("Full filled the form!!");
        }
        else if (!isValidEmail(email1)) {
            alert("use proper email address!!");
        }
        else if (pass1.length < 8) {
            alert("Password must be equal or more than 8 character!!")
        }
        else if (pass1 == pass2) {
            localStorage.setItem('userNameLocal', userName1)

            fullName.value = "";
            userNameR.value = "";
            email.value = "";
            dateOfBirth.value = "";
            const genderOptions = document.querySelectorAll('input[name="gender"]'); // Select all gender radio buttons
            genderOptions.forEach(option => option.checked = false);
            Password1.value = "";
            Password2.value = "";

            const response = fetch('http://localhost:5000/registration', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ fullName: fullname1, userName: userName1, email: email1, dateOfBirth: dateofbirth, gender: user_gender, pass1: pass1 })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.ID) {
                        localStorage.setItem('ownUserID', data.ID);
                        
                        uploadBothPics(data.ID)
                            .then(() => {
                                handleRegistration(e, fullname1, email1, pass1, userName1); 
                                alert("Registration Successful");
                            });
                    }
                })

            // localStorage.setItem('userFullNameLocal', fullname1);
            // localStorage.setItem('userEmailLocal', email1);
            // localStorage.setItem('userPasswordLocal', pass1);

            //window.open("../newsFeed/newsFeed.html");
        }
        else {
            alert("password are not same");
        }
    }
    else {

    }

})

var RegistrationForm = document.getElementById("loginLink");
RegistrationForm.addEventListener("click", function () {
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
})

///

///extra functions

///


async function handleRegistration(e, fullName, email, password, username) {
    e.preventDefault();

    try {
        var imgUrl = localStorage.getItem("profilePicLocal");

        // console.log("Full name: ",fullname);
        // console.log("Email: ",email);
        // console.log("Password: ",password);
        // console.log("Username: ",username);
        

        const res = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", res.user.uid), {
            fullName,
            username,
            email,
            avatar: imgUrl,
            id: res.user.uid,
            blocked: [],
        });

        await setDoc(doc(db, "userchats", res.user.uid), {
            chats: [],
        });

        console.log("User registered successfully!");

    } catch (error) {
        console.error("Registration error:", error);
    }
}

function findDuplicate(responseData, emailCheck, userNameCheck) {
    // console.log(responseData.data);
    const result = responseData.data;
    let count = 0;
    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        // console.log(element.Email);
        if (element.Email == emailCheck) {
            // console.log("exist");
            alert("Email already exist");
            count = -1;
            break;
        }
        else if (element.username == userNameCheck) {
            alert("User name already exist");
            count = -2;
            break;
        }

    }
    return count;
}

function findSameInfo(responseData, emailCheck, passCheck) {
    // console.log(responseData.data);
    const result = responseData.data;
    let count = -5;
    for (let index = 0; index < result.length; index++) {
        const element = result[index];

        // console.log(element.pass1);
        if ((element.Email == emailCheck || element.username == emailCheck) && element.Password == passCheck) {
            // console.log("exist");
            alert("Login Succesfully :)");
            localStorage.setItem('ownUserID', element.user_ID);

            localStorage.setItem('accountStatus', "oldUser");
            localStorage.setItem('userFullNameLocal', element.fullName);
            localStorage.setItem('userEmailLocal', element.Email);
            localStorage.setItem('userPasswordLocal', element.Password);
            localStorage.setItem('profilePicLocal', element.Profile_Pic);
            localStorage.setItem('coverPicLocal', element.cover_pic);

            count = 0;
            break;
        }
    }
    return count;
}





