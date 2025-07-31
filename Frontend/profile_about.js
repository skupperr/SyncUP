const url = 'https://api.cloudinary.com/v1_1/dwus9ua7o/image/upload';

function addWorkForm() {
    var form = document.getElementById("work-form-container");
    form.style.display = 'block';
}

function addEduForm() {
    var form = document.getElementById("education-form-container");
    form.style.display = 'block';
}

function addAddressForm() {
    var form = document.getElementById("address-form-container");
    form.style.display = 'block';
}

function addLinkForm() {
    var form = document.getElementById("link-form-container");
    form.style.display = 'block';
}

var userID = localStorage.getItem('ownUserID');

updatePic();
function updatePic() {
    // Profile Pic
    const new_profile_pic = document.getElementById('upload-profile-pic');
    const fileInput1 = document.getElementById('fileInput1');

    // Trigger file input when the image is clicked
    new_profile_pic.addEventListener('click', () => {
        fileInput1.click();
    });

    // Preview the selected image
    fileInput1.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const image_link = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                new_profile_pic.src = e.target.result;
            };
            reader.readAsDataURL(file);

            const formData = new FormData();

            formData.append('file', image_link);
            formData.append('upload_preset', 'm6rlhvol');

            fetch(url, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json()) // parse the response as JSON
                .then((data) => {
                    let imageUrl = data.url; // get the image URL
                    updatepics(imageUrl, 0);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    });

    // cover pic
    const new_cover_pic = document.getElementById('upload-cover-pic');
    const fileInput2 = document.getElementById('fileInput2');

    // Trigger file input when the image is clicked
    new_cover_pic.addEventListener('click', () => {
        fileInput2.click();
    });

    // Preview the selected image
    fileInput2.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const image_link = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                new_cover_pic.src = e.target.result;
            };
            reader.readAsDataURL(file);

            const formData = new FormData();

            formData.append('file', image_link);
            formData.append('upload_preset', 'm6rlhvol');

            fetch(url, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json()) // parse the response as JSON
                .then((data) => {
                    let imageUrl = data.url; // get the image URL
                    updatepics(imageUrl, 1);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }
    });
}

function updatepics(imageURL, x){
    console.log(imageURL, x);
    if(x === 0){
        fetch('http://localhost:5000/updateProfilePic', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({ userID: userID, 
                                    imageURL: imageURL })
        })
            .then(response => response.json())
    }
    else{
        fetch('http://localhost:5000/updateCoverPic', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({ userID: userID, imageURL: imageURL })
        })
            .then(response => response.json())
    }
}

//  Update name & bio
let update_name_bio_btn = document.getElementById('save-bio-btn');
update_name_bio_btn.addEventListener('click', function () {
    let name = document.getElementById('name-field').value;
    let bio = document.getElementById('bio-field').value;

    fetch('http://localhost:5000/updateNameBio/', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            userID: userID,
            name: name,
            bio: bio
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
})

let submit_work = document.getElementById('work-submit-button');
submit_work.addEventListener('click', function (e) {
    e.preventDefault();
    let company_name = document.getElementById('company-name').value;
    let position = document.getElementById('work-position').value;
    let start_date = document.getElementById('start-work-date').value;
    let end_date = document.getElementById('end-work-date').value;

    document.getElementById('company-name').value = '';
    document.getElementById('work-position').value = '';
    document.getElementById('start-work-date').value = '';
    document.getElementById('end-work-date').value = '';


    fetch('http://localhost:5000/insertWorkInfo', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            userID: userID,
            company_name: company_name,
            position: position,
            start_date: start_date,
            end_date: end_date
        })
    })
        .then(response => response.json())

    location.reload();
})

let submit_edu = document.getElementById('edu-submit-button');
submit_edu.addEventListener('click', function (e) {
    e.preventDefault();
    let field = document.getElementById('edu-field').value;
    let college = document.getElementById('edu-college').value;
    let start_date = document.getElementById('start-edu-date').value;
    let end_date = document.getElementById('end-edu-date').value;

    document.getElementById('edu-field').value = '';
    document.getElementById('edu-college').value = '';
    document.getElementById('start-edu-date').value = '';
    document.getElementById('end-edu-date').value = '';


    fetch('http://localhost:5000/insertEduInfo', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            userID: userID,
            field: field,
            college: college,
            start_date: start_date,
            end_date: end_date
        })
    })
        .then(response => response.json())
    location.reload();
})

