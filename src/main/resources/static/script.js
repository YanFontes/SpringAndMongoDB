document.addEventListener('DOMContentLoaded', () => {
    // Fetching data
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

    // Function to display data in the table
    function displayData(data) {
        const tableBody = document.querySelector('#incidentTable tbody');
        tableBody.innerHTML = ''; // Clear the table body before appending new data

        data.forEach(incident => {
            const row = document.createElement('tr');

            const incidentKeyCell = document.createElement('td');
            incidentKeyCell.textContent = incident.INCIDENT_KEY !== undefined ? incident.INCIDENT_KEY : JSON.stringify(incident);

            row.appendChild(incidentKeyCell);

            tableBody.appendChild(row);
        });
    }

    // Function to display an error message in the table if data fetching fails
    function displayErrorMessage() {
        const tableBody = document.querySelector('#incidentTable tbody');
        tableBody.innerHTML = '<tr><td colspan="3">Error fetching data. Please try again later.</td></tr>';
    }
});
