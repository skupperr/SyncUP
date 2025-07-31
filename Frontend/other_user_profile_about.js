
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

var userID = localStorage.getItem('otherUserID');


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
                                </div>`
        link_details.appendChild(new_div);

    });
}