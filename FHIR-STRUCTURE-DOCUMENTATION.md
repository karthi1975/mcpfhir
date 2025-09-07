# FHIR Patient Resource Structure Documentation

## Overview
This document describes the FHIR R4 Patient resource structure used in the HAPI FHIR Patient Manager application.

## 1. CREATE Patient Structure

### Request Endpoint
```
POST http://localhost:3000/api/patient
Content-Type: application/json
```

### Request Body (Application Format)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-01-01",
  "gender": "male",
  "phone": "555-555-5555",
  "email": "john.doe@example.com"
}
```

### FHIR Resource Created (Server-side transformation)
```json
{
  "resourceType": "Patient",
  "identifier": [{
    "system": "http://example.org/patients",
    "value": "patient-1757258233932"  // Unique timestamp-based ID
  }],
  "active": true,
  "name": [{
    "use": "official",
    "family": "Doe",
    "given": ["John"]
  }],
  "gender": "male",
  "birthDate": "1990-01-01",
  "telecom": [
    {
      "system": "phone",
      "value": "555-555-5555",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "john.doe@example.com",
      "use": "home"
    }
  ]
}
```

### Response Structure
```json
{
  "success": true,
  "id": "3048816",
  "patient": {
    "resourceType": "Patient",
    "id": "3048816",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2025-09-07T11:17:14.755-04:00"
    },
    "identifier": [{
      "system": "http://example.org/patients",
      "value": "patient-1757258233932"
    }],
    "active": true,
    "name": [{
      "use": "official",
      "family": "Doe",
      "given": ["John"]
    }],
    "telecom": [
      {
        "system": "phone",
        "value": "555-555-5555",
        "use": "mobile"
      },
      {
        "system": "email",
        "value": "john.doe@example.com"
      }
    ],
    "gender": "male",
    "birthDate": "1990-01-01"
  }
}
```

## 2. SEARCH Patients Structure

### Request Endpoint
```
GET http://localhost:3000/api/patients?name=John&gender=male&_count=10
```

### Query Parameters
- `name` (optional): Search by patient name (searches both given and family names)
- `gender` (optional): Filter by gender (male, female, other, unknown)
- `_count` (optional): Number of results to return (default: 10)

### Response Structure
```json
{
  "success": true,
  "total": 2,
  "patients": [
    {
      "resourceType": "Patient",
      "id": "3048816",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2025-09-07T11:17:14.755-04:00"
      },
      "identifier": [{
        "system": "http://example.org/patients",
        "value": "patient-1757258233932"
      }],
      "active": true,
      "name": [{
        "use": "official",
        "family": "Doe",
        "given": ["John"]
      }],
      "telecom": [
        {
          "system": "phone",
          "value": "555-555-5555",
          "use": "mobile"
        },
        {
          "system": "email",
          "value": "john.doe@example.com"
        }
      ],
      "gender": "male",
      "birthDate": "1990-01-01"
    }
  ]
}
```

## 3. GET Patient by ID Structure

### Request Endpoint
```
GET http://localhost:3000/api/patient/3048816
```

### Response Structure
```json
{
  "success": true,
  "patient": {
    "resourceType": "Patient",
    "id": "3048816",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2025-09-07T11:17:14.755-04:00"
    },
    "identifier": [{
      "system": "http://example.org/patients",
      "value": "patient-1757258233932"
    }],
    "active": true,
    "name": [{
      "use": "official",
      "family": "Doe",
      "given": ["John"]
    }],
    "telecom": [
      {
        "system": "phone",
        "value": "555-555-5555",
        "use": "mobile"
      },
      {
        "system": "email",
        "value": "john.doe@example.com"
      }
    ],
    "gender": "male",
    "birthDate": "1990-01-01"
  }
}
```

## 4. Extended FHIR Patient Structure (from SMART Health IT)

When retrieving patients from the SMART Health IT FHIR server, you may receive additional fields:

```json
{
  "resourceType": "Patient",
  "id": "2141cd24-9c05-460c-9f87-4da6e8ec7a73",
  "meta": {
    "versionId": "3",
    "lastUpdated": "2021-04-06T03:02:11.302-04:00",
    "tag": [{
      "system": "https://smarthealthit.org/tags",
      "code": "synthea-5-2019"
    }]
  },
  "text": {
    "status": "generated",
    "div": "<div>Generated HTML content</div>"
  },
  "extension": [
    {
      "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
      "extension": [{
        "url": "ombCategory",
        "valueCoding": {
          "system": "urn:oid:2.16.840.1.113883.6.238",
          "code": "2106-3",
          "display": "White"
        }
      }]
    },
    {
      "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
      "extension": [{
        "url": "ombCategory",
        "valueCoding": {
          "system": "urn:oid:2.16.840.1.113883.6.238",
          "code": "2186-5",
          "display": "Not Hispanic or Latino"
        }
      }]
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
      "valueAddress": {
        "city": "Boston",
        "state": "Massachusetts",
        "country": "US"
      }
    }
  ],
  "identifier": [
    {
      "system": "https://github.com/synthetichealth/synthea",
      "value": "8edf097f-56d9-4587-aea3-20c023d0c353"
    },
    {
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "MR",
          "display": "Medical Record Number"
        }],
        "text": "Medical Record Number"
      },
      "system": "http://hospital.smarthealthit.org",
      "value": "8edf097f-56d9-4587-aea3-20c023d0c353"
    },
    {
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "SS",
          "display": "Social Security Number"
        }],
        "text": "Social Security Number"
      },
      "system": "http://hl7.org/fhir/sid/us-ssn",
      "value": "999-16-3290"
    }
  ],
  "name": [{
    "use": "official",
    "family": "Breitenberg",
    "given": ["Bryan"],
    "prefix": ["Mr."]
  }],
  "telecom": [{
    "system": "phone",
    "value": "555-525-4423",
    "use": "home"
  }],
  "gender": "male",
  "birthDate": "1964-06-29",
  "address": [{
    "extension": [{
      "url": "http://hl7.org/fhir/StructureDefinition/geolocation",
      "extension": [
        {
          "url": "latitude",
          "valueDecimal": 41.838061
        },
        {
          "url": "longitude",
          "valueDecimal": -71.07761500000002
        }
      ]
    }],
    "line": ["1066 Hoeger Path"],
    "city": "Berkley",
    "state": "Massachusetts",
    "postalCode": "02779",
    "country": "US"
  }],
  "maritalStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
      "code": "S",
      "display": "S"
    }],
    "text": "S"
  },
  "multipleBirthBoolean": false,
  "communication": [{
    "language": {
      "coding": [{
        "system": "urn:ietf:bcp:47",
        "code": "en-US",
        "display": "English"
      }],
      "text": "English"
    }
  }]
}
```

## 5. FHIR Data Types Reference

### Name Structure
```json
{
  "use": "official | usual | temp | nickname | anonymous | old | maiden",
  "text": "Full name as text",
  "family": "Family/Last name",
  "given": ["First name", "Middle name"],
  "prefix": ["Mr.", "Dr."],
  "suffix": ["Jr.", "III"]
}
```

### Telecom Structure
```json
{
  "system": "phone | fax | email | pager | url | sms | other",
  "value": "The actual contact point details",
  "use": "home | work | temp | old | mobile",
  "rank": 1,  // Preferred order of use
  "period": {
    "start": "2020-01-01",
    "end": "2025-12-31"
  }
}
```

### Address Structure
```json
{
  "use": "home | work | temp | old | billing",
  "type": "postal | physical | both",
  "text": "Full address as text",
  "line": ["Street address line 1", "Apartment/Suite"],
  "city": "City name",
  "district": "District/County",
  "state": "State/Province",
  "postalCode": "Postal/ZIP code",
  "country": "Country (ISO 3166)",
  "period": {
    "start": "2020-01-01",
    "end": "2025-12-31"
  }
}
```

### Identifier Structure
```json
{
  "use": "usual | official | temp | secondary | old",
  "type": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
      "code": "MR",
      "display": "Medical Record Number"
    }],
    "text": "Medical Record Number"
  },
  "system": "http://hospital.example.org/patients",
  "value": "12345",
  "period": {
    "start": "2020-01-01"
  },
  "assigner": {
    "display": "Example Hospital"
  }
}
```

## 6. Gender Values
- `male`
- `female`
- `other`
- `unknown`

## 7. Common FHIR Systems

### Identifier Systems
- `http://hl7.org/fhir/sid/us-ssn` - US Social Security Number
- `http://hl7.org/fhir/sid/us-npi` - US National Provider Identifier
- `http://hl7.org/fhir/sid/us-medicare` - US Medicare Number

