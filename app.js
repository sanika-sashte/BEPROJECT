function handleSignIn() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Check the username and password
    if (username === 'sanika' && password === '123') {
        // Redirect to the showresults.html page
        window.location.href = 'showresults.html';
    } else {
        // For demonstration purposes, we will show an alert for incorrect credentials
        alert('Invalid username or password. Please try again.');
    }

    // Prevent the default form submission
    return false;
}