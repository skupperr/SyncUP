
var userName = document.getElementById("UserName");
var Password = document.getElementById("UserPassword");
var LoginButton = document.getElementById("LoginButton");
   

// document.addEventListener('DOMContentLoaded',function(){
//     fetch('http://localhost:5000/getAdminInfo')
//     .then(response => response.json())
//     .then(data=>console.log(data));
    
    
// })

// function loadHTML(data){
//     console.log(data);
// }

    
LoginButton.addEventListener("click", async function(e){
    e.preventDefault();
    
    console.log(LoginButton.className);    
    console.log(userName.value);
    console.log(Password.value);

    const emailInput = userName.value;
    const pass = Password.value;

    const response = await fetch('http://localhost:5000/getAdminInfo');
    const data = await response.json();
    
    // Call the function findDuplicate() with the data and email1
    const count = findSameInfo(data, emailInput, pass);

    if(count==0){
        localStorage.setItem('userNameLocal', emailInput)
        userName.value= "";
        Password.value= "";

        window.open("allBooks.html");
    }
    else if(count ==-5){
        alert("Invalid Info!!!");
    }
    else{
        alert("Server problem!!!")
    }

    // fetch('http://localhost:5000/insert', {
    //     headers:{
    //         'Content-type' : 'application/json'
    //     },
    //     method: 'POST',
    //     body: JSON.stringify({name: nameInput, pass: pass })
    // })
    // .then(response => response.json())
    // .then(data=> console.log(data));


    // const result = await login(userName.value,Password.value);
    // console.log(result);
});

// var LoginForm = document.getElementById("RegistrationLink");
// LoginForm.addEventListener("click",function(){
//     document.getElementById("loginForm").style.display="none";
//     document.getElementById("registrationForm").style.display="block";
// })



// var fullName = document.getElementById("FullName");
// var userNameR = document.getElementById("UserNameOfRegistration");
// var email = document.getElementById("email");
// var dateOfBirth = document.getElementById("dateOfBirth");
// var Password1 = document.getElementById("UserPasswordOfRegistration");
// var Password2 = document.getElementById("ConfirmPassword");
// var RegistrationButton = document.getElementById("RegistrationButton");


// RegistrationButton.addEventListener("click", async function(e){
//     e.preventDefault();
        
//     console.log(fullName.value);
//     console.log(userNameR.value);
//     console.log(email.value);
//     console.log(dateOfBirth.value);
//     console.log(Password1.value);

//     const fullname1 = fullName.value;
//     const userName1 = userNameR.value;
//     const email1 = email.value;
//     const dateofbirth = dateOfBirth.value;
//     const pass1 = Password1.value; 
//     const pass2 = Password2.value; 

//     const response = await fetch('http://localhost:5000/getAll');
//     const data = await response.json();
    
//     // Call the function findDuplicate() with the data and email1
//     const count = findDuplicate(data, email1, userName1);
//     console.log("Count returned from findDuplicate:", count);
//     console.log("hello ",count);
    

//     if(count == 0){
//         if(fullname1 == "" || userName1== "" || email1 == "" || dateofbirth == "" || pass1 == "" || pass2 == ""){
//             alert("Full filled the form!!");
//         }
//         else if(pass1 == pass2){
//             localStorage.setItem('userNameLocal', userName1)
            
//             fullName.value ="";
//             userNameR.value ="";
//             email.value ="";
//             dateOfBirth.value ="";
//             Password1.value =""; 
//             Password2.value =""; 
    
//             const response =  fetch('http://localhost:5000/insert2', {
//                 headers:{
//                     'Content-type' : 'application/json'
//                 },
//                 method: 'POST',
//                 body: JSON.stringify({fullName:fullname1,userName: userName1,email: email1, dateOfBirth: dateofbirth , pass1: pass1})
//             })
//             .then(response => response.json())
//             .then(data=> console.log(data));
//             alert("Registration Succesfull");
//             window.open("memberPage.html");
//         }
//         else{
//             alert("password are not same");
//         }
//     }
//     else{

//     }
    
// })

// var RegistrationForm = document.getElementById("loginLink");
// RegistrationForm.addEventListener("click",function(){
//     document.getElementById("registrationForm").style.display="none";
//     document.getElementById("loginForm").style.display="block";
// })

// ///

// ///extra functions

// ///

// function findDuplicate(responseData,emailCheck,userNameCheck){
//     console.log(responseData.data);
//     const result = responseData.data;
//     let count = 0;
//     for (let index = 0; index < result.length; index++) {
//         const element = result[index];
//         console.log(element.Email);
//         if (element.Email == emailCheck){
//             // console.log("exist");
//             alert("Email already exist");
//             count=-1;
//             break;
//         }
//         else if(element.userName == userNameCheck){
//             alert("User name already exist");
//             count=-2;
//             break;
//         }
        
//     }
//     return count;
// }

function findSameInfo(responseData,emailCheck,passCheck){
    // console.log(responseData.data);
    const result = responseData.data;
    let count = -5;
    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element.Email);
        console.log(element.pass1);
        if ((element.email == emailCheck || element.userName == emailCheck) && element.password == passCheck){
            // console.log("exist");
            alert("Login Succesfully :)");
            count=0;
            break;
        }
        // else if(element.pass1 == passCheck){
        //     alert("User name already exist");
        //     count=-2;
        //     break;
        // }
        
    }
    return count;
}


    



