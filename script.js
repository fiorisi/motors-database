let motorData = [];

// Fetch data from the new JSON file structure
fetch("motors.json")
    .then(response => response.json())
    .then(data => {
        motorData = data.motors;
    })
    .catch(error => console.error("Error loading data:", error));

// Filter motors based on user input for diameter and continuous torque
function filterMotors() {
    const minDiameter = parseFloat(document.getElementById("diameter-min").value);
    const maxDiameter = parseFloat(document.getElementById("diameter-max").value);
    const minTorque = parseFloat(document.getElementById("torque-min").value);
    const maxTorque = parseFloat(document.getElementById("torque-max").value);

    const filteredMotors = motorData.filter(motor => {
        return (!minDiameter || motor.diameter_mm >= minDiameter) &&
               (!maxDiameter || motor.diameter_mm <= maxDiameter) &&
               (!minTorque || motor.continuous_torque_nm >= minTorque) &&
               (!maxTorque || motor.continuous_torque_nm <= maxTorque);
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
            <td>${motor.name || "-"}</td>
            <td>${motor.cooling || "-"}</td>
            <td>${motor.rated_voltage_v !== null ? motor.rated_voltage_v : "-"}</td>
            <td>${motor.continuous_torque_nm !== null ? motor.continuous_torque_nm : "-"}</td>
            <td>${motor.peak_torque_nm !== null ? motor.peak_torque_nm : "-"}</td>
            <td>${motor.max_power_w !== null ? motor.max_power_w : "-"}</td>
            <td>${motor.max_rotation_speed_rpm !== null ? motor.max_rotation_speed_rpm : "-"}</td>
            <td>${motor.pole_pairs !== null ? motor.pole_pairs : "-"}</td>
            <td>${motor.rotor_inertia_kg_cm2 !== null ? motor.rotor_inertia_kg_cm2 : "-"}</td>
            <td>${motor.diameter_mm !== null ? motor.diameter_mm : "-"}</td>
            <td>${motor.length_mm !== null ? motor.length_mm : "-"}</td>
            <td>${motor.weight_g !== null ? motor.weight_g : "-"}</td>
            <td>${motor.rotor_inner_diameter_mm !== null ? motor.rotor_inner_diameter_mm : "-"}</td>
        `;
        resultsBody.appendChild(row);
    });
}
