document.addEventListener("DOMContentLoaded", function () {
    const uploadInput = document.getElementById("photo-upload");
    const uploadBtn = document.getElementById("custom-upload-button");
    const previewContainer = document.getElementById("photo-preview");

    var selectedFiles = [];

    uploadBtn.addEventListener("click", () => uploadInput.click());

    uploadInput.addEventListener("change", function () {
        const files = Array.from(uploadInput.files);
        previewContainer.innerHTML = ""; // Clear existing previews
        selectedFiles.length = 0; // Reset stored files

        files.slice(0, 5).forEach(file => {
            selectedFiles.push(file);

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "w-24 h-24 rounded object-cover";
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    const submitButton = document.getElementById('list-item-btn')
    if (submitButton) {
        submitButton.addEventListener("click", handleSubmit);
    }
});

// async function handleSubmit(event) {
//     event.preventDefault();

//     const itemTitleInput = document.querySelector("input[placeholder='e.g., Vintage Leather Jacket']");
//     const itemDescriptionInput = document.querySelector("textarea");
//     const categoryInput = document.querySelector("select");
//     const priceInput = document.querySelector("input[placeholder='Enter the price of the item']");
//     const contactNumberInput = document.querySelector("input[placeholder='Enter your contact number']");
//     const contactEmailInput = document.querySelector("input[placeholder='Enter your email']");
//     const cityInput = document.querySelector("input[placeholder='Enter your city']");
//     const stateInput = document.querySelector("input[placeholder='Enter your state / country']");

//     const itemTitle = itemTitleInput.value.trim();
//     const itemDescription = itemDescriptionInput.value.trim();
//     const category = categoryInput.value;
//     const price = priceInput.value.trim();
//     const contactNumber = contactNumberInput.value.trim();
//     const contactEmail = contactEmailInput.value.trim();
//     const city = cityInput.value.trim();
//     const state = stateInput.value.trim();

//     if (!itemTitle || !itemDescription || !category || !price || !city || !state) {
//         alert("Please fill out all required fields.");
//         return;
//     }

//     try {
//         const res = await fetch('http://localhost:5000/addProductToMarketplace/' + localStorage.getItem('ownUserID'), {
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             method: 'POST',
//             body: JSON.stringify({
//                 itemTitle: itemTitle,
//                 itemDescription: itemDescription,
//                 category: category,
//                 price: price,
//                 contactNumber: contactNumber,
//                 contactEmail: contactEmail,
//                 location: city + ", " + state
//             })
//         });

//         const data = await res.json();

//         if (data.item_ID) {
//             await fileUploadToCloudinary(data.item_ID); // ✅ Wait for all uploads to complete
//             alert('Your post has been uploaded');
//         } else {
//             console.error("Error creating post:", data.error);
//         }

//     } catch (error) {
//         console.error('Error:', error);
//     }

//     // ✅ Reset fields
//     document.getElementById("photo-upload").value = "";
//     document.getElementById("photo-preview").innerHTML = "";
//     itemTitleInput.value = "";
//     itemDescriptionInput.value = "";
//     categoryInput.value = "";
//     priceInput.value = "";
//     contactNumberInput.value = "";
//     contactEmailInput.value = "";
//     cityInput.value = "";
//     stateInput.value = "";
// }

async function handleSubmit(event) {
    event.preventDefault();

    // Show overlay
    document.getElementById("upload-overlay").classList.remove("hidden");

    const itemTitleInput = document.querySelector("input[placeholder='e.g., Vintage Leather Jacket']");
    const itemDescriptionInput = document.querySelector("textarea");
    const categoryInput = document.querySelector("select");
    const priceInput = document.querySelector("input[placeholder='Enter the price of the item']");
    const contactNumberInput = document.querySelector("input[placeholder='Enter your contact number']");
    const contactEmailInput = document.querySelector("input[placeholder='Enter your email']");
    const cityInput = document.querySelector("input[placeholder='Enter your city']");
    const stateInput = document.querySelector("input[placeholder='Enter your state / country']");

    const itemTitle = itemTitleInput.value.trim();
    const itemDescription = itemDescriptionInput.value.trim();
    const category = categoryInput.value;
    const price = priceInput.value.trim();
    const contactNumber = contactNumberInput.value.trim();
    const contactEmail = contactEmailInput.value.trim();
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();

    if (!itemTitle || !itemDescription || !category || !price || !city || !state) {
        alert("Please fill out all required fields.");
        document.getElementById("upload-overlay").classList.add("hidden");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/addProductToMarketplace/' + localStorage.getItem('ownUserID'), {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                itemTitle,
                itemDescription,
                category,
                price,
                contactNumber,
                contactEmail,
                location: `${city}, ${state}`
            })
        });

        const data = await response.json();

        if (data.item_ID) {
            await fileUploadToCloudinary(data.item_ID);
            window.location.href = "/Marketplace/manage_listing.html";
            // alert('Your post has been uploaded');
        } else {
            console.error("Error creating post:", data.error);
            alert("Failed to create post.");
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong.");
    } finally {
        document.getElementById("upload-overlay").classList.add("hidden");

        // Clear fields
        itemTitleInput.value = "";
        itemDescriptionInput.value = "";
        categoryInput.value = "";
        priceInput.value = "";
        contactNumberInput.value = "";
        contactEmailInput.value = "";
        cityInput.value = "";
        stateInput.value = "";
        uploadInput.value = "";
        previewContainer.innerHTML = "";
    }
}



const image_url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/image/upload';
const video_url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/video/upload';
const form = document.querySelector('form');

function fileUploadToCloudinary(postID) {
    return new Promise((resolve, reject) => {
        const files = document.querySelector('[type=file]').files;

        if (files.length === 0) {
            resolve(); // No files to upload
            return;
        }

        const uploadPromises = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const name = file.type.split('/')[0];
            const url = name === "image" ? image_url : name === "video" ? video_url : null;

            if (!url) continue;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'm6rlhvol');

            const uploadPromise = fetch(url, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.url) {
                        return show_image(postID, data.url);
                    }
                });

            uploadPromises.push(uploadPromise);
        }

        Promise.all(uploadPromises)
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}




function show_image(postID, imageUrl) {

    fetch("http://localhost:5000/insertProductFile", {
        headers: {
            "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ postID: postID, imageURL: imageUrl }),
    }).then((response) => response.json());
}