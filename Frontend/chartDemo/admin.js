// function reloadUserStatistics(data) {
//     console.log(data);

// }



// document.addEventListener('DOMContentLoaded', function () {
//     fetch('http://localhost:5000/userStatistics')
//         .then(response => response.json())
//         .then(data => reloadUserStatistics(data['data']));
// })


let chart;  // Declare a global variable to hold the chart instance

document.addEventListener('DOMContentLoaded', function () {
  // Initial chart load
  loadChartData();
});

function loadChartData() {
  // Fetch data from backend
  fetch('http://localhost:5000/userStatistics')
    .then(response => response.json())
    .then(data => {
      const userData = data.data;
      const categories = userData.map(entry => entry.month);
      const series1 = userData.map(entry => entry.total_users);
      const series2 = userData.map(entry => entry.male_users);
      const series3 = userData.map(entry => entry.female_users);

      const totalUsers = series1.reduce((sum, current) => sum + current, 0);
      const totalMaleUsers = series2.reduce((sum, current) => sum + current, 0);
      const totalFemaleUsers = series3.reduce((sum, current) => sum + current, 0);

      // Define chart options
      var options = {
        series: [{
          name: `Total Users: ${totalUsers}`,
          data: series1
        }, {
          name: `Male Users: ${totalMaleUsers}`,
          data: series2
        }, {
          name: `Female Users: ${totalFemaleUsers}`,
          data: series3
        }],
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'category',
          categories: categories
        },
        tooltip: {
          x: {
            format: 'yyyy-MM'
          },
        },
      };

      // Render the chart
      if (chart) {
        chart.destroy();  // Destroy the previous chart if it exists
      }

      chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    })
    .catch(error => console.error('Error fetching user statistics:', error));
}

function reloadChartData() {
  loadChartData();  // Re-fetch and re-render the chart
}

const dashboardBtnDiv = document.getElementById('dashboardBtnDiv');
dashboardBtnDiv.addEventListener('click', function () {
  document.getElementById("forDashboard").style.display = "block";
  document.getElementById("forUser").style.display = "none";
  document.getElementById("forPost").style.display = "none";
  document.getElementById("forPrblmReport").style.display = "none";
  document.getElementById("forPostReport").style.display = "none";

  dashboardBtnDiv.classList.add("changeBtnColor");
  userBtnDiv.classList.remove("changeBtnColor");
  postBtnDiv.classList.remove("changeBtnColor");
  problemBtnDiv.classList.remove("changeBtnColor");
  reloadChartData();
});

// 
// userPart
// 
const userBtnDiv = document.getElementById('userBtnDiv');
let allUsers = [];  // To store the fetched user data

userBtnDiv.addEventListener('click', async function () {
  document.getElementById("forDashboard").style.display = "none";
  document.getElementById("forUser").style.display = "block";
  document.getElementById("forPost").style.display = "none";
  document.getElementById("forPrblmReport").style.display = "none";
  document.getElementById("forPostReport").style.display = "none";

  dashboardBtnDiv.classList.remove("changeBtnColor");
  userBtnDiv.classList.add("changeBtnColor");
  postBtnDiv.classList.remove("changeBtnColor");
  problemBtnDiv.classList.remove("changeBtnColor");
  postReportBtnDiv.classList.remove("changeBtnColor");

  // Fetch user data
  const response = await fetch('http://localhost:5000/getAll');
  const data1 = await response.json();

  // const response2 = await fetch('http://localhost:5000/getAllPost');
  // const data2 = await response2.json();
  // console.log(data2);

  // Store all users for future filtering
  allUsers = data1.data;

  // Initially display all users
  displayUsers(allUsers);
});

