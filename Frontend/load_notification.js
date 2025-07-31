
const UserID = localStorage.getItem("ownUserID")
// raeding notification
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/searchingNotification/' + UserID)
        .then(response => response.json())
        .then(data => showNotification(data['data']));
})

function showNotification(data) {
    const main_div = document.getElementById('notificaations');

    if (data.length === 0) {
        return;
    }

    data.forEach(function ({ Notify_Time, Message }) {

        const dateObj = new Date(Notify_Time);
        var formattedDate = Notify_Time.includes('T') ? Notify_Time.split('T')[0] : Notify_Time;
        const time = dateObj.toTimeString().split(' ')[0];

        const new_div = document.createElement("div")
        new_div.innerHTML =
            // `<div class="notification-class">
            //         <div style="font-size: 15px;">${formattedDate} ${time}</div>
            //         <div>${Message}</div>
            //     </div>
            //     `
            `
            <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p class="text-xs text-gray-500 mb-1">${formattedDate} ${time}</p>
                <p class="text-sm text-gray-700"><span class="font-medium text-blue-600">${Message}</span></p>
            </div>
            `
        main_div.appendChild(new_div);
    });
}

const button = document.getElementById('notification-button');
    const aside = document.getElementById('notification-panel');

    button.addEventListener('click', () => {
        aside.classList.toggle('translate-x-full');
    });

    // Optional: click outside to hide
    document.addEventListener('click', function (e) {
        if (!aside.contains(e.target) && !button.contains(e.target)) {
            aside.classList.add('translate-x-full');
        }
    });