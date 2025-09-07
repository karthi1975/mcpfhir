# FHIR (Fast Healthcare Interoperability Resources) Complete Guide

## What is FHIR?

FHIR (pronounced "fire") is a standard for exchanging healthcare information electronically. Developed by HL7 (Health Level Seven International), FHIR combines the best features of HL7's v2, v3, and CDA standards while leveraging modern web technologies.

## Key FHIR Concepts

### 1. Resources
FHIR is built around the concept of "Resources" - modular components that represent healthcare concepts:

- **Clinical Resources**: Patient, Practitioner, Condition, Medication, Procedure
- **Administrative Resources**: Organization, Location, Appointment, Encounter
- **Financial Resources**: Claim, Coverage, PaymentNotice
- **Workflow Resources**: Task, ServiceRequest, CarePlan

### 2. RESTful API
FHIR uses standard HTTP methods:
- `GET` - Read resources
- `POST` - Create new resources
- `PUT` - Update existing resources
- `DELETE` - Delete resources
- `PATCH` - Partial updates

### 3. Data Formats
FHIR supports multiple formats:
- JSON (most common)
- XML
- RDF/Turtle

## FHIR Patient Resource - Complete Specification

### Core Patient Elements

```json
{
  "resourceType": "Patient",
  "id": "example-patient-001",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2025-01-07T10:00:00Z",
    "profile": ["http://hl7.org/fhir/StructureDefinition/Patient"]
  },
  
  // Identifiers - Multiple identification systems
  "identifier": [
    {
      "use": "usual",
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "MR",
          "display": "Medical record number"
        }]
      },
      "system": "http://hospital.example.org",
      "value": "MRN-123456",
      "period": {
        "start": "2025-01-01"
      },
      "assigner": {
        "display": "Example Hospital"
      }
    },
    {
      "use": "official",
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "SS",
          "display": "Social Security number"
        }]
      },
      "system": "http://hl7.org/fhir/sid/us-ssn",
      "value": "123-45-6789"
    },
    {
      "use": "secondary",
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "DL",
          "display": "Driver's license number"
        }]
      },
      "system": "urn:oid:2.16.840.1.113883.4.3.25",
      "value": "S99999999"
    }
  ],
  
  // Active status
  "active": true,
  
  // Name(s) - Can have multiple names
  "name": [
    {
      "use": "official",
      "family": "Smith",
      "given": ["John", "Robert"],
      "prefix": ["Dr."],
      "suffix": ["Jr.", "MD"],
      "period": {
        "start": "2020-01-01"
      }
    },
    {
      "use": "nickname",
      "given": ["Johnny"]
    },
    {
      "use": "maiden",
      "family": "Johnson",
      "given": ["John", "Robert"]
    }
  ],
  
  // Telecommunications
  "telecom": [
    {
      "system": "phone",
      "value": "555-555-5555",
      "use": "home",
      "rank": 1
    },
    {
      "system": "phone",
      "value": "555-123-4567",
      "use": "work",
      "rank": 2
    },
    {
      "system": "phone",
      "value": "555-999-8888",
      "use": "mobile",
      "rank": 1
    },
    {
      "system": "email",
      "value": "john.smith@example.com",
      "use": "home"
    },
    {
      "system": "email",
      "value": "jsmith@workplace.com",
      "use": "work"
    }
  ],
  
  // Gender
  "gender": "male",
  
  // Birth Date
  "birthDate": "1970-05-15",
  
  // Deceased status
  "deceasedBoolean": false,
  // OR
  "deceasedDateTime": "2025-01-01T10:00:00Z",
  
  // Address(es)
  "address": [
    {
      "use": "home",
      "type": "both",
      "text": "123 Main St, Apt 4B, Boston, MA 02101, USA",
      "line": ["123 Main St", "Apt 4B"],
      "city": "Boston",
      "district": "Suffolk County",
      "state": "MA",
      "postalCode": "02101",
      "country": "USA",
      "period": {
        "start": "2020-01-01"
      }
    },
    {
      "use": "work",
      "line": ["456 Corporate Blvd"],
      "city": "Cambridge",
      "state": "MA",
      "postalCode": "02139",
      "country": "USA"
    }
  ],
  
  // Marital Status
  "maritalStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
      "code": "M",
      "display": "Married"
    }],
    "text": "Married"
  },
  
  // Multiple Birth
  "multipleBirthBoolean": false,
  // OR
  "multipleBirthInteger": 2,  // Birth order for twins, triplets, etc.
  
  // Photo
  "photo": [{
    "contentType": "image/jpeg",
    "url": "http://example.org/patient-photos/123456.jpg",
    "title": "Patient photo"
  }],
  
  // Contact (Emergency contacts, next of kin)
  "contact": [
    {
      "relationship": [{
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
          "code": "N",
          "display": "Next-of-Kin"
        }]
      }],
      "name": {
        "family": "Smith",
        "given": ["Jane"]
      },
      "telecom": [{
        "system": "phone",
        "value": "555-777-8888"
      }],
      "address": {
        "use": "home",
        "line": ["123 Main St"],
        "city": "Boston",
        "state": "MA",
        "postalCode": "02101"
      },
      "gender": "female",
      "period": {
        "start": "2020-01-01"
      }
    }
  ],
  
  // Communication preferences
  "communication": [
    {
      "language": {
        "coding": [{
          "system": "urn:ietf:bcp:47",
          "code": "en-US",
          "display": "English (United States)"
        }],
        "text": "English"
      },
      "preferred": true
    },
    {
      "language": {
        "coding": [{
          "system": "urn:ietf:bcp:47",
          "code": "es",
          "display": "Spanish"
        }]
      },
      "preferred": false
    }
  ],
  
  // General Practitioner
  "generalPractitioner": [
    {
      "reference": "Practitioner/example-gp",
      "display": "Dr. Sarah Johnson"
    },
    {
      "reference": "Organization/example-clinic",
      "display": "Example Family Practice"
    }
  ],
  
  // Managing Organization
  "managingOrganization": {
    "reference": "Organization/example-hospital",
    "display": "Example Hospital System"
  },
  
  // Links to other patient records
  "link": [
    {
      "other": {
        "reference": "Patient/old-mrn-98765",
        "display": "Previous MRN"
      },
      "type": "replaces"
    }
  ]
}
```

