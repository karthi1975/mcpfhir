const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// FHIR Server URL - Using environment variable or default
const HAPI_BASE_URL = process.env.FHIR_BASE_URL || 'https://launch.smarthealthit.org/v/r4/fhir';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HAPI FHIR Patient Manager'
  });
});

// Create patient
app.post('/api/patient', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, gender, phone, email } = req.body;
    
    const patient = {
      resourceType: 'Patient',
      identifier: [{
        system: 'http://example.org/patients',
        value: `patient-${Date.now()}`
      }],
      active: true,
      name: [{
        use: 'official',
        family: lastName,
        given: [firstName]
      }],
      gender: gender,
      birthDate: birthDate,
      telecom: []
    };
    
    if (phone) {
      patient.telecom.push({
        system: 'phone',
        value: phone,
        use: 'mobile'
      });
    }
    
    if (email) {
      patient.telecom.push({
        system: 'email',
        value: email
      });
    }
    
    const response = await axios.post(
      `${HAPI_BASE_URL}/Patient`,
      patient,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
    
    res.json({
      success: true,
      id: response.data.id,
      patient: response.data
    });
    
  } catch (error) {
    console.error('Error creating patient:', error.message);
    if (error.response && error.response.data) {
      console.error('HAPI Server Response:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(500).json({
      success: false,
      error: `HAPI Server Error: ${error.message}. The public HAPI test server may be temporarily unavailable. Please try again in a moment.`,
      details: error.response?.data
    });
  }
});

// Search patients
app.get('/api/patients', async (req, res) => {
  try {
    const { name, gender, _count = 10 } = req.query;
    
    let url = `${HAPI_BASE_URL}/Patient?_count=${_count}`;
    if (name) url += `&name=${name}`;
    if (gender) url += `&gender=${gender}`;
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/fhir+json'
      }
    });
    
    const patients = response.data.entry ? 
      response.data.entry.map(e => e.resource) : [];
    
    res.json({
      success: true,
      total: response.data.total || 0,
      patients: patients
    });
    
  } catch (error) {
    console.error('Error searching patients:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get patient by ID
app.get('/api/patient/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${HAPI_BASE_URL}/Patient/${req.params.id}`,
      {
        headers: {
          'Accept': 'application/fhir+json'
        }
      }
    );
    
    res.json({
      success: true,
      patient: response.data
    });
    
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Patient not found'
    });
  }
});

app.listen(PORT, () => {
  console.log(`HAPI FHIR App running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});