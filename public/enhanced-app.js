// Enhanced HAPI FHIR Patient Manager
// Modern JavaScript with improved error handling, accessibility, and UX

class PatientManager {
    constructor() {
        this.recentPatients = [];
        this.totalCreated = 0;
        this.lastSearchCount = 0;
        this.init();
    }

    init() {
        // Set max date for birth date input (today)
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('birthDate').max = today;
        document.getElementById('birthDate').value = '1990-01-01';
        
        // Bind event listeners
        this.bindEvents();
        
        // Load stats from localStorage
        this.loadStats();
        
        // Check server status
        this.checkServerStatus();
        
        console.log('Enhanced HAPI FHIR Patient Manager initialized');
    }

    bindEvents() {
        // Create form
        document.getElementById('createForm').addEventListener('submit', (e) => this.handleCreatePatient(e));
        
        // Search form
        document.getElementById('searchForm').addEventListener('submit', (e) => this.handleSearchPatients(e));
        
        // Real-time validation
        document.getElementById('firstName').addEventListener('blur', (e) => this.validateField(e.target));
        document.getElementById('lastName').addEventListener('blur', (e) => this.validateField(e.target));
        document.getElementById('email').addEventListener('blur', (e) => this.validateEmail(e.target));
        document.getElementById('phone').addEventListener('blur', (e) => this.validatePhone(e.target));
    }

    // Validation Methods
    validateField(field) {
        const errorSpan = document.getElementById(`${field.id}-error`);
        if (field.required && !field.value.trim()) {
            errorSpan.textContent = 'This field is required';
            field.setAttribute('aria-invalid', 'true');
            return false;
        }
        errorSpan.textContent = '';
        field.setAttribute('aria-invalid', 'false');
        return true;
    }

