let motorData = [];

// Fetch data from the JSON file
fetch("motors.json")
    .then(response => response.json())
    .then(data => {
        motorData = data.motors;
    })
    .catch(error => console.error("Error loading data:", error));

// Filter motors based on user input
function filterMotors() {
    const minDiameter = parseFloat(document.getElementById("diameter-min").value);
    const maxDiameter = parseFloat(document.getElementById("diameter-max").value);

    const filteredMotors = motorData.filter(motor => {
        return (!minDiameter || motor.diameter_mm >= minDiameter) &&
               (!maxDiameter || motor.diameter_mm <= maxDiameter);
    });

    displayResults(filteredMotors);
}

// Display results in the table
function displayResults(motors) {
    const resultsBody = document.getElementById("results-body");
    resultsBody.innerHTML = "";

    motors.forEach(motor => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${motor.model}</td>
            <td>${motor.series}</td>
            <td>${motor.outer_diameter}</td>
            <td>${motor.length}</td>
            <td>${motor.voltage}</td>
            <td>${motor.continuous_torque_nm}</td>
            <td>${motor.rated_speed_rpm}</td>
            <td>${motor.rated_power_kw}</td>
            <td>${motor.weight_kg}</td>
        `;
        resultsBody.appendChild(row);
    });
}
