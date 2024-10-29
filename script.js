// Fetch the JSON data and populate the table
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const motors = data;
        generateFilters(motors);
        populateTable(motors);
    })
    .catch(error => console.error('Error fetching data:', error));

function populateTable(motors) {
    const tbody = document.querySelector('#motor-table tbody');
    tbody.innerHTML = '';

    motors.forEach(motor => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${motor.name || ''}</td>
            <td>${motor.cooling || ''}</td>
            <td>${motor.rated_voltage_v || ''}</td>
            <td>${motor.continuous_torque_nm || ''}</td>
            <td>${motor.peak_torque_nm || ''}</td>
            <td>${motor.max_rotation_speed_rpm || ''}</td>
            <td>${motor.pole_pairs || ''}</td>
            <td>${motor.rotor_inertia_kg_cm2 || ''}</td>
            <td>${motor.diameter_mm || ''}</td>
            <td>${motor.length_mm || ''}</td>
            <td>${motor.weight_g || ''}</td>
            <td>${motor.rotor_inner_diameter_mm || ''}</td>
        `;

        tbody.appendChild(row);
    });
}

function generateFilters(motors) {
    const filtersDiv = document.getElementById('filters');

    // Example: Create a filter for Cooling
    const coolingTypes = [...new Set(motors.map(motor => motor.cooling).filter(Boolean))];

    const coolingLabel = document.createElement('label');
    coolingLabel.textContent = 'Cooling: ';
    const coolingSelect = document.createElement('select');
    coolingSelect.id = 'cooling-filter';

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All';
    coolingSelect.appendChild(allOption);

    coolingTypes.forEach(cooling => {
        const option = document.createElement('option');
        option.value = cooling;
        option.textContent = cooling;
        coolingSelect.appendChild(option);
    });

    coolingSelect.addEventListener('change', () => {
        applyFilters(motors);
    });

    coolingLabel.appendChild(coolingSelect);
    filtersDiv.appendChild(coolingLabel);

    // Example: Filter for Diameter
    const diameters = [...new Set(motors.map(motor => motor.diameter_mm).filter(Boolean))].sort((a, b) => a - b);

    const diameterLabel = document.createElement('label');
    diameterLabel.textContent = 'Diameter: ';
    const diameterSelect = document.createElement('select');
    diameterSelect.id = 'diameter-filter';

    const allDiameterOption = document.createElement('option');
    allDiameterOption.value = '';
    allDiameterOption.textContent = 'All';
    diameterSelect.appendChild(allDiameterOption);

    diameters.forEach(diameter => {
        const option = document.createElement('option');
        option.value = diameter;
        option.textContent = diameter;
        diameterSelect.appendChild(option);
    });

    diameterSelect.addEventListener('change', () => {
        applyFilters(motors);
    });

    diameterLabel.appendChild(diameterSelect);
    filtersDiv.appendChild(diameterLabel);

    // You can add more filters in a similar fashion
}

function applyFilters(motors) {
    const coolingFilter = document.getElementById('cooling-filter').value;
    const diameterFilter = document.getElementById('diameter-filter').value;

    let filteredMotors = motors;

    if (coolingFilter) {
        filteredMotors = filteredMotors.filter(motor => motor.cooling === coolingFilter);
    }

    if (diameterFilter) {
        filteredMotors = filteredMotors.filter(motor => motor.diameter_mm == diameterFilter);
    }

    // Add more filter conditions as needed

    populateTable(filteredMotors);
}
