const user_id = localStorage.getItem('ownUserID');

document.getElementById('report-submit').addEventListener('click', function(event) {
    // Prevent the default form submission action
    event.preventDefault();

    // Get the selected problem type
    const problemType = document.getElementById('problem-type').value;
    
    // Get the problem description
    const problemDescription = document.getElementById('problem-description').value;
    document.getElementById('problem-description').value = '';
    document.getElementById('problem-type').value = '';


    fetch('http://localhost:5000/insertUserReport', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ id: user_id, problemType: problemType, problemDescription: problemDescription })
    })
        .then(response => response.json())

});