document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch data
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

    // Function to create a delete button and add it to the row
    function createDeleteButton(incidentKey) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        deleteButton.addEventListener('click', () => {
            deleteIncident(incidentKey);
        });
        return deleteButton;
    }

    // Function to display data in the table
    // Function to display data in the table
    function displayData(data) {
        const tableBody = document.querySelector('#incidentTable tbody');
        tableBody.innerHTML = ''; // Clear the table body before appending new data

        // Check if data is an array or a single object
        const dataArray = Array.isArray(data) ? data : [data];

        dataArray.forEach(incident => {
            const row = document.createElement('tr');

            // Display each property in the table cells
            const keys = ['incident_KEY', 'occur_DAT', 'vic_RACE', 'vic_SEX', 'boro', 'precint'];
            keys.forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = incident[key] !== null ? incident[key] : 'N/A';
                row.appendChild(cell);
            });

            // Add a delete button to the row
            const deleteButton = createDeleteButton(incident['incident_KEY']);
            const deleteCell = document.createElement('td');
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            tableBody.appendChild(row);
        });
    }


    // Function to display an error message in the table if data fetching fails
    function displayErrorMessage() {
        const tableBody = document.querySelector('#incidentTable tbody');
        tableBody.innerHTML = '<tr><td colspan="6">Error fetching data. Please try again later.</td></tr>';
    }

    // Function to save the incident data to the server
    function saveIncident(incidentData) {
        fetch('/Incident', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(incidentData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // After successfully adding the incident, you may want to clear the form and update the incident table.
                const incidentForm = document.getElementById('incidentForm');
                incidentForm.style.display = 'none';

                // Clear input fields
                const formInputs = incidentForm.querySelectorAll('input');
                formInputs.forEach(input => (input.value = ''));

                // Fetch and display data again to update the table
                fetchData();
            })
            .catch(error => {
                console.error('Error creating incident:', error);
                displayErrorMessage();
            });
    }

    // Function to delete an incident by its key
    function deleteIncident(incidentKey) {
        fetch(`/Incident/${incidentKey}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error deleting incident');
                }
                return response.json();
            })
            .then(data => {
                console.log('Incident deleted successfully:', data);
                fetchData(); // Fetch and display data again to update the table
            })
            .catch(error => {
                console.error('Error deleting incident:', error);
                displayErrorMessage();
            });
    }

    // Function to fetch data based on search criteria
    function searchIncident(incidentKey) {
        fetch(`/Incident/key/${incidentKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayData(data))
            .catch(error => {
                console.error('Error searching data:', error);
                displayErrorMessage();
            });
    }

    // Show incident form when "Add" button is clicked
    const addButton = document.getElementById('addButton');
    const incidentForm = document.getElementById('incidentForm');

    addButton.addEventListener('click', () => {
        incidentForm.style.display = 'block';
    });

    // Handle form submission
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', event => {
        event.preventDefault(); // Prevent the default form submission

        // Get values from the form
        const incidentDateInput = document.getElementById('incidentDate');
        const victimRaceInput = document.getElementById('victimRace');
        const victimSexInput = document.getElementById('victimSex');
        const boroughInput = document.getElementById('borough');
        const precinctInput = document.getElementById('precinct');

        // Create an object with the incident data (without the incidentKey)
        const newIncident = {
            occur_DAT: incidentDateInput.value.trim(),
            vic_RACE: victimRaceInput.value.trim(),
            vic_SEX: victimSexInput.value.trim(),
            boro: boroughInput.value.trim(),
            precint: parseInt(precinctInput.value.trim()) || 0,
        };

        // Here, you can send the newIncident object to your server using fetch() or other methods to save it to the database.
        saveIncident(newIncident);
    });

    // Handle search button click
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => {
        const searchKeyInput = document.getElementById('searchKey');
        const searchKey = searchKeyInput.value.trim();

        // Check if the searchKey is not empty before making the search request
        if (searchKey !== '') {
            searchIncident(searchKey);
        } else {
            fetchData(); // If search bar is empty, fetch all incidents again to reset the table
        }
    });

    // Fetch data on page load
    fetchData();
});