let submit_address = document.getElementById('address-submit-button');
submit_address.addEventListener('click', function (e) {
    e.preventDefault();
    let present_address = document.getElementById('present-address').value;
    let start_date = document.getElementById('start-address-date').value;
    let end_date = document.getElementById('end-address-date').value;

    document.getElementById('present-address').value = '';
    document.getElementById('start-address-date').value = '';
    document.getElementById('end-address-date').value = '';


    fetch('http://localhost:5000/insertAddressInfo', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            userID: userID,
            address: present_address,
            start_date: start_date,
            end_date: end_date
        })
    })
        .then(response => response.json())
    location.reload();
})

let submit_link = document.getElementById('link-submit-button');
submit_link.addEventListener('click', function (e) {
    e.preventDefault();
    let link = document.getElementById('link').value;
    let site_name = document.getElementById('site-name').value;

    document.getElementById('link').value = '';
    document.getElementById('site-name').value = '';

    fetch('http://localhost:5000/insertLink', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            userID: userID,
            link: link,
            site_name: site_name
        })
    })
        .then(response => response.json())
    location.reload();
})

// update & deleting work info
let x = document.querySelector('#work-info-container')
if (x) {
    x.addEventListener('click', function (event) {
        const delete_btn = event.target.closest('.delete-work-info-button')
        if (delete_btn) {
            delete_work_info(delete_btn.dataset.id);
        }

        const update_btn = event.target.closest('.edit-work-info-button')
        if (update_btn) {
            update_work_info(update_btn.dataset.id);
        }
    })
}
function update_work_info(Role_ID) {
    const y = document.getElementById("work-edit-form-container-" + Role_ID);
    y.style.display = 'block';

    let company = document.getElementById('company-' + Role_ID).innerText;
    let field = document.getElementById('field-' + Role_ID).innerText;
    let start_date = document.getElementById('startdate-' + Role_ID).innerText;
    let end_date = document.getElementById('enddate-' + Role_ID).innerText;

    document.getElementById('work-company-' + Role_ID).value = company;
    document.getElementById('work-position-' + Role_ID).value = field;
    document.getElementById('start-work-date-' + Role_ID).value = start_date;
    document.getElementById('end-work-date-' + Role_ID).value = end_date;

    let update_button = document.getElementById('work-edit-submit-button-' + Role_ID);
    update_button.addEventListener('click', function () {
        company = document.getElementById('work-company-' + Role_ID).value;
        field = document.getElementById('work-position-' + Role_ID).value;
        start_date = document.getElementById('start-work-date-' + Role_ID).value;
        end_date = document.getElementById('end-work-date-' + Role_ID).value;

        fetch('http://localhost:5000/updateWorkInfo/', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                id: Role_ID,
                company: company,
                field: field,
                start_date: start_date,
                end_date: end_date
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            })
    })
}
function delete_work_info(Role_ID) {
    fetch('http://localhost:5000/deleteWorkInfo/' + Role_ID, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload()
            }
        });
}

// update & deleting edu info
let y = document.querySelector('#education-info-container')
if (y) {
    y.addEventListener('click', function (event) {
        const delete_btn = event.target.closest('.delete-edu-info-button')
        if (delete_btn) {
            delete_edu_info(delete_btn.dataset.id);
        }

        const update_btn = event.target.closest('.edit-edu-info-button')
        if (update_btn) {
            update_edu_info(update_btn.dataset.id);
        }
    })
}