### Code Systems
- `http://terminology.hl7.org/CodeSystem/v2-0203` - Identifier Type
- `http://terminology.hl7.org/CodeSystem/v3-MaritalStatus` - Marital Status
- `http://hl7.org/fhir/administrative-gender` - Administrative Gender
- `urn:ietf:bcp:47` - Language codes

## 8. Example cURL Commands

### Create Patient
```bash
curl -X POST http://localhost:3000/api/patient \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "birthDate": "1985-05-15",
    "gender": "female",
    "phone": "555-123-4567",
    "email": "jane.smith@example.com"
  }'
```

### Search Patients
```bash
# Search all patients
curl http://localhost:3000/api/patients

# Search by name
curl "http://localhost:3000/api/patients?name=Smith"

# Search by gender
curl "http://localhost:3000/api/patients?gender=female"

# Combined search
curl "http://localhost:3000/api/patients?name=Jane&gender=female&_count=5"
```

### Get Patient by ID
```bash
curl http://localhost:3000/api/patient/3048816
```

## 9. FHIR Server Endpoints

### Development Server (Used in this app)
- Base URL: `https://launch.smarthealthit.org/v/r4/fhir`
- Public test server with sample data
- No authentication required

### Alternative HAPI FHIR Server
- Base URL: `https://hapi.fhir.org/baseR4`
- Public HAPI FHIR test server
- May have availability issues