## US Core Profile Extensions

The US Core Profile adds additional extensions for US-specific requirements:

```json
{
  "extension": [
    {
      "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
      "extension": [
        {
          "url": "ombCategory",
          "valueCoding": {
            "system": "urn:oid:2.16.840.1.113883.6.238",
            "code": "2106-3",
            "display": "White"
          }
        },
        {
          "url": "detailed",
          "valueCoding": {
            "system": "urn:oid:2.16.840.1.113883.6.238",
            "code": "2108-9",
            "display": "European"
          }
        },
        {
          "url": "text",
          "valueString": "White/European"
        }
      ]
    },
    {
      "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
      "extension": [
        {
          "url": "ombCategory",
          "valueCoding": {
            "system": "urn:oid:2.16.840.1.113883.6.238",
            "code": "2186-5",
            "display": "Not Hispanic or Latino"
          }
        },
        {
          "url": "text",
          "valueString": "Not Hispanic or Latino"
        }
      ]
    },
    {
      "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
      "valueCode": "M"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/patient-genderIdentity",
      "valueCodeableConcept": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
          "code": "ASKU",
          "display": "asked but unknown"
        }]
      }
    }
  ]
}
```

## FHIR Search Parameters

### Basic Search
```
GET [base]/Patient?name=smith
GET [base]/Patient?family=smith&given=john
GET [base]/Patient?birthdate=1970-05-15
GET [base]/Patient?gender=male
GET [base]/Patient?identifier=123456
```