// Function to display users in the DOM
function displayUsers(users) {
  const user_List_div = document.getElementById('userListMainDiv');
  user_List_div.innerHTML = ``; // Clears the div to avoid duplicates

  const displayTotalUserShow = document.querySelector("#displayTotalUser h1");
  console.log(displayTotalUserShow.innerHTML);
  displayTotalUserShow.innerHTML = `Total : ${users.length}`

  // Iterate over all users and append them to the div
  users.forEach(user => {
    const userList = document.createElement('div');
    userList.classList.add('userListForAdmin');
    // console.log(user.fullName);

    userList.innerHTML = `
              <span>User ID: ${user.user_ID} &nbsp;&nbsp;&nbsp;&nbsp; Username: ${user.username}</span>
              <div>Full Name: ${user.fullName}</div>
              <button class="delete-alarm" id="alarmDelete-${user.user_ID}">Delete</button>
          `;

    // Append user list to the container
    user_List_div.appendChild(userList);

    // Add functionalityalarm to the delete button
    const deleteBtn = document.getElementById(`alarmDelete-${user.user_ID}`);
    deleteBtn.addEventListener('click', async function () {
      // console.log(`Delete user with ID: ${user.user_ID}`);
      if (confirm(`Warning for the delete user:  ${user.user_ID}`)) {
        try {
          const response = await fetch(
            `http://localhost:5000/deleteUserByAdmin/${user.user_ID}`,
            {
              method: "DELETE",
            }
          );

          const result = await response.json();
          if (result.success) {
            alert(`user ${user.user_ID} deleted successfully`);
          } else {
            console.error(`Failed to delete alarm ${user.user_ID}`);
          }
        } catch (error) {
          console.error("Error deleting expired alarm:", error);
        }

      }

    });
  });
}

// Search functionality
const searchInput = document.getElementById('adminSearchUser');
searchInput.addEventListener('input', function () {
  const searchValue = searchInput.value.trim().toLowerCase();

  // Filter users based on the search value (user_ID)
  const filteredUsers = allUsers.filter(user =>
    user.user_ID.toString().toLowerCase().includes(searchValue)
  );

  // Display the filtered users
  displayUsers(filteredUsers);
});

// 
// post part
// 

// const postBtnDiv = document.getElementById('postBtnDiv');
// postBtnDiv.addEventListener('click', function(){
//     document.getElementById("forDashboard").style.display = "none";
//     document.getElementById("forUser").style.display = "none";
//     document.getElementById("forPost").style.display = "block";
// });


const postBtnDiv = document.getElementById('postBtnDiv');
let allPosts = [];  // To store the fetched post data

postBtnDiv.addEventListener('click', async function () {
  document.getElementById("forDashboard").style.display = "none";
  document.getElementById("forUser").style.display = "none";
  document.getElementById("forPost").style.display = "block";
  document.getElementById("forPrblmReport").style.display = "none";
  document.getElementById("forPostReport").style.display = "none";

  dashboardBtnDiv.classList.remove("changeBtnColor");
  userBtnDiv.classList.remove("changeBtnColor");
  postBtnDiv.classList.add("changeBtnColor");
  problemBtnDiv.classList.remove("changeBtnColor");
  postReportBtnDiv.classList.remove("changeBtnColor");

  // Fetch post data
  const response = await fetch('http://localhost:5000/getAllPostForAdmin');
  const data1 = await response.json();

  // Store all posts for future filtering
  allPosts = data1.data;

  // Initially display all posts
  displayPosts(allPosts);
});

// Function to display posts in the DOM
function displayPosts(posts) {
  const post_List_div = document.getElementById('postListMainDiv');
  post_List_div.innerHTML = ``; // Clears the div to avoid duplicates

  const displayTotalPostShow = document.querySelector("#displayTotalPost h1");
  console.log(displayTotalPostShow.innerHTML);
  displayTotalPostShow.innerHTML = `Total : ${posts.length}`

  // Iterate over all posts and append them to the div
  posts.forEach(post => {
    const postList = document.createElement('div');
    postList.classList.add('postListForAdmin');
    // console.log(post.fullName);

    postList.innerHTML = `
              <span>Post ID: ${post.post_ID} &nbsp;&nbsp;&nbsp;&nbsp; Username: ${post.user_ID}</span>
              <div>Full Name: ${post.username}</div>
              <div>Full Name: ${post.fullName}</div>
              <button class="delete-alarm" id="alarmDelete-${post.post_ID}">Delete</button>
          `;

    // Append post list to the container
    post_List_div.appendChild(postList);

    // Add functionality to the delete button
    const deleteBtn = document.getElementById(`alarmDelete-${post.post_ID}`);
    deleteBtn.addEventListener('click', async function () {
      // console.log(`Delete post with ID: ${post.post_ID}`);
      // You can add the delete functionality here
      // alert(`Warning for the delete post:  ${post.post_ID} `);
      if (confirm(`Warning for the delete post:  ${post.post_ID}`)) {
        try {
          const response = await fetch(
            `http://localhost:5000/deletePostByAdmin/${post.post_ID}`,
            {
              method: "DELETE",
            }
          );

          const result = await response.json();
          if (result.success) {
            alert(`post ${post.post_ID} deleted successfully`);
          } else {
            console.error(`Failed to delete alarm ${post.post_ID}`);
          }
        } catch (error) {
          console.error("Error deleting expired alarm:", error);
        }

      }

    });
  });
}

