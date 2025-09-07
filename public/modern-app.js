// HAPI FHIR Patient Manager - Modern Enhanced Version
// =====================================================

const API_BASE = 'http://localhost:3000';

// Utility functions
const utils = {
    // Show loading state
    showLoading(element) {
        element.innerHTML = '<div class="loading" aria-label="Loading"></div>';
    },
    
    // Show success message
    showSuccess(element, message) {
        element.innerHTML = `
            <div class="success fade-in" role="alert">
                <span aria-hidden="true">✅</span>
                <span>${message}</span>
            </div>
        `;
        this.autoHide(element);
    },
    
    // Show error message
    showError(element, message) {
        element.innerHTML = `
            <div class="error fade-in" role="alert">
                <span aria-hidden="true">❌</span>
                <span>${message}</span>
            </div>
        `;
        this.autoHide(element);
    },
    
    // Auto hide messages after delay
    autoHide(element, delay = 5000) {
        setTimeout(() => {
            element.classList.add('fade-out');
            setTimeout(() => {
                element.innerHTML = '';
                element.classList.remove('fade-out');
            }, 300);
        }, delay);
    },
    
    // Format date for display
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },
    
    // Validate form inputs
    validateForm(form) {
        const inputs = form.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                this.showFieldError(input, 'This field is required');
            } else {
                this.clearFieldError(input);
            }
        });
        
        // Validate phone if provided
        const phoneInput = form.querySelector('#phone');
        if (phoneInput && phoneInput.value) {
            const phoneValue = this.normalizePhone(phoneInput.value);
            if (!this.isValidPhone(phoneValue)) {
                isValid = false;
                this.showFieldError(phoneInput, 'Please enter a valid phone number (e.g., 555-555-5555)');
            }
        }
        
        return isValid;
    },
    
    // Normalize phone number
    normalizePhone(phone) {
        // Remove all non-digits
        return phone.replace(/\D/g, '');
    },
    
    // Validate phone format
    isValidPhone(phone) {
        // Check if it's 10 digits (US phone)
        const normalized = this.normalizePhone(phone);
        return normalized.length === 10 || normalized.length === 7;
    },
    
    // Format phone for display
    formatPhone(phone) {
        const normalized = this.normalizePhone(phone);
        if (normalized.length === 10) {
            return `${normalized.slice(0,3)}-${normalized.slice(3,6)}-${normalized.slice(6)}`;
        } else if (normalized.length === 7) {
            return `${normalized.slice(0,3)}-${normalized.slice(3)}`;
        }
        return phone;
    },
    
    // Show field error
    showFieldError(input, message) {
        input.classList.add('error');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('sr-only');
        }
    },
    
    // Clear field error
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('sr-only');
        }
    },
    
    // Debounce function for search
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Patient Manager Class
class PatientManager {
    constructor() {
        this.recentPatients = [];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkServerConnection();
        this.loadRecentPatients();
    }
    