    validateEmail(field) {
        if (!field.value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorSpan = document.getElementById('email-help');
        if (!emailRegex.test(field.value)) {
            errorSpan.textContent = 'Please enter a valid email address';
            errorSpan.style.color = 'var(--error-600)';
            field.setAttribute('aria-invalid', 'true');
            return false;
        }
        errorSpan.textContent = 'Optional contact email';
        errorSpan.style.color = '';
        field.setAttribute('aria-invalid', 'false');
        return true;
    }

    validatePhone(field) {
        if (!field.value) return true;
        const phoneRegex = /^\d{3}-\d{4}$/;
        const errorSpan = document.getElementById('phone-help');
        if (!phoneRegex.test(field.value)) {
            errorSpan.textContent = 'Please use format: 555-1234';
            errorSpan.style.color = 'var(--error-600)';
            field.setAttribute('aria-invalid', 'true');
            return false;
        }
        errorSpan.textContent = 'Format: 555-1234';
        errorSpan.style.color = '';
        field.setAttribute('aria-invalid', 'false');
        return true;
    }

    // Create Patient Handler
    async handleCreatePatient(e) {
        e.preventDefault();
        
        // Validate all fields
        const form = e.target;
        const isValid = Array.from(form.elements)
            .filter(el => el.tagName === 'INPUT' || el.tagName === 'SELECT')
            .every(el => this.validateField(el));
        
        if (!isValid) {
            this.showResult('createResult', 'Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState('create', true);
        
        const patientData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim()
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
                this.handleCreateSuccess(data, patientData);
            } else {
                throw new Error(data.error || 'Failed to create patient');
            }
        } catch (error) {
            console.error('Error creating patient:', error);
            this.showResult('createResult', `Error: ${error.message}`, 'error');
        } finally {
            this.setLoadingState('create', false);
        }
    }

    handleCreateSuccess(data, patientData) {
        // Show success message
        const successMessage = `
            <div class="alert alert-success">
                <span>✅</span>
                <div>
                    <strong>Patient created successfully!</strong><br>
                    ID: <code>${data.id}</code><br>
                    Name: ${patientData.firstName} ${patientData.lastName}
                </div>
            </div>
        `;
        document.getElementById('createResult').innerHTML = successMessage;
        
        // Add to recent patients
        this.recentPatients.unshift({
            id: data.id,
            name: `${patientData.firstName} ${patientData.lastName}`,
            gender: patientData.gender,
            birthDate: patientData.birthDate,
            phone: patientData.phone,
            email: patientData.email
        });
        
        // Update stats
        this.totalCreated++;
        this.updateStats();
        
        // Update recent patients display
        this.updateRecentPatients();
        
        // Reset form
        document.getElementById('createForm').reset();
        document.getElementById('birthDate').value = '1990-01-01';
        
        // Announce to screen readers
        this.announce('Patient created successfully');
    }

    // Search Patients Handler
    async handleSearchPatients(e) {
        e.preventDefault();
        
        // Show loading state
        this.setLoadingState('search', true);
        
        const name = document.getElementById('searchName').value.trim();
        const gender = document.getElementById('searchGender').value;
        
        let url = '/api/patients?_count=20';
        if (name) url += `&name=${encodeURIComponent(name)}`;
        if (gender) url += `&gender=${gender}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this.displaySearchResults(data.patients);
                this.lastSearchCount = data.total;
                this.updateStats();
            } else {
                throw new Error(data.error || 'Search failed');
            }
        } catch (error) {
            console.error('Error searching patients:', error);
            this.showResult('searchResults', `Error: ${error.message}`, 'error');
        } finally {
            this.setLoadingState('search', false);
        }
    }

    displaySearchResults(patients) {
        const container = document.getElementById('searchResults');
        
        if (!patients || patients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon" aria-hidden="true">🔍</div>
                    <p>No patients found</p>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
            this.announce('No patients found');
            return;
        }
        
        let html = `<p class="search-summary"><strong>Found ${patients.length} patient${patients.length !== 1 ? 's' : ''}</strong></p>`;
        
        patients.forEach(patient => {
            const name = patient.name?.[0];
            const fullName = name ? 
                `${name.given?.join(' ')} ${name.family}`.trim() : 
                'Unnamed Patient';
            
            html += `
                <div class="patient-item" tabindex="0" role="article" aria-label="Patient: ${fullName}">
                    <div class="patient-item-header">
                        <span class="patient-name">${fullName}</span>
                        <span class="patient-id">#${patient.id}</span>
                    </div>
                    <div class="patient-details">
                        <span class="patient-detail">
                            <span aria-hidden="true">👤</span>
                            <span>Gender: ${patient.gender || 'Unknown'}</span>
                        </span>
                        <span class="patient-detail">
                            <span aria-hidden="true">📅</span>
                            <span>Born: ${patient.birthDate || 'Unknown'}</span>
                        </span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        this.announce(`Found ${patients.length} patients`);
    }

    // Recent Patients Display
    updateRecentPatients() {
        const container = document.getElementById('recentPatients');
        
        if (this.recentPatients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon" aria-hidden="true">🆕</div>
                    <p>No patients created yet</p>
                    <p>Create your first patient using the form above</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.recentPatients.slice(0, 5).forEach(patient => {
            html += `
                <div class="patient-item" tabindex="0" role="article" aria-label="Patient: ${patient.name}">
                    <div class="patient-item-header">
                        <span class="patient-name">${patient.name}</span>
                        <span class="patient-id">#${patient.id}</span>
                    </div>
                    <div class="patient-details">
                        <span class="patient-detail">
                            <span aria-hidden="true">👤</span>
                            <span>Gender: ${patient.gender}</span>
                        </span>
                        <span class="patient-detail">
                            <span aria-hidden="true">📅</span>
                            <span>Born: ${patient.birthDate}</span>
                        </span>
                        ${patient.phone ? `
                            <span class="patient-detail">
                                <span aria-hidden="true">📞</span>
                                <span>Phone: ${patient.phone}</span>
                            </span>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Save to localStorage
        this.saveStats();
    }

    // Stats Management
    updateStats() {
        document.getElementById('totalCreated').textContent = this.totalCreated;
        document.getElementById('lastSearchCount').textContent = this.lastSearchCount;
        this.saveStats();
    }

    saveStats() {
        localStorage.setItem('fhir_stats', JSON.stringify({
            totalCreated: this.totalCreated,
            lastSearchCount: this.lastSearchCount,
            recentPatients: this.recentPatients.slice(0, 5)
        }));
    }

    loadStats() {
        const saved = localStorage.getItem('fhir_stats');
        if (saved) {
            const stats = JSON.parse(saved);
            this.totalCreated = stats.totalCreated || 0;
            this.lastSearchCount = stats.lastSearchCount || 0;
            this.recentPatients = stats.recentPatients || [];
            this.updateStats();
            this.updateRecentPatients();
        }
    }

    // Server Status Check
    async checkServerStatus() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            
            if (data.status === 'healthy') {
                document.getElementById('serverStatus').textContent = 'Connected';
                document.getElementById('serverStatus').style.color = 'var(--success-600)';
            } else {
                throw new Error('Server unhealthy');
            }
        } catch (error) {
            document.getElementById('serverStatus').textContent = 'Disconnected';
            document.getElementById('serverStatus').style.color = 'var(--error-600)';
            console.error('Server status check failed:', error);
        }
    }

    // UI Helpers
    setLoadingState(type, isLoading) {
        const btnText = document.getElementById(`${type}BtnText`);
        const loader = document.getElementById(`${type}Loader`);
        const btn = document.getElementById(`${type}Btn`);
        
        if (isLoading) {
            btnText.textContent = type === 'create' ? 'Creating...' : 'Searching...';
            loader.style.display = 'inline-block';
            btn.disabled = true;
        } else {
            btnText.textContent = type === 'create' ? 'Create Patient' : 'Search Patients';
            loader.style.display = 'none';
            btn.disabled = false;
        }
    }

    showResult(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.innerHTML = `
            <div class="alert alert-${type}">
                <span>${type === 'error' ? '❌' : '✅'}</span>
                <span>${message}</span>
            </div>
        `;
    }

    // Accessibility Helper
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new PatientManager();
});