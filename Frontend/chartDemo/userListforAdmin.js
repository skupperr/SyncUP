// document.addEventListener('DOMContentLoaded',function(){

// });

const dashboardBtnDiv = document.getElementById('dashboardBtnDiv');
dashboardBtnDiv.addEventListener('click', function(){
    document.getElementById("forDashboard").style.display = "block";
    document.getElementById("forUser").style.display = "none";
    document.getElementById("forPost").style.display = "none";
});

const userBtnDiv = document.getElementById('userBtnDiv');
userBtnDiv.addEventListener('click', function(){
    document.getElementById("forDashboard").style.display = "none";
    document.getElementById("forUser").style.display = "block";
    document.getElementById("forPost").style.display = "none";
    document.getElementById("forPrblmReport").style.display = "none";
    document.getElementById("forPostReport").style.display = "none";
});

const postBtnDiv = document.getElementById('postBtnDiv');
postBtnDiv.addEventListener('click', function(){
    document.getElementById("forDashboard").style.display = "none";
    document.getElementById("forUser").style.display = "none";
    document.getElementById("forPost").style.display = "block";
    document.getElementById("forPrblmReport").style.display = "none";
    document.getElementById("forPostReport").style.display = "none";
});

const prblmReportDiv = document.getElementById('prblmReportDiv');
prblmReportDiv.addEventListener('click', function(){
    document.getElementById("forDashboard").style.display = "none";
    document.getElementById("forUser").style.display = "none";
    document.getElementById("forPost").style.display = "none";
    document.getElementById("forPrblmReport").style.display = "block";
    document.getElementById("forPostReport").style.display = "none";
});

const postReportDiv = document.getElementById('postReportDiv');
postReportDiv.addEventListener('click', function(){
    document.getElementById("forDashboard").style.display = "none";
    document.getElementById("forUser").style.display = "none";
    document.getElementById("forPost").style.display = "none";
    document.getElementById("forPrblmReport").style.display = "none";
    document.getElementById("forPostReport").style.display = "block";
});