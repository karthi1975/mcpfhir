// HAPI FHIR Patient Manager
let recentPatients = [];

// Create Patient
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const patientData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };
    
    try {
        const response = await fetch('/api/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('createResult').innerHTML = `
                <div class="success">
                    ✅ Patient created successfully!<br>
                    ID: ${data.id}<br>
                    Name: ${patientData.firstName} ${patientData.lastName}
                </div>
            `;
            
            // Add to recent patients
            recentPatients.unshift({
                id: data.id,
                name: `${patientData.firstName} ${patientData.lastName}`,
                gender: patientData.gender,
                birthDate: patientData.birthDate
            });
            
            updateRecentPatients();
            document.getElementById('createForm').reset();
            document.getElementById('birthDate').value = '1990-01-01';
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        document.getElementById('createResult').innerHTML = `
            <div class="error">❌ Error: ${error.message}</div>
        `;
    }
});

// Search Patients
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('searchName').value;
    const gender = document.getElementById('searchGender').value;
    
    let url = '/api/patients?_count=20';
    if (name) url += `&name=${name}`;
    if (gender) url += `&gender=${gender}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            let html = `<p><strong>Found ${data.total} patients</strong></p>`;
            
            if (data.patients.length > 0) {
                data.patients.forEach(patient => {
                    const name = patient.name?.[0];
                    const fullName = name ? 
                        `${name.given?.join(' ')} ${name.family}`.trim() : 
                        'Unnamed';
                    
                    html += `
                        <div class="patient-item">
                            <strong>${fullName}</strong>
                            <small>
                                ID: ${patient.id}<br>
                                Gender: ${patient.gender || 'Unknown'}<br>
                                Birth: ${patient.birthDate || 'Unknown'}
                            </small>
                        </div>
                    `;
                });
            } else {
                html += '<p>No patients found</p>';
            }
            
            document.getElementById('searchResults').innerHTML = html;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        document.getElementById('searchResults').innerHTML = `
            <div class="error">❌ Error: ${error.message}</div>
        `;
    }
});

// Update Recent Patients Display
function updateRecentPatients() {
    if (recentPatients.length === 0) {
        document.getElementById('recentPatients').innerHTML = 'No patients created yet';
        return;
    }
    
    let html = '';
    recentPatients.slice(0, 5).forEach(patient => {
        html += `
            <div class="patient-item">
                <strong>${patient.name}</strong>
                <small>
                    ID: ${patient.id}<br>
                    Gender: ${patient.gender}<br>
                    Birth: ${patient.birthDate}
                </small>
            </div>
        `;
    });
    
    document.getElementById('recentPatients').innerHTML = html;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('HAPI FHIR Patient Manager Ready');
    document.getElementById('birthDate').value = '1990-01-01';
});