# 🎮 UPlay Backend API Documentation

This documentation is for the frontend team to integrate with the UPlay Tournament System. The backend is built on **Django 6.0.2**, utilizing **PBKDF2/Argon2** for security and **WebSockets** for real-time updates.

---

## 🛠 1. Tech Stack & Dependencies

The following libraries must be present in the backend environment for the system to function:

| Library | Purpose |
| :--- | :--- |
| `django` | Core Web Framework |
| `python-dotenv` | Environment Variable Management (Security) |
| `django-cors-headers` | Allowing Frontend access (Cross-Origin) |
| `djangorestframework` | API Serialization, Pagination, and Validation |
| `channels` | WebSocket support for Real-Time Notifications |
| `daphne` | ASGI Server to run WebSockets |

---

## 🔐 2. Authentication & Verification Flow

We use **Session Authentication** with a mandatory **Email Verification** step.

1. **Signup**: User registers via `POST /api/signup/`. Account is created as `is_active = False`.
2. **Activation**: An email is sent with a unique `uidb64` and `token`. The user must hit `GET /api/activate/<uidb64>/<token>/` to enable their account.
3. **Login**: Frontend sends `POST` to `/api/login/`. 
   - If the email isn't verified, the backend returns **403 Forbidden** with the message: `"Verify email before logging in."`.
   - If credentials match and the account is active, a `sessionid` cookie is issued.
4. **Session**: Browsers store the cookie automatically. Set `withCredentials: true` in your Axios/Fetch config for all subsequent requests.

---

## 📡 3. API Endpoints

### User & Profile
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/signup/` | `POST` | Register a new player. Triggers verification email. |
| `/api/activate/<uid>/<token>/` | `GET` | Activates account. Returns 200 on success. |
| `/api/login/` | `POST` | Authenticates user. Returns 403 if unverified. |
| `/api/profile/` | `GET` | Returns details, joined tournaments, and transaction history. |

### Tournaments & Search
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/tournaments/active/` | `GET` | Returns active tournaments. Supports complex filtering. |
| `/api/tournaments/join/<id>/` | `POST` | Request to join. If paid, requires a `receipt` file upload. |

---

## ⚡ 4. Advanced Search & Filtering

The `/api/tournaments/active/` endpoint supports three simultaneous search methods using query parameters:

* **Search Bar**: `?search=Pro-League` (Partial match on Tournament Title).
* **Game Dropdown**: `?game=FIFA` (Filters by Game Name).
* **Category Dropdown**: `?category=Esports` (Filters by Category Name).

**Example Request**: `GET /api/tournaments/active/?game=FIFA&category=Sports`

---

## 📑 5. Pagination & Response Structure

The tournament list returns **8 items per page** to optimize performance.

**Response Structure**:
```json
{
    "count": 50,
    "total_pages": 7,
    "current_page": 1,
    "has_next": true,
    "results": [
        {
            "id": 1,
            "title": "Summer Slam",
            "game": "Call of Duty",
            "category": "Esports",
            "participant_count": 12,
            "max_participants": 16,
            "status": "open",
            "entry_fee": "50.00",
            "start_date": "2026-03-01 14:00"
        }
    ]
}
```

---

## 🏗 6. Database Logic & Constraints

### 💸 Paid Tournaments & Transactions
When a user joins a **Paid Tournament**, the system initiates an auditing workflow to ensure payment validity:
* **Pending Registration**: A `PendingRegistration` record is created to hold the user's uploaded receipt.
* **Admin Verification**: Administrators review the receipt via the Django Admin dashboard.
* **Transaction Finalization**: Upon approval, the record is migrated to the `Transaction` table, and the user is officially added to the participants list.
* **Secure Auditing**: Every transaction is assigned a unique **UUID** (e.g., `550e8400-e29b-41d4-a716-446655440000`) to prevent ID harvesting and ensure data integrity.

### 📊 Tournament Statuses
The `status` field in the `Tournament` model strictly controls frontend UI states and registration logic:
* **`open`**: The "Join Now" button is active.
* **`full`**: Triggered when `participant_count` equals `max_participants`. Registration is blocked, and the backend returns a **400 Bad Request** for join attempts.
* **`ongoing`**: Indicates the tournament has started; no further registrations are permitted.
* **`completed`**: Displays final results and rankings.

---

## 🛡 7. Security & Environment

### 🔑 Credentials & Tokens
* **Environment Variables**: Sensitive data, including the `SECRET_KEY` and database credentials, are stored in a `.env` file and never hardcoded.
* **Activation Timeouts**: Email verification links are time-sensitive and expire after **24 hours** (`PASSWORD_RESET_TIMEOUT`).
* **Token Integrity**: Verification tokens are cryptographically tied to the user's state; any password or login change before activation invalidates the link.

### 🔐 Authentication Logic
* **Access Control**: The backend uses a custom `AllowAllUsersModelBackend` to identify unverified users during login.
* **Error Handling**: To prevent security ambiguity, unverified users receive a **403 Forbidden** status with a specific prompt to check their email.
* **Injection Prevention**: All search queries for Tournament Titles, Game Names, and Categories are executed via Django’s ORM using parameterized queries to neutralize SQL injection risks.

**Contact the Backend Lead for the `.env` template and API Secret Keys.**