## 10. Response Metadata

### Meta Object
```json
{
  "meta": {
    "versionId": "1",
    "lastUpdated": "2025-09-07T11:17:14.755-04:00",
    "source": "#sourceID",
    "profile": ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"],
    "security": [{
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActReason",
      "code": "HTEST",
      "display": "test health data"
    }],
    "tag": [{
      "system": "https://smarthealthit.org/tags",
      "code": "synthea-5-2019"
    }]
  }
}
```

## 11. Error Response Structure

### Error Format
```json
{
  "success": false,
  "error": "Error message description",
  "details": {
    // Additional error details from FHIR server
  }
}
```

### Common HTTP Status Codes
- `200 OK` - Successful GET request
- `201 Created` - Successful POST (create) request
- `400 Bad Request` - Invalid request format
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - FHIR validation error
- `500 Internal Server Error` - Server error

## 12. FHIR Compliance Notes

### Mandatory Fields (R4)
For a valid Patient resource, no fields are technically mandatory, but recommended minimum:
- `resourceType`: Must be "Patient"
- At least one identifier OR name

### Cardinality
- `identifier`: 0..* (zero to many)
- `name`: 0..* (zero to many)
- `telecom`: 0..* (zero to many)
- `gender`: 0..1 (zero or one)
- `birthDate`: 0..1 (zero or one)
- `address`: 0..* (zero to many)
- `active`: 0..1 (zero or one)

### Date Formats
- Full date: `YYYY-MM-DD` (e.g., "1990-01-01")
- Year and month: `YYYY-MM` (e.g., "1990-01")
- Year only: `YYYY` (e.g., "1990")

---

*This document describes the FHIR R4 Patient resource structure as implemented in the HAPI FHIR Patient Manager application.*