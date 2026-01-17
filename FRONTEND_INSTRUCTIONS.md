# Frontend Implementation Instructions - Mon Profil & Horaires

These instructions detail how to implement the "Mon Profil" and "Horaires de travail" sections.

## 1. API Endpoints

| Action | HTTP Method | Endpoint | Payload / Params |
| :--- | :--- | :--- | :--- |
| **Get Profile** | `GET` | `/api/userREST/dentist/{id}` | - |
| **Update Profile** | `PUT` | `/api/userREST/dentist/{id}` | JSON (See below) |
| **Get Horaires** | `GET` | `/api/userREST/dentist/{id}/horaires` | - |
| **Update Horaires** | `PUT` | `/api/userREST/dentist/{id}/horaires` | JSON Array (See below) |

---

## 2. Component Structure

We recommend creating two main components:
1.  `DentistProfileCard`: Left card in your screenshot.
2.  `DentistScheduleCard`: Right card in your screenshot.

---

## 3. Implementation Details

### A. DentistProfileCard

1.  **Fetch Data:** On component mount, call `GET /api/userREST/dentist/{id}`.
2.  **Display:**
    *   **Avatar:** Use `response.photo`. If null, show initials (e.g., "DD").
    *   **Name:** `response.prenom` + ` ` + `response.nom`.
    *   **Title:** Display "Chirurgien Dentiste" (Static or mapped from `diplome` if preferred).
    *   **Address:** Combine fields: `response.adresse + ", " + response.delegation + ", " + response.gouvernorat`.
3.  **Edit Mode:**
    *   Clicking the pencil icon opens a Modal/Dialog.
    *   **Form Fields:** Address, Delegation, Gouvernorat, Specialite, Diplome.
    *   **Saving:** Send a `PUT` request with the updated fields.

**Payload Example for Update:**
```json
{
  "nom": "Ben Ali",
  "prenom": "Ahmed",
  "adresse": "16 Rue Etienne Jules Marey",
  "delegation": "La Marsa",
  "gouvernorat": "Tunis",
  "specialite": "Orthodontie",
  "diplome": "Chirurgien Dentiste"
}
```

### B. DentistScheduleCard

1.  **Fetch Data:** Call `GET /api/userREST/dentist/{id}/horaires`.
2.  **Display:**
    *   Iterate through the list.
    *   Sort visually from Monday (Lundi) to Sunday (Dimanche).
    *   **Format:**
        *   If `estFerme == true` -> Show "Fermé" (Red color).
        *   Else -> Show `matinDebut - matinFin / apresMidiDebut - apresMidiFin`.
        *   *Tip:* LocalTime comes as "09:00:00". Slice it to "09:00".
3.  **Edit Mode:**
    *   Modal with rows for each day.
    *   Each row has: Day Name (Label), AM Start/End inputs, PM Start/End inputs, "Closed" Checkbox.
    *   **Validation:** Ensure End Time > Start Time.
    *   **Saving:** Send `PUT` with the full array of daily schedules.

**Payload Example for Update Schedules:**
```json
[
  {
    "jourSemaine": "LUNDI",
    "matinDebut": "09:00",
    "matinFin": "13:00",
    "apresMidiDebut": "14:00",
    "apresMidiFin": "18:00",
    "estFerme": false
  },
  {
    "jourSemaine": "DIMANCHE",
    "estFerme": true
  }
]
```

## 4. Integration Tips

*   **Auth:** Ensure your HTTP client (Axios/Fetch) attaches the JWT token in the `Authorization` header (`Bearer <token>`).
*   **ID:** The `{id}` in the path is the logged-in user's ID found in `localstorage` or your auth context.
