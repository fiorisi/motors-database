// Fetch the JSON data and populate the table
fetch('motors_complete.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(motors => {
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
            <td>${motor.rated_voltage_v !== null ? motor.rated_voltage_v : ''}</td>
            <td>${motor.continuous_torque_nm !== null ? motor.continuous_torque_nm : ''}</td>
            <td>${motor.peak_torque_nm !== null ? motor.peak_torque_nm : ''}</td>
            <td>${motor.max_rotation_speed_rpm !== null ? motor.max_rotation_speed_rpm : ''}</td>
            <td>${motor.pole_pairs !== null ? motor.pole_pairs : ''}</td>
            <td>${motor.rotor_inertia_kg_cm2 !== null ? motor.rotor_inertia_kg_cm2 : ''}</td>
            <td>${motor.diameter_mm !== null ? motor.diameter_mm : ''}</td>
            <td>${motor.length_mm !== null ? motor.length_mm : ''}</td>
            <td>${motor.weight_g !== null ? motor.weight_g : ''}</td>
            <td>${motor.rotor_inner_diameter_mm !== null ? motor.rotor_inner_diameter_mm : ''}</td>
        `;

        tbody.appendChild(row);
    });
}

function generateFilters(motors) {
    const filtersDiv = document.getElementById('filters');
    filtersDiv.innerHTML = ''; // Clear any existing filters

    // Define the parameters you want to create filters for
    const filterParams = [
        { key: 'cooling', label: 'Cooling' },
        { key: 'rated_voltage_v', label: 'Rated Voltage (V)' },
        { key: 'continuous_torque_nm', label: 'Continuous Torque (Nm)' },
        { key: 'peak_torque_nm', label: 'Peak Torque (Nm)' },
        { key: 'max_rotation_speed_rpm', label: 'Max Rotation Speed (rpm)' },
        { key: 'pole_pairs', label: 'Pole Pairs' },
        { key: 'rotor_inertia_kg_cm2', label: 'Rotor Inertia (kg·cm²)' },
        { key: 'diameter_mm', label: 'Diameter (mm)' },
        { key: 'length_mm', label: 'Length (mm)' },
        { key: 'weight_g', label: 'Weight (g)' },
        { key: 'rotor_inner_diameter_mm', label: 'Rotor Inner Diameter (mm)' }
    ];

    filterParams.forEach(param => {
        createFilter(motors, param.key, param.label);
    });
}

function createFilter(motors, key, labelText) {
    const filtersDiv = document.getElementById('filters');

    const values = [...new Set(motors.map(motor => motor[key]).filter(value => value !== null && value !== undefined))];

    // Skip creating the filter if there are no valid values
    if (values.length === 0) return;

    // Sort values if they are numbers
    if (typeof values[0] === 'number') {
        values.sort((a, b) => a - b);
    } else {
        values.sort();
    }

    const label = document.createElement('label');
    label.textContent = `${labelText}: `;

    const select = document.createElement('select');
    select.id = `${key}-filter`;

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All';
    select.appendChild(allOption);

    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        applyFilters(motors);
    });

    label.appendChild(select);
    filtersDiv.appendChild(label);
}

function applyFilters(motors) {
    const filterParams = [
        'cooling',
        'rated_voltage_v',
        'continuous_torque_nm',
        'peak_torque_nm',
        'max_rotation_speed_rpm',
        'pole_pairs',
        'rotor_inertia_kg_cm2',
        'diameter_mm',
        'length_mm',
        'weight_g',
        'rotor_inner_diameter_mm'
    ];

    let filteredMotors = motors;

    filterParams.forEach(param => {
        const filterValue = document.getElementById(`${param}-filter`).value;

        if (filterValue !== '') {
            filteredMotors = filteredMotors.filter(motor => {
                const motorValue = motor[param];

                if (motorValue === null || motorValue === undefined) {
                    return false;
                }

                if (typeof motorValue === 'number') {
                    return motorValue.toString() === filterValue;
                } else {
                    return motorValue === filterValue;
                }
            });
        }
    });

    populateTable(filteredMotors);
}
