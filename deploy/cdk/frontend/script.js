const API_URL = 'PLACEHOLDERdata';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchVisitors').addEventListener('click', async () => {
        const city = prompt("Enter city to query visitors:");
        if (!city) {
            alert("City is required");
            return;
        }

        try {
            const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched visitors:', data);

            const output = document.getElementById('output');
            output.textContent = JSON.stringify(data.items, null, 2);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data. Check console for details.");
        }
    });

    document.getElementById('addVisitor').addEventListener('click', async () => {
        const city = prompt("Enter your city where you live:");
        const firstname = prompt("Enter your first name");
        const yearofbirth = prompt("Enter year of your birth:");
        if (!city || !firstname || !yearofbirth) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ city, firstname, yearofbirth }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Add data response:', data);
            alert("Item added successfully");
        } catch (error) {
            console.error("Error adding data:", error);
            alert("Error adding data. Check console for details.");
        }
    });
});