function update_edu_info(id) {
    const y = document.getElementById("education-edit-form-container-" + id);
    y.style.display = 'block';

    let field = document.getElementById('school-' + id).innerText;
    let college = document.getElementById('edufield-' + id).innerText;
    let start_date = document.getElementById('edustartdate-' + id).innerText;
    let end_date = document.getElementById('eduenddate-' + id).innerText;

    document.getElementById('edu-field-' + id).value = field;
    document.getElementById('edu-college-' + id).value = college;
    document.getElementById('start-edu-date-' + id).value = start_date;
    document.getElementById('end-edu-date-' + id).value = end_date;

    let update_button = document.getElementById('edu-edit-submit-button-' + id);
    update_button.addEventListener('click', function () {

        field = document.getElementById('edu-field-' + id).value;
        college = document.getElementById('edu-college-' + id).value;
        start_date = document.getElementById('start-edu-date-' + id).value;
        end_date = document.getElementById('end-edu-date-' + id).value;

        fetch('http://localhost:5000/updateEduInfo/', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                id: id,
                college: college,
                field: field,
                start_date: start_date,
                end_date: end_date
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            })
    })
}
function delete_edu_info(id) {
    fetch('http://localhost:5000/deleteEduInfo/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload()
            }
        });
}

// update & deleting address info
let z = document.querySelector('#address-info-container')
if (z) {
    z.addEventListener('click', function (event) {
        const delete_btn = event.target.closest('.delete-address-info-button')
        if (delete_btn) {
            delete_address_info(delete_btn.dataset.id);
        }

        const update_btn = event.target.closest('.edit-address-info-button')
        if (update_btn) {
            update_address_info(update_btn.dataset.id);
        }
    })
}

function update_address_info(id) {
    const y = document.getElementById("work-edit-form-container-" + Role_ID);
    y.style.display = 'block';
}
function delete_address_info(id) {
    fetch('http://localhost:5000/deleteAddressInfo/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload()
            }
        });
}

// update & deleting link info
let a = document.querySelector('#link-info-container')
if (a) {
    a.addEventListener('click', function (event) {
        const delete_btn = event.target.closest('.delete-link-info-button')
        if (delete_btn) {
            delete_address_info(delete_btn.dataset.id);
        }
    })
}
function delete_address_info(id) {
    fetch('http://localhost:5000/deleteLinkInfo/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload()
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAllWorkData/' + userID)
        .then(response => response.json())
        .then(data => loadWorkData(data['data']));

    fetch('http://localhost:5000/getAllEduData/' + userID)
        .then(response => response.json())
        .then(data => loadEduData(data['data']));

    fetch('http://localhost:5000/getAllAddressData/' + userID)
        .then(response => response.json())
        .then(data => loadAddressData(data['data']));

    fetch('http://localhost:5000/getAllLinksData/' + userID)
        .then(response => response.json())
        .then(data => loadLinksData(data['data']));

    fetch('http://localhost:5000/getCurrentUserName/' + userID)
        .then(response => response.json())
        .then(data => loadNameBio(data['data']));
})


function loadNameBio(data) {
    let name = data[0].fullName;
    document.getElementById('name-field').value = name;
    let bio = data[0].Bio;
    document.getElementById('bio-field').value = bio;
    let profile_pic = data[0].Profile_Pic;
    document.getElementById('upload-profile-pic').src = profile_pic;
    let cover_pic = data[0].cover_pic;
    document.getElementById('upload-cover-pic').src = cover_pic;
}