// Search functionality
const searchPostInput = document.getElementById('adminSearchPost');
searchPostInput.addEventListener('input', function () {
  const searchValue = searchPostInput.value.trim().toLowerCase();

  // Filter posts based on the search value (post_ID)
  const filteredPosts = allPosts.filter(post =>
    post.post_ID.toString().toLowerCase().includes(searchValue)
  );

  // Display the filtered posts
  displayPosts(filteredPosts);
});



// Element references
const problemBtnDiv = document.getElementById('prblmReporBtntDiv');
let allProblem = [];  // To store the fetched problem data

// Event listener to show the problem report section when the button is clicked
problemBtnDiv.addEventListener('click', async function () {
    document.getElementById("forDashboard").style.display = "none";
    document.getElementById("forUser").style.display = "none";
    document.getElementById("forPost").style.display = "none";
    document.getElementById("forPrblmReport").style.display = "block";  // Show the problem report section
    document.getElementById("forPostReport").style.display = "none";

    dashboardBtnDiv.classList.remove("changeBtnColor");
    userBtnDiv.classList.remove("changeBtnColor");
    postBtnDiv.classList.remove("changeBtnColor");
    problemBtnDiv.classList.add("changeBtnColor");
    postReportBtnDiv.classList.remove("changeBtnColor");

    // Fetch problem data from the server
    const response = await fetch('http://localhost:5000/getAllProblemOfUser');
    const data1 = await response.json();

    // Store all problems for future filtering
    allProblem = data1.data;
    console.log(allProblem);

    // Initially display all problems
    displayProblems(allProblem);
});

// Function to display problems in the DOM
function displayProblems(problems) {
    const problem_List_div = document.getElementById('problemListMainDiv');
    problem_List_div.innerHTML = ``;  // Clear the div to avoid duplicates

    const displayTotalProblemShow = document.querySelector("#displayTotalProblem h1");
    displayTotalProblemShow.innerHTML = `Total: ${problems.length}`;  // Display total count

    // Iterate over all problems and append them to the div
    problems.forEach(problem => {
        const problemList = document.createElement('div');
        problemList.classList.add('problemListForAdmin');

        problemList.innerHTML = `
            <span>Report ID: ${problem.report_ID} &nbsp;&nbsp;&nbsp;&nbsp; UserID: ${problem.user_ID}</span>
            <div>Full Name: ${problem.fullName}</div>
            <div>Problem: ${problem.problem}</div>
            <div>Details: ${problem.details}</div>
            <div>Details: ${problem.Date_Time}</div>
            <button class="delete-problem" id="problemDelete-${problem.report_ID}">Delete</button>
        `;

        // Append problem list to the container
        problem_List_div.appendChild(problemList);

        // Add functionality to the delete button
        const deleteBtn = document.getElementById(`problemDelete-${problem.report_ID}`);
        deleteBtn.addEventListener('click', async function () {
            if (confirm(`Are you sure you want to delete post: ${problem.report_ID}?`)) {
                try {
                    const response = await fetch(
                        `http://localhost:5000/deleteProblemByAdmin/${problem.report_ID}`,
                        { method: "DELETE" }
                    );
                    const result = await response.json();
                    if (result.success) {
                        alert(`Post ${problem.report_ID} deleted successfully`);
                        displayProblems(allProblem.filter(p => p.report_ID !== problem.report_ID));  // Remove the deleted post from the list
                    } else {
                        console.error(`Failed to delete post ${problem.report_ID}`);
                    }
                } catch (error) {
                    console.error("Error deleting post:", error);
                }
            }
        });
    });
}

