document.addEventListener('DOMContentLoaded', () => {
    // Fetching data
    function fetchData() {
        fetch('/Incident') // API Endpoint
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayData(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                displayErrorMessage();
            });
    }

    // Function to display data in the table
    function displayData(data) {
        const tableBody = document.querySelector('#incidentTable tbody');
        tableBody.innerHTML = ''; // Clear the table body before appending new data

        data.forEach(incident => {
            const row = document.createElement('tr');

            // Display each property in the table cells
            const keys = ['incident_KEY', 'occur_DAT', 'vic_RACE', 'vic_SEX', 'boro', 'precint'];
            keys.forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = incident[key] !== null ? incident[key] : 'N/A';
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }

    // Function to display an error message in the table if data fetching fails
    function displayErrorMessage() {
        const tableBody = document.querySelector('#incidentTable tbody');
        tableBody.innerHTML = '<tr><td colspan="6">Error fetching data. Please try again later.</td></tr>';
    }

    // Function to display a confirmation message when a new incident is added
    function displayConfirmationMessage() {
        const notification = document.createElement('div');
        notification.textContent = 'New incident added successfully!';
        notification.classList.add('confirmation-message');

        // Append the notification to the body
        document.body.appendChild(notification);

        // Remove the notification after a few seconds (e.g., 3 seconds)
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Show incident form when "Add" button is clicked
    const addButton = document.getElementById('addButton');
    const incidentForm = document.getElementById('incidentForm');

    addButton.addEventListener('click', () => {
        incidentForm.style.display = 'block';
    });

    // Handle form submission
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get values from the form
        const incidentDateInput = document.getElementById('incidentDate');
        const victimRaceInput = document.getElementById('victimRace');
        const victimSexInput = document.getElementById('victimSex');
        const boroughInput = document.getElementById('borough');
        const precinctInput = document.getElementById('precinct');

        // Create an object with the incident data
        const newIncident = {
            "occur_DAT": incidentDateInput.value.trim(),
            "vic_RACE": victimRaceInput.value.trim(),
            "vic_SEX": victimSexInput.value.trim(),
            "boro": boroughInput.value.trim(),
            "precint": parseInt(precinctInput.value.trim()) || 0
        };

        // Send the newIncident object to your server
        fetch('/Incident', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newIncident),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error creating incident.');
                }
                return response.json();
            })
            .then(createdIncident => {
                console.log('Incident created successfully:', createdIncident);
                // After successfully adding the incident, you may want to clear the form and update the incident table.
                incidentDateInput.value = '';
                victimRaceInput.value = '';
                victimSexInput.value = '';
                boroughInput.value = '';
                precinctInput.value = '';
                incidentForm.style.display = 'none';
                fetchData(); // Fetch and display data again to update the table
                displayConfirmationMessage(); // Display the confirmation message
            })
            .catch(error => {
                console.error('Error creating incident:', error);
                // Handle the error here if needed
            });
    });

    // Fetch data on page load
    fetchData();
});
