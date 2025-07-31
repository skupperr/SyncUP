const urlParams = new URLSearchParams(window.location.search);
const seller_id = urlParams.get("id");



document.addEventListener("DOMContentLoaded", async function () {

    fetch('http://localhost:5000/getUserInfoByUserID/' + seller_id)
        .then(response => response.json())
        .then(data => setSellerInfo(data['data']));


});

function setSellerInfo(data) {
    const seller_name = document.getElementById('seller-name')

    seller_name.innerText = data[0]['fullName']
}

const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const receiverID = seller_id
const senderID = localStorage.getItem("ownUserID");

async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;

    try {
        const res = await fetch('http://localhost:5000/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderID: senderID,
                receiverID: receiverID,
                message_content: content
            })
        });

        const result = await res.json();

        if (result.success) {
            document.getElementById("message-input").value = ""
            getMessages()
            loadConversationList(senderID)
        } else {
            console.error("Message not sent");
        }

    } catch (err) {
        console.error("Failed to send message:", err);
    }
}

// Send button click
sendBtn.addEventListener("click", sendMessage);

// ENTER key support
messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent new line
        sendMessage();
    }
});




document.addEventListener("DOMContentLoaded", async () => {
    getMessages()
});

async function getMessages() {
    const currentUserID = localStorage.getItem("ownUserID");

    if (!currentUserID || !seller_id) return;

    const container = document.querySelector(".message-container");
    container.innerHTML = ''

    try {
        const res = await fetch(`http://localhost:5000/getMessages/${currentUserID}/${seller_id}`);
        const data = await res.json();

        const x = await fetch('http://localhost:5000/getUserInfoByUserID/' + seller_id);
        const receiver_data = await x.json();

        const y = await fetch('http://localhost:5000/getUserInfoByUserID/' + currentUserID);
        const sender_data = await y.json();

        data.messages.forEach(msg => {
            const messageBlock = document.createElement("div");
            const isSender = msg.senderID == currentUserID;

            messageBlock.className = `${isSender ? "sender justify-end" : "reciever"} flex items-end gap-3 p-4`;

            const profilePic = document.createElement("div");
            profilePic.className = "bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0";
            profilePic.style.backgroundImage = `url('${isSender ? sender_data.data[0][['Profile_Pic']] : receiver_data.data[0][['Profile_Pic']] || "https://via.placeholder.com/40"}')`;

            const name = document.createElement("p");
            name.className = `text-[#8b5b5d] text-[13px] font-normal leading-normal max-w-[360px] ${isSender ? "text-right" : ""}`;
            name.textContent = isSender ? sender_data.data[0][['fullName']] || "You" : receiver_data.data[0][['fullName']] || "User";

            const msgBubble = document.createElement("p");
            msgBubble.className = `text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 ${isSender ? "bg-[#e8b4b7]" : "bg-[#f1e9ea]"} text-[#191011]`;
            msgBubble.textContent = msg.message_content;

            const flexColumn = document.createElement("div");
            flexColumn.className = `flex flex-1 flex-col gap-1 ${isSender ? "items-end" : "items-start"}`;
            flexColumn.appendChild(name);
            flexColumn.appendChild(msgBubble);

            if (isSender) {
                messageBlock.appendChild(flexColumn);
                messageBlock.appendChild(profilePic);
            } else {
                messageBlock.appendChild(profilePic);
                messageBlock.appendChild(flexColumn);
            }

            container.appendChild(messageBlock);
        });
    } catch (err) {
        console.error("Failed to load messages:", err);
    }

    container.scrollIntoView({ behavior: "instant", block: "end" })
}



// getting user profile that was chatted with


const currentUserID = localStorage.getItem("ownUserID");
loadConversationList(currentUserID);

async function loadConversationList(currentUserID) {
    try {
        const response = await fetch(`http://localhost:5000/getConversationUsers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: currentUserID })
        });

        if (!response.ok) throw new Error("Server error");

        const users = await response.json();

        const container = document.querySelector(".conversation-list");
        container.innerHTML = `
            <h2 class="text-[#191011] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Messages</h2>
        `;

        users.forEach(user => {
            const convoItem = document.createElement("div");
            convoItem.className = "flex items-center gap-4 bg-[#fbf9f9] px-4 min-h-[72px] py-2 cursor-pointer";
            convoItem.innerHTML = `
                <a class="flex gap-4" href="/Marketplace/marketplace_messaging.html?id=${user.user_ID}">
                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                    style='background-image: url("${user.Profile_Pic}");'></div>
                <div class="flex flex-col justify-center">
                    <p class="text-[#191011] text-base font-medium leading-normal line-clamp-1">${user.fullName}</p>
                </div></a>
            `;
            convoItem.addEventListener("click", () => {
                openChatWithUser(user.user_ID, user.fullName, user.Profile_Pic);
            });
            container.appendChild(convoItem);
        });
    } catch (error) {
        console.error("Failed to load conversation list:", error);
    }
}