    setupEventListeners() {
        // Create form
        const createForm = document.getElementById('createForm');
        if (createForm) {
            createForm.addEventListener('submit', (e) => this.handleCreatePatient(e));
            
            // Add real-time validation
            createForm.querySelectorAll('input[required]').forEach(input => {
                input.addEventListener('blur', () => {
                    if (!input.value.trim()) {
                        utils.showFieldError(input, 'This field is required');
                    } else {
                        utils.clearFieldError(input);
                    }
                });
            });
            
            // Add phone formatting
            const phoneInput = createForm.querySelector('#phone');
            if (phoneInput) {
                phoneInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    const numbers = value.replace(/\D/g, '');
                    
                    // Auto-format as user types
                    if (numbers.length <= 3) {
                        e.target.value = numbers;
                    } else if (numbers.length <= 6) {
                        e.target.value = `${numbers.slice(0,3)}-${numbers.slice(3)}`;
                    } else if (numbers.length <= 10) {
                        e.target.value = `${numbers.slice(0,3)}-${numbers.slice(3,6)}-${numbers.slice(6,10)}`;
                    } else {
                        // Don't allow more than 10 digits
                        e.target.value = `${numbers.slice(0,3)}-${numbers.slice(3,6)}-${numbers.slice(6,10)}`;
                    }
                });
                
                phoneInput.addEventListener('blur', () => {
                    if (phoneInput.value && !utils.isValidPhone(phoneInput.value)) {
                        utils.showFieldError(phoneInput, 'Please enter a valid phone number');
                    } else {
                        utils.clearFieldError(phoneInput);
                    }
                });
            }
        }
        
        // Search form
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearchPatients(e));
            
            // Add live search with debouncing
            const searchNameInput = document.getElementById('searchName');
            if (searchNameInput) {
                searchNameInput.addEventListener('input', 
                    utils.debounce(() => this.performSearch(), 500)
                );
            }
        }
    }
    
    async checkServerConnection() {
        const statusElement = document.querySelector('.status');
        if (!statusElement) return;
        
        try {
            const response = await fetch(`${API_BASE}/health`);
            if (response.ok) {
                statusElement.innerHTML = 'Connected to HAPI FHIR Server';
                statusElement.classList.add('success');
            } else {
                throw new Error('Server not responding');
            }
        } catch (error) {
            statusElement.innerHTML = 'Disconnected from server';
            statusElement.classList.add('error');
            statusElement.classList.remove('success');
        }
    }
    
    async handleCreatePatient(event) {
        event.preventDefault();
        
        const form = event.target;
        const resultDiv = document.getElementById('createResult');
        
        // Validate form
        if (!utils.validateForm(form)) {
            return;
        }
        
        // Show loading state
        utils.showLoading(resultDiv);
        
        // Collect form data
        const patientData = {
            resourceType: 'Patient',
            active: true,
            name: [{
                use: 'official',
                family: form.lastName.value.trim(),
                given: [form.firstName.value.trim()]
            }],
            gender: form.gender.value,
            birthDate: form.birthDate.value,
            telecom: []
        };
        
        // Add phone if provided
        if (form.phone.value) {
            patientData.telecom.push({
                system: 'phone',
                value: form.phone.value,
                use: 'mobile'
            });
        }
        
        // Add email if provided
        if (form.email.value) {
            patientData.telecom.push({
                system: 'email',
                value: form.email.value,
                use: 'home'
            });
        }
        
        try {
            // Format phone number before sending
            const phoneValue = form.phone.value ? utils.formatPhone(form.phone.value) : '';
            
            const response = await fetch(`${API_BASE}/api/patient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: form.firstName.value.trim(),
                    lastName: form.lastName.value.trim(),
                    birthDate: form.birthDate.value,
                    gender: form.gender.value,
                    phone: phoneValue,
                    email: form.email.value
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                utils.showSuccess(resultDiv, 
                    `Patient created successfully! ID: ${result.id}`
                );
                
                // Add to recent patients
                this.addToRecentPatients(result.patient || result);
                
                // Reset form with animation
                form.classList.add('fade-out');
                setTimeout(() => {
                    form.reset();
                    form.classList.remove('fade-out');
                    form.classList.add('fade-in');
                    setTimeout(() => form.classList.remove('fade-in'), 300);
                }, 300);
            } else {
                const error = await response.text();
                throw new Error(error || 'Failed to create patient');
            }
        } catch (error) {
            console.error('Error creating patient:', error);
            utils.showError(resultDiv, 
                `Error: ${error.message || 'Failed to create patient'}`
            );
        }
    }
    
    async handleSearchPatients(event) {
        event.preventDefault();
        await this.performSearch();
    }
    
    async performSearch() {
        const resultsDiv = document.getElementById('searchResults');
        const searchName = document.getElementById('searchName').value.trim();
        const searchGender = document.getElementById('searchGender').value;
        
        // Show loading state
        utils.showLoading(resultsDiv);
        
        // Build search parameters
        const params = new URLSearchParams();
        if (searchName) {
            params.append('name', searchName);
        }
        if (searchGender) {
            params.append('gender', searchGender);
        }
        
        try {
            const response = await fetch(`${API_BASE}/api/patients?${params}`);
            
            if (response.ok) {
                const data = await response.json();
                this.displaySearchResults(data, resultsDiv);
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Error searching patients:', error);
            utils.showError(resultsDiv, 
                `Error: ${error.message || 'Search failed'}`
            );
        }
    }
    
    displaySearchResults(data, container) {
        const patients = data.patients || [];
        
        if (patients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No patients found. Try adjusting your search criteria.</p>
                </div>
            `;
            return;
        }
        
        const html = patients.map(patient => {
            return this.createPatientCard(patient);
        }).join('');
        
        container.innerHTML = `
            <div class="results-header">
                <small>Found ${patients.length} patient${patients.length !== 1 ? 's' : ''}</small>
            </div>
            ${html}
        `;
        
        // Add click handlers for patient cards
        container.querySelectorAll('.patient-item').forEach(item => {
            item.addEventListener('click', () => {
                this.showPatientDetails(item.dataset.patientId);
            });
        });
    }
    
    createPatientCard(patient) {
        const name = patient.name?.[0] || {};
        const fullName = `${name.given?.join(' ') || ''} ${name.family || ''}`.trim() || 'Unknown';
        const birthDate = patient.birthDate ? utils.formatDate(patient.birthDate) : 'Unknown';
        const gender = patient.gender || 'Unknown';
        const phone = patient.telecom?.find(t => t.system === 'phone')?.value || 'No phone';
        const email = patient.telecom?.find(t => t.system === 'email')?.value || 'No email';
        
        return `
            <div class="patient-item slide-up" 
                 data-patient-id="${patient.id}"
                 tabindex="0"
                 role="article"
                 aria-label="Patient: ${fullName}">
                <strong>${fullName}</strong>
                <div class="patient-meta">
                    <span><span aria-hidden="true">🎂</span> ${birthDate}</span>
                    <span><span aria-hidden="true">👤</span> ${gender}</span>
                </div>
                <div class="patient-meta">
                    <span><span aria-hidden="true">📱</span> ${phone}</span>
                    <span><span aria-hidden="true">✉️</span> ${email}</span>
                </div>
                <small>ID: ${patient.id}</small>
            </div>
        `;
    }
    
    addToRecentPatients(patient) {
        // Add to beginning of array
        this.recentPatients.unshift(patient);
        
        // Keep only last 5 patients
        if (this.recentPatients.length > 5) {
            this.recentPatients = this.recentPatients.slice(0, 5);
        }
        
        // Update display
        this.displayRecentPatients();
        
        // Save to localStorage
        this.saveRecentPatients();
    }
    
    displayRecentPatients() {
        const container = document.getElementById('recentPatients');
        if (!container) return;
        
        if (this.recentPatients.length === 0) {
            container.innerHTML = `
                <p class="empty-state">
                    No patients created yet. Create your first patient using the form above.
                </p>
            `;
            return;
        }
        
        const html = this.recentPatients.map(patient => 
            this.createPatientCard(patient)
        ).join('');
        
        container.innerHTML = html;
        
        // Add click handlers
        container.querySelectorAll('.patient-item').forEach(item => {
            item.addEventListener('click', () => {
                this.showPatientDetails(item.dataset.patientId);
            });
        });
    }
    
    async showPatientDetails(patientId) {
        // This could open a modal or navigate to a details page
        console.log(`Showing details for patient ${patientId}`);
        
        try {
            const response = await fetch(`${API_BASE}/api/patient/${patientId}`);
            if (response.ok) {
                const patient = await response.json();
                // You could display this in a modal
                console.log('Patient details:', patient);
                alert(`Patient Details:\n\nID: ${patient.id}\nName: ${patient.name?.[0]?.given?.join(' ')} ${patient.name?.[0]?.family}`);
            }
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    }
    
    saveRecentPatients() {
        localStorage.setItem('recentPatients', JSON.stringify(this.recentPatients));
    }
    
    loadRecentPatients() {
        const saved = localStorage.getItem('recentPatients');
        if (saved) {
            try {
                this.recentPatients = JSON.parse(saved);
                this.displayRecentPatients();
            } catch (error) {
                console.error('Error loading recent patients:', error);
                this.recentPatients = [];
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const patientManager = new PatientManager();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Press '/' to focus search
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            const searchInput = document.getElementById('searchName');
            if (searchInput && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
    
    // Log successful initialization
    console.log('HAPI FHIR Patient Manager - Modern UI Ready');
});