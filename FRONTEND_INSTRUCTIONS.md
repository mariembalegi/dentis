# Frontend Instructions for Angular App

This document outlines the API endpoints, data structures, and logic required to integrate the Angular frontend with the Dentis Java Backend.

## Global Configuration

*   **Base URL**: `http://localhost:8080/DentisBackend/api` (Adjust port/context root if necessary. The JAX-RS app path `DentisRestApp` is `@ApplicationPath("/")`, but usually deployed under a war name context).
*   **Session Handling**: 
    *   The backend uses Jakarta EE `HttpSession`. 
    *   **Crucial**: In Angular `HttpClient`, you must set `withCredentials: true` for all requests to ensure the `JSESSIONID` cookie is sent back and forth.
    *   The `/login` endpoint also returns a `sessionId` in the body for reference if needed, but cookie-based session is the primary mechanism.
*   **Images/Files**: All images (profile photos, diplomas, service images) are expected to be sent as **Base64 Encoded Strings**.

---

## 1. Authentication & User Management

### Controller: `UserRestServices`
**Base Path**: `/userREST`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/check-email/{email}` | Check if email is already taken. Returns 200 (Found) or 404 (Not Found). | Public |
| `POST` | `/login` | Log in a user. | Public |
| `GET` | `/logout` | Invalidates session. | Logged In |
| `POST` | `/signup/patient` | Register a new Patient. | Public |
| `POST` | `/signup/dentist` | Register a new Dentist. | Public |

### Data Models

**Login Request:**
```json
{
  "email": "user@example.com",
  "motDePasse": "password123"
}
```

**Login Response (Success - 200 OK):**
```json
{
  "message": "Login successful",
  "sessionId": "A1B2C3...",
  "user": {
    "id": 1,
    "nom": "Doe",
    "prenom": "John",
    "email": "john@email.com",
    "role": "PATIENT" | "DENTISTE" | "ADMIN",
    "token": "JWT_TOKEN...", // Valid for stateless calls if implemented, but prefer Session
    // Specific fields based on role:
    "dateNaissanceP": "...", // If Patient
    "specialiteD": "..."     // If Dentist
  }
}
```

**Signup Patient DTO:**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "email": "john@email.com",
  "motDePasse": "secret",
  "tel": 12345678,
  "sexe": "M",
  "photo": "base64_string...",
  "dateNaissanceP": "1990-01-01",
  "groupeSanguinP": "O+",
  "recouvrementP": "CNSS"
}
```

**Signup Dentist DTO:**
```json
{
  "nom": "Smith",
  "prenom": "Alice",
  "email": "alice@dentist.com",
  "motDePasse": "secret",
  "tel": 98765432,
  "sexe": "F",
  "photo": "base64_string...",
  "specialiteD": "Orthodontiste",
  "diplome": "base64_string_of_pdf_or_image..."
}
```

---

## 2. Medical Services (Publications)

### Controller: `ServiceMedicalRest`
**Base Path**: `/services`

| Method | Endpoint | Description | Access | 
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List all services (Use this for Patient Dashboard). | Public/Logon |
| `POST` | `/` | Create a new service. | Dentist Only |
| `PUT` | `/{id}` | Update a service. | Dentist Owner Only |
| `DELETE` | `/{id}` | Delete a service. | Dentist Owner Only |
| `GET` | `/dentist/me` | List services belonging to the logged-in Dentist. | Dentist Only |

### Data Models

**Service Medical DTO:**
```json
{
  "numSM": 10, // Null when creating
  "nomSM": "Teeth Whitening",
  "typeSM": "Esthetique",
  "descriptionSM": "Full cleaning...",
  "tarifSM": 150.50,
  "image": "base64_string...",
  "dentistId": 5
}
```

---

## 3. Rendez-Vous (Appointments)

### Controller: `RendezvousRest`
**Base Path**: `/rendezvous`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Book a new appointment. | Patient Only |
| `GET` | `/my` | List appointments involved in (as Patient or Dentist). | Logged In |
| `PUT` | `/{id}/validate?status=VALIDATED` | Accept an appointment. | Dentist Only |
| `PUT` | `/{id}/validate?status=REFUSED` | Refuse an appointment. | Dentist Only |
| `PUT` | `/{id}/cancel` | Modify (body) or Cancel (status=CANCELLED) if PENDING. | Patient Only |

### Data Models

**Rendezvous DTO (Booking & Viewing):**
```json
{
  "idRv": 55, // Null when booking
  "patientId": 1,
  "dentistId": 10, // Required when booking
  "serviceId": 5,  // Optional: The Service that triggered the booking. Will be saved as an ActeMedical.
  "dateRv": "2024-12-25",
  "heureRv": "14:30",
  "statutRv": "PENDING", // PENDING, VALIDATED, REFUSED, CANCELLED
  "descriptionRv": "Reason for visit...",
  "patientName": "John Doe",   // Read-only (display)
  "dentistName": "Dr. Smith",  // Read-only (display)
  "serviceName": "Whitening"   // Read-only (display of the primary act's service)
}
```

*Note: The backend now uses `ActeMedical` as an association entity. When a user books with a `serviceId`, an `ActeMedical` is automatically created linking the new Rendezvous to that Service.*

## Frontend Helper Logic

1.  **Guards**: Implement Angular Guards (`CanActivate`) based on `sessionStorage` user role found in `user.role` from the Login Response.
    *   `AuthGuard`: Checks if user is logged in.
    *   `DentistGuard`: Checks if `role === 'DENTISTE'`.
    *   `PatientGuard`: Checks if `role === 'PATIENT'`.
2.  **Date/Time Handling**: Ensure Dates are sent as `YYYY-MM-DD` strings (Java `LocalDate`) and Times as `HH:mm` or `HH:mm:ss` (Java `LocalTime`).
3.  **File Inputs**: Create a helper directive or service to convert `<input type="file">` change events into **Base64 strings** to populate `photo`, `diplome`, or `image` fields before sending JSON.