### Advanced Search
```
# Date ranges
GET [base]/Patient?birthdate=ge1970-01-01&birthdate=le1980-12-31

# Multiple parameters (AND)
GET [base]/Patient?family=smith&gender=male&birthdate=1970-05-15

# OR conditions using comma
GET [base]/Patient?given=john,jane

# Fuzzy/approximate matching
GET [base]/Patient?name:contains=smi
GET [base]/Patient?name:exact=Smith

# Including related resources
GET [base]/Patient?_include=Patient:general-practitioner
GET [base]/Patient?_revinclude=Encounter:patient

# Sorting
GET [base]/Patient?_sort=family,given,-birthdate

# Pagination
GET [base]/Patient?_count=10&_offset=20
```

## FHIR Bundle Structure

When returning multiple resources:

```json
{
  "resourceType": "Bundle",
  "id": "bundle-example",
  "type": "searchset",
  "total": 100,
  "link": [
    {
      "relation": "self",
      "url": "http://example.org/fhir/Patient?name=smith"
    },
    {
      "relation": "next",
      "url": "http://example.org/fhir/Patient?name=smith&_offset=10"
    }
  ],
  "entry": [
    {
      "fullUrl": "http://example.org/fhir/Patient/123",
      "resource": {
        "resourceType": "Patient",
        "id": "123",
        // ... patient data
      },
      "search": {
        "mode": "match",
        "score": 1.0
      }
    }
  ]
}
```

## FHIR Operations

### Standard Operations
```
# Read
GET [base]/Patient/123

# Version read
GET [base]/Patient/123/_history/2

# Update
PUT [base]/Patient/123

# Patch
PATCH [base]/Patient/123

# Delete
DELETE [base]/Patient/123

# Create
POST [base]/Patient

# Search
GET [base]/Patient?name=smith

# History
GET [base]/Patient/123/_history
GET [base]/Patient/_history
```

### Custom Operations
```
# Validate
POST [base]/Patient/$validate

# Everything (all related resources)
GET [base]/Patient/123/$everything

# Match (find matching patients)
POST [base]/Patient/$match
```

## FHIR Conformance

### CapabilityStatement
Describes what a FHIR server can do:

```json
{
  "resourceType": "CapabilityStatement",
  "status": "active",
  "date": "2025-01-07",
  "kind": "instance",
  "fhirVersion": "4.0.1",
  "format": ["json", "xml"],
  "rest": [{
    "mode": "server",
    "resource": [{
      "type": "Patient",
      "interaction": [
        {"code": "read"},
        {"code": "vread"},
        {"code": "update"},
        {"code": "delete"},
        {"code": "history-instance"},
        {"code": "history-type"},
        {"code": "create"},
        {"code": "search-type"}
      ],
      "searchParam": [
        {
          "name": "identifier",
          "type": "token",
          "documentation": "A patient identifier"
        },
        {
          "name": "name",
          "type": "string",
          "documentation": "A portion of either family or given name"
        }
      ]
    }]
  }]
}
```

## FHIR Security

### OAuth 2.0 / SMART on FHIR
```json
{
  "authorization_endpoint": "https://auth.example.org/authorize",
  "token_endpoint": "https://auth.example.org/token",
  "scopes_supported": [
    "patient/Patient.read",
    "patient/Patient.write",
    "user/Patient.read",
    "user/Patient.write",
    "system/Patient.read"
  ]
}
```

### Audit Logging (AuditEvent)
```json
{
  "resourceType": "AuditEvent",
  "type": {
    "system": "http://terminology.hl7.org/CodeSystem/audit-event-type",
    "code": "rest",
    "display": "RESTful Operation"
  },
  "action": "R",  // Read
  "recorded": "2025-01-07T10:00:00Z",
  "outcome": "0",  // Success
  "agent": [{
    "who": {
      "reference": "Practitioner/123"
    }
  }],
  "entity": [{
    "what": {
      "reference": "Patient/456"
    }
  }]
}
```

## Implementation in Our Application

