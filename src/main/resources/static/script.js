document.addEventListener('DOMContentLoaded', () => {

    // Function to create and insert the header
    function createHeader() {
        const header = document.createElement('header');
        header.innerHTML = `
            <h1>Incident Management System</h1>
            <nav>
                <ul>
                    <li><a href="https://www.kaggle.com/datasets/debjeetdas/nypd-shooting-incident-data">Dataset</a></li>
                    <li><a href="http://localhost:8080/Incident">JSON Data</a></li>
                    <li><a href="https://github.com/YanFontes/SpringAndMongoDB/tree/FixBrokeCode">Github Project</a></li>      
                    <li><button id="exportButton" class="exportButton">Export Data</button></li>
                </ul>
            </nav>
        `;
        document.body.insertBefore(header, document.body.firstChild);

        // Add an event listener to the export button
        const exportButton = document.getElementById('exportButton');
        exportButton.addEventListener('click', handleExportButtonClick);
    }

    // Function to create and insert the footer
    function createFooter() {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <p>&copy; ${new Date().getFullYear()} Incident Management System</p>
        `;
        document.body.appendChild(footer);
    }

    // Call the functions to create and insert header and footer
    createHeader();
    createFooter();


    // Function to fetch incident data from the server
    function fetchData() {
        // Fetch data from the API endpoint "/Incident"
        fetch('/Incident')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayData(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                displayErrorMessage('Error fetching data. Please try again later.');
            });
    }

    // Function to create a delete button for each incident and add it to the table row
    function createDeleteButton(incidentId) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        deleteButton.addEventListener('click', () => {
            deleteIncident(incidentId); // Call the deleteIncident function when the button is clicked
        });
        return deleteButton;
    }

    // Function to display incident data in the table
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

    // Function to fetch data based on the incident key search criteria
    function searchIncident(incidentKey) {
        fetch(`/Incident/key/${incidentKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data === null) {
                    displayErrorMessage('Incident not found');
                } else {
                    displayData(data);
                }
            })
            .catch(error => {
                console.error('Error searching data:', error);
                displayErrorMessage('Error searching for incident');
            });
    }

    // Function to display an error message in the table if data fetching fails
    function displayErrorMessage(message) {
        const tableBody = document.querySelector('#incidentTable tbody');
        tableBody.innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
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

                // Show confirmation message
                const confirmationMessage = document.getElementById('confirmationMessage');
                confirmationMessage.textContent = 'Incident added successfully!';
                confirmationMessage.style.display = 'block';

                // Fetch and display data again to update the table
                fetchData();
            })
            .catch(error => {
                console.error('Error creating incident:', error);
                displayErrorMessage('Error creating incident');
            });
    }

    // Function to delete an incident by its ID
    function deleteIncident(incidentId) {
        fetch(`/Incident/${incidentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error deleting incident');
                }
                return response.json();
            })
            .then(data => {
                console.log('Incident deleted successfully:', data.message); // Access the message property from the JSON response
                fetchData(); // Fetch and display data again to update the table
            })
            .catch(error => {
                console.error('Error deleting incident:', error.message); // Access the error message
                displayErrorMessage('Error deleting incident');
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
        const confirmationMessage = document.getElementById('confirmationMessage');
        confirmationMessage.textContent = `Searching for incident with key: ${searchKey}`;


        // Check if the searchKey is not empty before making the search request
        if (searchKey !== '') {
            searchIncident(searchKey);
        } else {
            fetchData(); // If search bar is empty, fetch all incidents again to reset the table
        }
    });

    // Function to add the
    function searchByKey() {
        const searchKey = document.getElementById('searchKey').value;
        // Add your search logic here
        // For demonstration purposes, displaying a confirmation message
        const confirmationMessage = document.getElementById('confirmationMessage');
        confirmationMessage.textContent = `Searching for incident with key: ${searchKey}`;
        confirmationMessage.style.display = 'block';
    }

    // Additional code for the "Edit" button click
    function editIncident(incidentId) {
        // Fetch the incident data for the specific incidentId using API call (GET request)
        fetch(`/Incident/${incidentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Populate the form fields with the fetched data
                document.getElementById('incidentDate').value = data.occur_DAT;
                document.getElementById('victimRace').value = data.vic_RACE;
                document.getElementById('victimSex').value = data.vic_SEX;
                document.getElementById('borough').value = data.boro;
                document.getElementById('precinct').value = data.precint;

                // Display the incident form and set it in edit mode
                const incidentForm = document.getElementById('incidentForm');
                incidentForm.style.display = 'block';
                incidentForm.dataset.incidentId = incidentId;
            })
            .catch(error => {
                console.error('Error fetching incident data:', error);
                displayErrorMessage('Error fetching incident data. Please try again later.');
            });
    }

    // Function to sort table columns
    function sortTable(columnIndex, sortingOrder) {
        const table = document.getElementById('incidentTable');
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        rows.sort((a, b) => {
            const cellA = a.cells[columnIndex].textContent;
            const cellB = b.cells[columnIndex].textContent;

            // Use the sortingOrder to determine sorting direction
            if (sortingOrder === 'asc') {
                return cellA.localeCompare(cellB);
            } else {
                return cellB.localeCompare(cellA);
            }
        });

        table.querySelector('tbody').innerHTML = ''; // Clear existing rows

        rows.forEach(row => {
            table.querySelector('tbody').appendChild(row);
        });
    }


    const sortingDirections = Array.from({ length: 6 }, () => null);

    // Keep track of sorting order for each column
    const sortingOrders = Array.from({ length: 6 }, () => 'asc'); // Change the length to match the number of columns

    document.querySelectorAll('#incidentTable th').forEach((header, index) => {
        header.addEventListener('click', () => {
            // Toggle sorting order
            sortingOrders[index] = sortingOrders[index] === 'asc' ? 'desc' : 'asc';

            // Update sorting icon
            document.querySelectorAll('#incidentTable th .sort-icon').forEach((icon, iconIndex) => {
                icon.classList.remove('sorted-asc', 'sorted-desc');
                if (iconIndex === index) {
                    icon.classList.add(`sorted-${sortingOrders[index]}`);
                }
            });

            sortTable(index, sortingOrders[index]);
        });
    });

    // Function to handle the "Save" button click and update the incident
    function saveUpdatedIncident() {
        const incidentForm = document.getElementById('incidentForm');
        const incidentId = incidentForm.dataset.incidentId;
        const updatedIncident = {
            occur_DAT: document.getElementById('incidentDate').value.trim(),
            vic_RACE: document.getElementById('victimRace').value.trim(),
            vic_SEX: document.getElementById('victimSex').value.trim(),
            boro: document.getElementById('borough').value.trim(),
            precint: parseInt(document.getElementById('precinct').value.trim()) || 0,
        };

        // Send the updated incident data to the server using an API call (PUT request)
        fetch(`/Incident/${incidentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedIncident)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating incident');
                }
                return response.json();
            })
            .then(data => {
                console.log('Incident updated successfully:', data.message); // Access the message property from the JSON response

                // Hide the incident form after successful update
                incidentForm.style.display = 'none';

                // Clear input fields
                const formInputs = incidentForm.querySelectorAll('input');
                formInputs.forEach(input => (input.value = ''));

                // Display confirmation after Incident updated
                const confirmationMessage = document.getElementById('confirmationMessage');
                confirmationMessage.textContent = 'Incident updated successfully!';
                confirmationMessage.style.display = 'block';

                // Fetch and display data again to update the table
                fetchData();
            })
            .catch(error => {
                console.error('Error updating incident:', error.message); // Access the error message
                displayErrorMessage('Error updating incident');
            });
    }
    function generateCSV(dataArray) {
        const header = ['incident_KEY', 'occur_DAT', 'vic_RACE', 'vic_SEX', 'boro', 'precint'];
        const csvRows = [header.join(',')];

        dataArray.forEach(incident => {
            const values = header.map(key => {
                const value = incident[key] !== null ? incident[key] : 'N/A';
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
    }

    // Function to initiate download of CSV file
    function downloadCSVFile(csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'incident_data.csv';
        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Function to handle the "Export Data" button click
    function handleExportButtonClick() {
        // Fetch data from the API endpoint "/Incident"
        fetch('/Incident')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const csvContent = generateCSV(data);
                downloadCSVFile(csvContent);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                displayErrorMessage('Error fetching data. Please try again later.');
            });
    }


    // Fetch data on page load
    fetchData();
});
