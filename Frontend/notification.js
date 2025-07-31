// import {showAlarmINAllWebPage} from './newsFeed.js';
let time = document.getElementById("time");
let dateInput = document.getElementById("alarmDate");
let tInput = document.getElementById("alarmTime");
let btn = document.getElementById("setAlarm");
let contan = document.getElementById("allAlarmsListMain-div");
let interVal;
let maxValue = 1000;
let cnt = 0;
let almTimesArray = [];

document.addEventListener("DOMContentLoaded", function () {
  let user_ID = localStorage.getItem('ownUserID'); 
  fetch("http://localhost:5000/getAllAlarmList/" + user_ID)
    .then((response) => response.json())
    .then((data) => loadAllPost(data["data"]));
});

function reloadingData() {
  let user_ID = localStorage.getItem('ownUserID'); 
  fetch("http://localhost:5000/getAllAlarmList/" + user_ID)
    .then((response) => response.json())
    .then((data) => loadAllPost(data["data"]));
}

function decreaseOneDay(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function loadAllPost(data) {
  contan.innerHTML = ``;
  const now = new Date();

  if (data.length > 0) {
    let alarmDiv2 = document.createElement("div");

    alarmDiv2.classList.add("alarmFilter");

    alarmDiv2.innerHTML = `
        <select name="levelOfAlarm" id="filterAlarmSection" class="filterAlarmSection">
        <option value="all">All</option>
        <option value="normal">Normal</option>
        <option value="emergency">Emergency</option>
        
        </select>
        <i class="fa-solid fa-filter alarmFilterIcon"></i>
        `;
    contan.appendChild(alarmDiv2);
    data.forEach(async function ({
      P_Notified_ID,
      Notify_Time,
      Created_Date,
      Content,
      alarm_level,
      user_ID,
    }) {
      // Combine the Created_Date and Notify_Time to create a complete datetime
      let formattedDate = Created_Date.includes("T")
        ? Created_Date.split("T")[0]
        : Created_Date;
      let alarmDate = decreaseOneDay(formattedDate);
      let alarmDateTime = new Date(`${alarmDate}T${Notify_Time}`);

      // Check if alarm is expired
      if (alarmDateTime <= now) {
        // Alarm is expired, so delete it
        await deleteExpiredAlarm(P_Notified_ID, Content);
      } else {
        // Alarm is still valid, so display it
        let alarmDiv = document.createElement("div");
        let alarmDiv2 = document.createElement("div");
        alarmDiv.classList.add("alarm");
        alarmDiv2.classList.add("alarm");

        alarmDiv2.innerHTML = `
                <select name="levelOfAlarm" id="levelOfAlarm">
                <option value="normal" selected>Normal</option>
                <option value="emergency">Emergency</option>
                
                </select>
                `;
        alarmDiv.innerHTML = `
                    <span>
                    ${
                      "Date: " +
                      alarmDate +
                      "&nbsp;&nbsp;&nbsp;&nbsp; Time: " +
                      Notify_Time
                    }
                    </span>
                    <div>Level: ${alarm_level}</div>
                    <div>Message: ${Content}</div>
                    <button class="delete-alarm" id="alarmDelete-${P_Notified_ID}">
                    Delete
                    </button>
                `;
        contan.appendChild(alarmDiv);
      }
    });
  } else {
    contan.innerHTML = `<h1>No data found</h1>`;
  }
}

function startAutoReload() {
  setInterval(() => {
    console.log("Reloading data...");
    reloadingData(); // Call your reloading function here
  }, 60000); // 60000 milliseconds = 1 minute
}

// Function to send a request to the backend to delete an expired alarm
async function deleteExpiredAlarm(P_Notified_ID) {
  try {
    const response = await fetch(
      `http://localhost:5000/deleteExpiredAlarm/${P_Notified_ID}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    if (result.success) {
      console.log(`Alarm ${P_Notified_ID} deleted successfully`);
    } else {
      console.error(`Failed to delete alarm ${P_Notified_ID}`);
    }
  } catch (error) {
    console.error("Error deleting expired alarm:", error);
  }
}

if (contan) {
    contan.addEventListener("click", function (event) {
        const likeElement = event.target.closest(".delete-alarm");
        const alarmFilterIcon = event.target.closest(".alarmFilterIcon");

        // Ensure that a delete-alarm button was clicked
        if (likeElement) {
            const alarmID = likeElement.id;
            const numericID = alarmID.split("-")[1];
            
            fetch("http://localhost:5000/deletAlarm", {
                headers: {
                    "Content-type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify({
                    alarm_ID: numericID,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    reloadingData();
                }
            });
        }

        // Handle the filter icon click
        if (alarmFilterIcon) {
            let selectPrivacyElement = document.getElementById("filterAlarmSection");
            let filterLevel = selectPrivacyElement.value;

            // Call a function to filter the alarms based on the selected level
            filterAlarmsByLevel(filterLevel);
        }
    });
}

// Function to filter alarms by level (normal, emergency, or all)
function filterAlarmsByLevel(level) {
    let user_ID = localStorage.getItem('ownUserID');  // Replace this with dynamic user ID if needed
    fetch("http://localhost:5000/getAllAlarmList/" + user_ID)
        .then(response => response.json())
        .then(data => {
            let filteredData;

            // Filter based on the selected level
            if (level === "all") {
                // Show all alarms if "All" is selected
                filteredData = data['data'];
            } else {
                // Filter by normal or emergency
                filteredData = data['data'].filter(alarm => alarm.alarm_level === level);
            }

            loadAllPost(filteredData); // Re-render the UI with the filtered alarms
        });
}



function timeChangeFunction() {
  let curr = new Date();
  let hrs = curr.getHours();
  let min = String(curr.getMinutes()).padStart(2, "0");
  let sec = String(curr.getSeconds()).padStart(2, "0");
  let period = "AM";
  if (hrs >= 12) {
    period = "PM";
    if (hrs > 12) {
      hrs -= 12;
    }
  }
  hrs = String(hrs).padStart(2, "0");
  time.textContent = `${hrs}:${min}:${sec} ${period}`;
}

async function alarmSetFunction() {
  let now = new Date();
  let selectedDate = new Date(dateInput.value + "T" + tInput.value);

  if (selectedDate <= now) {
    alert(`Invalid time. Please select a future date and time.`);
    return;
  }

  if (almTimesArray.includes(selectedDate.toString())) {
    alert(`You cannot set multiple alarms for the same time.`);
    return;
  }

  if (cnt < maxValue) {
    let timeUntilAlarm = selectedDate - now;
    let selectPrivacyElement = document.getElementById("levelOfAlarm");
    let alarmLevel = selectPrivacyElement.value;
    let alarmMessage = document.querySelector(".set-message-alarm input").value;

    // Store alarm data in the database
    let alarmData = {
      date: dateInput.value,
      time: tInput.value,
      levelOfAlarm: alarmLevel,
      message: alarmMessage, // Storing the content (message)
      user_ID: localStorage.getItem('ownUserID')
    };

    try {
      let response = await fetch("http://localhost:5000/setAlarm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alarmData),
      });
      let result = await response.json();
      // console.log('Alarm stored:', result);
    } catch (error) {
      console.error("Error storing alarm:", error);
    }

    var data2;
    try {
      let user_ID = localStorage.getItem('ownUserID'); // Replace this with a dynamic value as needed
      var response2 = await fetch(
        "http://localhost:5000/getAllAlarmList/" + user_ID
      );
      data2 = await response2.json();
      // console.log('Alarm list:', data2.data.length);
    } catch (error) {
      console.error("Error retrieving alarm list:", error);
    }

    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");

    // Schedule the alarm with the specific message
    interVal = setTimeout(() => {
      alert(`Time to wake up! Message: ${alarmMessage}`); // Use the alarm message from the input
      alarmDiv.remove();
      const alarmIndex = almTimesArray.indexOf(selectedDate.toString());
      if (alarmIndex !== -1) {
        almTimesArray.splice(alarmIndex, 1);
      }
    }, timeUntilAlarm);

    // Append the alarmDiv if needed in UI
    // contan.appendChild(alarmDiv);
    // cnt++;

    almTimesArray.push(selectedDate.toString());
  } else {
    alert("You can only set a maximum of 3 alarms.");
  }

  reloadingData();
}

setInterval(timeChangeFunction, 1000);
btn.addEventListener("click", alarmSetFunction);
timeChangeFunction();
startAutoReload();
