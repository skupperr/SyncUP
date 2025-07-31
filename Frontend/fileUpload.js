const image_url = 'https://api.cloudinary.com/v1_1/drxvggxwj/image/upload';
const video_url = 'https://api.cloudinary.com/v1_1/drxvggxwj/video/upload';
const form = document.querySelector('form');

let imageUrl = '';

const postButton = document.getElementById('postSubmitButton');
postButton.addEventListener('click', (e) => {
    e.preventDefault();

    const files = document.querySelector('[type=file]').files;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        let name = file.type;
        name = name.split('/')[0];

        let url = '';
        if(name === "image")
            url = image_url;
        else if(name === "video")
            url = video_url;

        formData.append('file', file);
        formData.append('upload_preset', 'uds1nfkt');

        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json()) // parse the response as JSON
            .then((data) => {
                imageUrl = data.url; // get the image URL
                inserFile();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
});




function inserFile() {
    const imageContainer = document.getElementById('imageContainer');

    // Create a button for showing the image
    // const button = document.createElement('button');
    // button.textContent = 'Show Image';

    // // Create an image element (initially hidden)
    // const img = document.createElement('img');
    // img.src = imageUrl;
    // img.alt = 'Uploaded Image';
    // img.style.display = 'none'; // Hide the image initially
    // img.style.width = '300px'; // Set a width for the image

    // // Add event listener to the button to show the image
    // button.addEventListener('click', () => {
    //     img.style.display = 'block'; // Show the image when the button is clicked
    // });

    // // Append the button and image to the container
    // imageContainer.appendChild(button);
    // imageContainer.appendChild(img);

    // console.log(imageUrl); // log the image URL
    // document.getElementById('data').innerHTML += `<p>${imageUrl}</p>`;

    fetch('http://localhost:5000/insertPostFile', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ imageURL: imageUrl })
    })
        .then(response => response.json())
}