function loadWorkData(data) {
    const work_details = document.getElementById('work-info-container')

    if (data.length === 0) {
        let label = document.createElement('div')
        label.innerHTML = "No workplace has been added!"

        work_details.appendChild(label)
        return;
    }

    data.forEach(function ({ Role_ID, Company, Field, start_date, end_date, user_ID }) {
        const new_div = document.createElement("div")

        if (end_date === '') {
            new_div.innerHTML =
                `<div class="work-info" style="display: flex;">
                                    <div>
                                        <i class="fa-solid fa-briefcase" style="width: 20px; margin-right: 20px;"></i>
                                            ${Field} at ${Company}
                                            <noscript id="company-${Role_ID}">${Company}</noscript>
                                            <noscript id="field-${Role_ID}">${Field}</noscript>
                                            <noscript id="startdate-${Role_ID}">${start_date}</noscript>
                                            <noscript id="enddate-${Role_ID}">${end_date}</noscript>
                                    </div>
                                    <div>
                                        <button class="edit-work-info-button" data-id=${Role_ID}><i class="fa-solid fa-pen-to-square"></i></button>
                                        <button class="delete-work-info-button" data-id=${Role_ID}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                </div>
                
                
                <div id="work-edit-form-container-${Role_ID}" style="display: none; margin-left: 70px;">
                                    <form>
                                        <label>Company Name:</label>
                                        <input id="work-company-${Role_ID}" class="work-input-class" type="text"><br><br>
                            
                                        <label>Position:</label>
                                        <input id="work-position-${Role_ID}" class="work-input-class" type="text"><br><br>
                            
                                        <label for="start-date">Start Date:</label>
                                        <input id="start-work-date-${Role_ID}" class="work-input-class" type="date"><br><br>
                            
                                        <label for="end-date">End Date</label>
                                        <input id="end-work-date-${Role_ID}" class="work-input-class" type="date"><br><br>
                            
                                        <button id="work-edit-submit-button-${Role_ID}">Save</button>
                                    </form>
                                </div>
                `
            work_details.appendChild(new_div);
        }
        else {
            new_div.innerHTML = `<div class="work-info" style="display: flex;">
                                    <div>
                                        <i class="fa-solid fa-briefcase" style="width: 20px; margin-right: 20px;"></i>
                                        Former ${Field} at ${Company}
                                        <noscript id="company-${Role_ID}">${Company}</noscript>
                                        <noscript id="field-${Role_ID}">${Field}</noscript>
                                        <noscript id="startdate-${Role_ID}">${start_date}</noscript>
                                        <noscript id="enddate-${Role_ID}">${end_date}</noscript>
                                    </div>
                                    <div><button class="edit-work-info-button" data-id=${Role_ID}><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="delete-work-info-button" data-id=${Role_ID}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                                 </div>
                                 
                                 <div id="work-edit-form-container-${Role_ID}" style="display: none; margin-left: 70px;">
                                    <form>
                                        <label>Company Name:</label>
                                        <input id="work-company-${Role_ID}" class="work-input-class" type="text"><br><br>
                            
                                        <label>Position:</label>
                                        <input id="work-position-${Role_ID}" class="work-input-class" type="text"><br><br>
                            
                                        <label for="start-date">Start Date:</label>
                                        <input id="start-work-date-${Role_ID}" class="work-input-class" type="date"><br><br>
                            
                                        <label for="end-date">End Date</label>
                                        <input id="end-work-date-${Role_ID}" class="work-input-class" type="date"><br><br>
                            
                                        <button id="work-edit-submit-button-${Role_ID}">Save</button>
                                    </form>
                                </div>
                                 `
            work_details.appendChild(new_div);
        }

    });
}