// Search functionality
const searchProblemReport = document.getElementById('adminSearchProblem');
searchProblemReport.addEventListener('input', function () {
    const searchValue = searchProblemReport.value.trim().toLowerCase();

    // Filter problems based on the search value (post_ID)
    const filteredProblems = allProblem.filter(problem =>
        problem.report_ID.toString().toLowerCase().includes(searchValue)
    );

    // Display the filtered problems
    displayProblems(filteredProblems);
});
//

// Element references
const postReportBtnDiv = document.getElementById('postReporBtntDiv');  // Fixed the button ID
let allPostReport = [];  // To store the fetched post report data

// Event listener to show the post report section when the button is clicked
postReportBtnDiv.addEventListener('click', async function () {
    document.getElementById("forDashboard").style.display = "none";
    document.getElementById("forUser").style.display = "none";
    document.getElementById("forPost").style.display = "none";
    document.getElementById("forPrblmReport").style.display = "none";  
    document.getElementById("forPostReport").style.display = "block";  // Show the post report section

    dashboardBtnDiv.classList.remove("changeBtnColor");
    userBtnDiv.classList.remove("changeBtnColor");
    postBtnDiv.classList.remove("changeBtnColor");
    problemBtnDiv.classList.remove("changeBtnColor");
    postReportBtnDiv.classList.add("changeBtnColor");

    // Fetch post report data from the server
    const response = await fetch('http://localhost:5000/getAllPostReport');
    const data1 = await response.json();

    // Store all post reports for future filtering
    allPostReport = data1.data;
    console.log(allPostReport);

    // Initially display all post reports
    displayPostReports(allPostReport);
});

// Function to display post reports in the DOM
function displayPostReports(postReports) {
    const postReport_List_div = document.getElementById('postReportListMainDiv');
    postReport_List_div.innerHTML = ``;  // Clear the div to avoid duplicates

    const displayTotalPostReportShow = document.querySelector("#displayTotalPostReport h1");
    displayTotalPostReportShow.innerHTML = `Total: ${postReports.length}`;  // Display total count

    // Iterate over all post reports and append them to the div
    postReports.forEach(postReport => {
        const postReportList = document.createElement('div');
        postReportList.classList.add('postReportListForAdmin'); 

        // reporter_user_ID
        // reporter_fullName
        // post_owner_user_ID
        // post_owner_fullName
        // post_ID
        

        postReportList.innerHTML = `
            <span>Post ID: ${postReport.post_ID} &nbsp;&nbsp;&nbsp;&nbsp; Post owner ID: ${postReport.post_owner_user_ID}</span>
            <div>Post owner Name: ${postReport.post_owner_fullName}</div>
            <div>Rporter ID: ${postReport.reporter_user_ID}</div>
            <div>Details: ${postReport.reporter_fullName}</div>
            <button class="delete-postReport" id="postReportDelete-${postReport.post_ID}-${postReport.post_ID}">Delete</button>
        `;

        // Append post report list to the container
        postReport_List_div.appendChild(postReportList);

        // Add functionality to the delete button
        // const deleteBtn = document.getElementById(`postReportDelete-${postReport.report_ID}`);
        // deleteBtn.addEventListener('click', async function () {
        //     if (confirm(`Are you sure you want to delete post report: ${postReport.report_ID}?`)) {
        //         try {
        //             const response = await fetch(
        //                 `http://localhost:5000/deleteProblemByAdmin/${postReport.report_ID}`,
        //                 { method: "DELETE" }
        //             );
        //             const result = await response.json();
        //             if (result.success) {
        //                 alert(`Post report ${postReport.report_ID} deleted successfully`);
        //                 displayPostReports(allPostReport.filter(p => p.report_ID !== postReport.report_ID));  // Remove the deleted post from the list
        //             } else {
        //                 console.error(`Failed to delete post report ${postReport.report_ID}`);
        //             }
        //         } catch (error) {
        //             console.error("Error deleting post report:", error);
        //         }
        //     }
        // });
    });
}

// Search functionality
const searchPostReport = document.getElementById('adminSearchPostReport');
searchPostReport.addEventListener('input', function () {
    const searchValue = searchPostReport.value.trim().toLowerCase();

    // Filter post reports based on the search value (report_ID)
    const filteredPostReports = allPostReport.filter(postReport =>
        postReport.post_ID.toString().toLowerCase().includes(searchValue)
    );

    // Display the filtered post reports
    displayPostReports(filteredPostReports);
});
