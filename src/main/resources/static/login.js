async function authenticate(event) {
    event.preventDefault();

    const username = document.getElementById('UserName').value;
    const password = document.getElementById('Password').value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // Redirect to the main application or display a success message
        window.location.href = '/index.html'; // Replace '/main' with the URL of your main application page
    } catch (error) {
        // Display error message on the login page
        const errorDiv = document.createElement('div');
        errorDiv.innerText = error.message;
        document.querySelector('.login-container').appendChild(errorDiv);
    }
}