### 1. Server Configuration (`server.js`)
```javascript
// FHIR Server endpoints
const HAPI_BASE_URL = 'https://launch.smarthealthit.org/v/r4/fhir';

// Create FHIR Patient
app.post('/api/patient', async (req, res) => {
  const patient = {
    resourceType: 'Patient',
    identifier: [{
      system: 'http://example.org/patients',
      value: `patient-${Date.now()}`
    }],
    active: true,
    name: [{
      use: 'official',
      family: req.body.lastName,
      given: [req.body.firstName]
    }],
    gender: req.body.gender,
    birthDate: req.body.birthDate,
    telecom: [
      {
        system: 'phone',
        value: req.body.phone,
        use: 'mobile'
      },
      {
        system: 'email',
        value: req.body.email,
        use: 'home'
      }
    ]
  };
  
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
});
```

### 2. Client-Side (`modern-app.js`)
```javascript
// Create patient with FHIR structure
const patientData = {
  firstName: form.firstName.value,
  lastName: form.lastName.value,
  birthDate: form.birthDate.value,
  gender: form.gender.value,
  phone: utils.formatPhone(form.phone.value),
  email: form.email.value
};

// Send to server which converts to FHIR
const response = await fetch('/api/patient', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(patientData)
});
```

## Testing FHIR Endpoints

### Using cURL
```bash
# Get CapabilityStatement
curl https://launch.smarthealthit.org/v/r4/fhir/metadata

# Search for patients
curl "https://launch.smarthealthit.org/v/r4/fhir/Patient?name=Smith"

# Get specific patient
curl https://launch.smarthealthit.org/v/r4/fhir/Patient/123

# Create patient
curl -X POST https://launch.smarthealthit.org/v/r4/fhir/Patient \
  -H "Content-Type: application/fhir+json" \
  -d @patient.json
```

### Using Postman
1. Set request type (GET, POST, etc.)
2. Set URL: `https://launch.smarthealthit.org/v/r4/fhir/Patient`
3. Headers:
   - `Content-Type: application/fhir+json`
   - `Accept: application/fhir+json`
4. Body (for POST): FHIR Patient JSON

## FHIR Validation Rules

### Required Elements
- `resourceType` must be "Patient"
- At minimum, should have identifier OR name

### Cardinality Rules
- `0..1` = Zero or one (optional, single)
- `1..1` = Exactly one (required, single)
- `0..*` = Zero to many (optional, multiple)
- `1..*` = One to many (required, multiple)

### Data Type Rules
- Dates: `YYYY-MM-DD` format
- DateTime: `YYYY-MM-DDThh:mm:ss+zz:zz`
- Boolean: `true` or `false`
- Code: Must be from specified value set
- Reference: `ResourceType/id` format

## Common FHIR Value Sets

### Administrative Gender
- `male`
- `female`
- `other`
- `unknown`

### Marital Status
- `A` - Annulled
- `D` - Divorced
- `I` - Interlocutory
- `L` - Legally Separated
- `M` - Married
- `P` - Polygamous
- `S` - Never Married
- `T` - Domestic partner
- `U` - Unmarried
- `W` - Widowed

### Contact Point System
- `phone`
- `fax`
- `email`
- `pager`
- `url`
- `sms`
- `other`

### Contact Point Use
- `home`
- `work`
- `temp`
- `old`
- `mobile`

## Resources for Learning FHIR

### Official Resources
- [FHIR Official Documentation](https://www.hl7.org/fhir/)
- [FHIR R4 Specification](https://www.hl7.org/fhir/R4/)
- [US Core Implementation Guide](https://www.hl7.org/fhir/us/core/)

### Testing Servers
- [HAPI FHIR Test Server](https://hapi.fhir.org/)
- [SMART Health IT](https://launch.smarthealthit.org/)
- [Synthea Patient Generator](https://synthea.mitre.org/)

### Tools
- [FHIR Validator](https://validator.fhir.org/)
- [Clinician on FHIR](https://www.clinicianonfire.com/)
- [SMART App Launcher](https://launch.smarthealthit.org/)

---

*This comprehensive guide covers FHIR fundamentals, the Patient resource in detail, and practical implementation patterns used in healthcare interoperability.*