function loadEduData(data) {
    const edu_details = document.getElementById('education-info-container')

    if (data.length === 0) {
        let label = document.createElement('div')
        label.innerHTML = "No Education has been added!"

        edu_details.appendChild(label)
        return;
    }

    data.forEach(function ({ edu_list, Field, School, start_date, end_date, user_ID }) {
        const new_div = document.createElement("div")

        if (end_date === '') {
            new_div.innerHTML = `<div class="edu-info" style="display: flex;">
                                    <div>
                                        <i class="fa-solid fa-graduation-cap" style="color: #000000 ;margin-right: 20px;"></i>
                                            Studying ${Field} at ${School} 
                                            <noscript id="school-${edu_list}">${School}</noscript>
                                            <noscript id="edufield-${edu_list}">${Field}</noscript>
                                            <noscript id="edustartdate-${edu_list}">${start_date}</noscript>
                                            <noscript id="eduenddate-${edu_list}">${end_date}</noscript>
                                    </div>
                                    <div><button class="edit-edu-info-button" data-id=${edu_list}><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="delete-edu-info-button" data-id=${edu_list}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                                 </div>

                                 <div id="education-edit-form-container-${edu_list}" style="display: none; margin-left: 70px;">
                                    <form>
                                        <label for="field">Field:</label>
                                        <input id="edu-field-${edu_list}" class="edu-input-class" type="text"><br><br>
                            
                                        <label for="School">School/University:</label>
                                        <input id="edu-college-${edu_list}" class="edu-input-class" type="text"><br><br>
                            
                                        <label for="start-date">Start Date</label>
                                        <input id="start-edu-date-${edu_list}" class="edu-input-class" type="date"><br><br>
                            
                                        <label for="end-date">End Date</label>
                                        <input id="end-edu-date-${edu_list}" class="edu-input-class" type="date"><br><br>
                            
                                        <button id="edu-edit-submit-button-${edu_list}">Save</button>
                                    </form>
                                </div>
                                `
            edu_details.appendChild(new_div);
        }
        else {
            new_div.innerHTML = `<div class="edu-info" style="display: flex;">
                                    <div>
                                        <i class="fa-solid fa-graduation-cap" style="color: #000000 ;margin-right: 20px;"></i>
                                            Studied ${Field} at ${School} 
                                            <noscript id="school-${edu_list}">${School}</noscript>
                                            <noscript id="edufield-${edu_list}">${Field}</noscript>
                                            <noscript id="edustartdate-${edu_list}">${start_date}</noscript>
                                            <noscript id="eduenddate-${edu_list}">${end_date}</noscript>
                                    </div>
                                    <div><button class="edit-edu-info-button" data-id=${edu_list}><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="delete-edu-info-button" data-id=${edu_list}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                                 </div>

                                 <div id="education-edit-form-container-${edu_list}" style="display: none; margin-left: 70px;">
                                    <form>
                                        <label for="field">Field:</label>
                                        <input id="edu-field-${edu_list}" class="edu-input-class" type="text"><br><br>
                            
                                        <label for="School">School/University:</label>
                                        <input id="edu-college-${edu_list}" class="edu-input-class" type="text"><br><br>
                            
                                        <label for="start-date">Start Date</label>
                                        <input id="start-edu-date-${edu_list}" class="edu-input-class" type="date"><br><br>
                            
                                        <label for="end-date">End Date</label>
                                        <input id="end-edu-date-${edu_list}" class="edu-input-class" type="date"><br><br>
                            
                                        <button id="edu-edit-submit-button-${edu_list}">Save</button>
                                    </form>
                                </div>
                                 `
            edu_details.appendChild(new_div);
        }

    });
}

function loadAddressData(data) {
    const address = document.getElementById('address-info-container')

    if (data.length === 0) {
        let label = document.createElement('div')
        label.innerHTML = "No Address has been added!"

        address.appendChild(label)
        return;
    }

    data.forEach(function ({ list, present_address, start_date, end_date, user_ID }) {
        const new_div = document.createElement("div")

        if (end_date === '') {
            new_div.innerHTML =
                `<div class="address-info" style="display: flex;">
                                    <div>
                                        <i class="fa-solid fa-house" style="width: 20px; margin-right: 20px;"></i>
                                            Lives in ${present_address}
                                    </div>
                                    <div>
                                        <button class="edit-address-info-button" data-id=${list}><i class="fa-solid fa-pen-to-square"></i></button>
                                        <button class="delete-address-info-button" data-id=${list}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                                 </div>`
            address.appendChild(new_div);
        }
        else {
            new_div.innerHTML = `<div class="address-info" style="display: flex;">
                                    <div>
                                        <i class="fa-solid fa-house" style="width: 20px; margin-right: 20px;"></i>
                                            Lived in ${present_address}
                                    </div>
                                    <div><button class="edit-address-info-button" data-id=${list}><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="delete-address-info-button" data-id=${list}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                                 </div>`
            address.appendChild(new_div);
        }

    });
}


function loadLinksData(data) {
    const link_details = document.getElementById('link-info-container')

    if (data.length === 0) {
        let label = document.createElement('div')
        label.innerHTML = "No link has been added!"

        link_details.appendChild(label)
        return;
    }

    data.forEach(function ({ link_id, link, site_name, user_ID }) {
        const new_div = document.createElement("div")

        new_div.innerHTML =
            `<div class="link-info" style="display: flex;">
                                <div>
                                    <i class="fa-solid fa-link" style="width: 20px; margin-right: 20px;"></i>
                                        <a href="${link}">${site_name}</a>
                                </div>
                                <div>
                                    <button class="delete-link-info-button" data-id=${link_id}><i class="fa-regular fa-trash-can"></i></button>
                                </div>
                                </div>`
        link_details.appendChild(new_div);

    });
}