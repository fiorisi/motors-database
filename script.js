// Fetch the JSON data and populate the table
fetch('data.json')
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
        { key: 'cooling', label: 'Cooling', type: 'select' },
        { key: 'rated_voltage_v', label: 'Rated Voltage (V)', type: 'select' },
        // For Continuous Torque and Diameter, we'll use min/max inputs
        { key: 'continuous_torque_nm', label: 'Continuous Torque (Nm)', type: 'range' },
        { key: 'peak_torque_nm', label: 'Peak Torque (Nm)', type: 'select' },
        { key: 'max_rotation_speed_rpm', label: 'Max Rotation Speed (rpm)', type: 'select' },
        { key: 'pole_pairs', label: 'Pole Pairs', type: 'select' },
        { key: 'rotor_inertia_kg_cm2', label: 'Rotor Inertia (kg·cm²)', type: 'select' },
        { key: 'diameter_mm', label: 'Diameter (mm)', type: 'range' },
        { key: 'length_mm', label: 'Length (mm)', type: 'select' },
        { key: 'weight_g', label: 'Weight (g)', type: 'select' },
        { key: 'rotor_inner_diameter_mm', label: 'Rotor Inner Diameter (mm)', type: 'select' }
    ];

    filterParams.forEach(param => {
        if (param.type === 'select') {
            createSelectFilter(motors, param.key, param.label);
        } else if (param.type === 'range') {
            createRangeFilter(motors, param.key, param.label);
        }
    });
}

function createSelectFilter(motors, key, labelText) {
    const filtersDiv = document.getElementById('filters');

    const values = [...new Set(motors.map(motor => motor[key]).filter(value => value !== null && value !== undefined))];

    // Skip creating the filter if there are no valid values
    if (values.length === 0) return;

    // Sort values
    values.sort((a, b) => (a > b ? 1 : -1));

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

function createRangeFilter(motors, key, labelText) {
    const filtersDiv = document.getElementById('filters');

    const values = motors.map(motor => motor[key]).filter(value => typeof value === 'number');

    if (values.length === 0) return;

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const label = document.createElement('label');
    label.textContent = `${labelText}: `;

    const minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.id = `${key}-min-filter`;
    minInput.placeholder = `Min (${minValue})`;
    minInput.style.marginRight = '5px';

    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.id = `${key}-max-filter`;
    maxInput.placeholder = `Max (${maxValue})`;

    minInput.addEventListener('input', () => {
        applyFilters(motors);
    });

    maxInput.addEventListener('input', () => {
        applyFilters(motors);
    });

    label.appendChild(minInput);
    label.appendChild(maxInput);
    filtersDiv.appendChild(label);
}

function applyFilters(motors) {
    const filterParams = [
        { key: 'cooling', type: 'select' },
        { key: 'rated_voltage_v', type: 'select' },
        { key: 'continuous_torque_nm', type: 'range' },
        { key: 'peak_torque_nm', type: 'select' },
        { key: 'max_rotation_speed_rpm', type: 'select' },
        { key: 'pole_pairs', type: 'select' },
        { key: 'rotor_inertia_kg_cm2', type: 'select' },
        { key: 'diameter_mm', type: 'range' },
        { key: 'length_mm', type: 'select' },
        { key: 'weight_g', type: 'select' },
        { key: 'rotor_inner_diameter_mm', type: 'select' }
    ];

    let filteredMotors = motors;

    filterParams.forEach(param => {
        if (param.type === 'select') {
            const filterValue = document.getElementById(`${param.key}-filter`).value;
            if (filterValue !== '') {
                filteredMotors = filteredMotors.filter(motor => {
                    const motorValue = motor[param.key];
                    if (motorValue === null || motorValue === undefined) {
                        return false;
                    }
                    return motorValue.toString() === filterValue;
                });
            }
        } else if (param.type === 'range') {
            const minFilterValue = document.getElementById(`${param.key}-min-filter`).value;
            const maxFilterValue = document.getElementById(`${param.key}-max-filter`).value;

            filteredMotors = filteredMotors.filter(motor => {
                const motorValue = motor[param.key];
                if (typeof motorValue !== 'number') {
                    return false;
                }

                if (minFilterValue && motorValue < parseFloat(minFilterValue)) {
                    return false;
                }
                if (maxFilterValue && motorValue > parseFloat(maxFilterValue)) {
                    return false;
                }
                return true;
            });
        }
    });

    populateTable(filteredMotors);
}
