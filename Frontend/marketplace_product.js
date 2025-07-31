const urlParams = new URLSearchParams(window.location.search);
const item_ID = urlParams.get("id");






document.addEventListener("DOMContentLoaded", async function () {
    // Replace these URLs with the actual image URLs for your product

    var response2 = await fetch('http://localhost:5000/getItemFile/' + item_ID);
    var data = await response2.json();

    const container = document.getElementById("product-pictures");

    for (var i = 0; i < data.data.length; i++) {

        const img = document.createElement("img");
        img.src = data.data[i].file_url;
        img.className = "rounded-lg w-full max-w-xs object-cover"; // Tailwind classes
        container.appendChild(img);
    }



    fetch('http://localhost:5000/getProductByItemID/' + item_ID)
        .then(response => response.json())
        .then(data => update_data(data['data']));

});


function update_data(data) {

    const product_name = document.getElementById("product-name")
    const product_date = document.getElementById("product-time")
    const product_location = document.getElementById("product-location")
    const product_description = document.getElementById("product-description")
    const product_price = document.getElementById("product-price")

    var formattedTime = formatDateAndTimeAgo(data[0]['Date'])

    product_name.innerText = data[0]['Title']
    product_date.innerText = formattedTime['formattedDate'] + " (" + formattedTime['timeAgo'] + ")"
    product_location.innerText = data[0]['location']
    product_description.innerText = data[0]['Description']
    product_price.innerText = data[0]['Price']

    const seller_id = data[0]['user_ID']
    const seller_number = data[0]['Seller_Number']
    const seller_email = data[0]['Seller_Email']

    fetch('http://localhost:5000/getUserInfoByUserID/' + seller_id)
        .then(response => response.json())
        .then(data => setSellerInfo(data['data'], seller_number, seller_email, seller_id));
}

function setSellerInfo(data, seller_number, seller_email, seller_id) {
    const seller_pic = document.getElementById("seller-pic")
    const seller_name = document.getElementById("seller-name")
    const seller_username = document.getElementById("seller-username")
    const seller_numberr = document.getElementById("seller-number")
    const seller_emaill = document.getElementById("seller-email")

    seller_name.innerText = data[0]['fullName']
    seller_username.innerText = data[0]['username']
    seller_pic.style.backgroundImage = `url("${data[0]['Profile_Pic']}")`;

    if (seller_number) {
        seller_numberr.innerText = `Phone: ${seller_number}`;
        seller_numberr.style.display = "block";
    } else {
        seller_numberr.style.display = "none";
    }

    if (seller_email) {
        seller_emaill.innerText = `Email: ${seller_email}`;
        seller_emaill.style.display = "block";
    } else {
        seller_emaill.style.display = "none";
    }

    const container = document.getElementById('btn-id');
    container.innerHTML = '';

    if (localStorage.getItem('ownUserID') == seller_id){
        container.innerHTML = '<p class="col-span-full text-gray-500" style="font-size: 25;">You are the seller.</p>'
        container.innerHTML += `<button id="edit-btn"
                                    class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e92932] text-[#fcf8f8] text-sm font-bold leading-normal tracking-[0.015em]">
                                    <span class="truncate">Edit listing</span>
                                </button>`;

    }
    else{
        container.innerHTML = `<a href="/Marketplace/marketplace_messaging.html?id=${seller_id}">
        <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e92932] text-[#fcf8f8] text-sm font-bold leading-normal tracking-[0.015em]">
                <span class="truncate">Contact seller</span>
            </button></a>`
    }
}

document.addEventListener("click", function (e) {
    if (e.target.closest("#edit-btn")) {
        showEditForm();
    }
});

function showEditForm() {
    const form = document.getElementById("edit-form");
    form.classList.remove("hidden");

    // Scroll to the form
    form.scrollIntoView({ behavior: "smooth", block: "start" });

    // Prefill inputs using current displayed product data
    document.getElementById("edit-title").value = document.getElementById("product-name").innerText;
    document.getElementById("edit-description").value = document.getElementById("product-description").innerText;
    document.getElementById("edit-location").value = document.getElementById("product-location").innerText;
    document.getElementById("edit-price").value = document.getElementById("product-price")?.innerText || '';

    // Seller fields
    document.getElementById("edit-phone").value = document.getElementById("seller-number")?.innerText.replace("Phone: ", "") || '';
    document.getElementById("edit-email").value = document.getElementById("seller-email")?.innerText.replace("Email: ", "") || '';
}



document.getElementById("edit-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedData = {
        item_ID: item_ID,
        Title: document.getElementById("edit-title").value,
        Description: document.getElementById("edit-description").value,
        location: document.getElementById("edit-location").value,
        Price: document.getElementById("edit-price").value,
        Seller_Number: document.getElementById("edit-phone").value,
        Seller_Email: document.getElementById("edit-email").value
    };

    const response = await fetch("http://localhost:5000/updateItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    });

    if (response.ok) {
        alert("Listing updated!");
        window.location.reload();
    } else {
        alert("Failed to update listing.");
    }
});

document.getElementById("delete-button").addEventListener("click", function () {
    // Confirm and delete listing logic here
    const confirmDelete = confirm("Are you sure you want to delete this listing?");
    if (confirmDelete) {
        fetch('http://localhost:5000/deleteMarketplaceItem/' + item_ID, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/Marketplace/";
            }
        });
    }
});




function formatDateAndTimeAgo(isoDateStr) {
    const createdDate = new Date(isoDateStr);
    const now = new Date();

    // Format as readable date
    const formattedDate = createdDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Calculate "time ago"
    const diffMs = now - createdDate;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let timeAgo = "";
    if (years > 0) {
        timeAgo = `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
        timeAgo = `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
        timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
        timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
        timeAgo = `just now`;
    }

    return {
        formattedDate,
        timeAgo
    };
}
