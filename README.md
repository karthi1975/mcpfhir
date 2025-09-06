# HAPI FHIR Patient Manager

A simple, clean patient management system using the HAPI FHIR public server. No authentication required!

## Features

- ✅ Create patients with full demographics
- ✅ Search patients by name and gender
- ✅ View patient details
- ✅ No authentication needed
- ✅ Uses HAPI FHIR public server
- ✅ Clean, modern UI

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **FHIR Server**: HAPI FHIR (https://hapi.fhir.org)
- **Standard**: FHIR R4

## Installation

```bash
# Clone the repository
git clone https://github.com/karthi1975/hapi-fhir-app.git

# Navigate to project
cd hapi-fhir-app

# Install dependencies
npm install

# Start the server
npm start
```

## Usage

1. Open http://localhost:3000 in your browser
2. Create a patient using the form
3. Search for patients
4. View patient details

## API Endpoints

- `POST /api/patient` - Create a new patient
- `GET /api/patients` - Search patients
- `GET /api/patient/:id` - Get patient by ID
- `GET /health` - Health check

## Project Structure

```
hapi-fhir-app/
├── server.js           # Express server
├── package.json        # Dependencies
├── public/
│   ├── index.html     # Main page
│   ├── styles.css     # Styles
│   └── app.js         # Frontend logic
└── README.md          # Documentation
```

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## License

MIT