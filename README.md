# HAPI FHIR Patient Manager

A modern, responsive patient management system using the HAPI FHIR public server with enhanced UI/UX design.

## 🌟 Features

- ✅ **Modern Responsive UI** - Beautiful gradient design with animations
- ✅ **Phone Validation** - Auto-formats US phone numbers (555-555-5555)
- ✅ **Accessibility** - WCAG 2.1 AA compliant with ARIA labels
- ✅ **Create Patients** - Full demographics with real-time validation
- ✅ **Search Patients** - By name and gender with live search
- ✅ **FHIR R4 Compliant** - Full Patient resource implementation
- ✅ **No Authentication** - Uses public FHIR test server
- ✅ **Production Ready** - Docker & Railway deployment configs

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

1. Open http://localhost:3000 in your browser (loads modern UI by default)
2. Create a patient using the form with auto-formatting phone numbers
3. Search for patients with live search
4. View patient details

### Available UIs
- **Modern UI (Default)**: http://localhost:3000 or http://localhost:3000/modern-index.html
- **Original UI**: http://localhost:3000/index.html

## API Endpoints

- `POST /api/patient` - Create a new patient
- `GET /api/patients` - Search patients
- `GET /api/patient/:id` - Get patient by ID
- `GET /health` - Health check

## Project Structure

```
hapi-fhir-app/
├── server.js              # Express server (serves modern UI by default)
├── package.json           # Dependencies
├── railway.json           # Railway deployment config
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── public/
│   ├── modern-index.html  # Modern UI (DEFAULT)
│   ├── modern-styles.css  # Enhanced CSS with animations
│   ├── modern-app.js      # Enhanced JS with phone formatting
│   ├── index.html         # Original UI
│   ├── styles.css         # Original styles
│   └── app.js             # Original frontend logic
├── DEPLOYMENT-GUIDE.md    # Complete deployment instructions
├── FHIR-STRUCTURE-DOCUMENTATION.md  # FHIR resource guide
└── README.md              # Documentation
```

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## License

MIT