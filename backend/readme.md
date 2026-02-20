# 🎮 UPlay Backend API Documentation

This documentation is for the frontend team to integrate with the UPlay Tournament System. The backend is built on **Django 5.x** and **PostgreSQL**, utilizing **Bcrypt** for security and **WebSockets** for real-time updates.

---

## 🛠 1. Tech Stack & Dependencies

The following libraries must be present in the backend environment for the system to function:

| Library | Purpose |
| :--- | :--- |
| `django` | Core Web Framework |
| `psycopg2-binary` | PostgreSQL Database Adapter |
| `python-dotenv` | Environment Variable Management (Security) |
| `django-cors-headers` | Allowing Frontend access (Cross-Origin) |
| `djangorestframework` | API Serialization, Pagination, and Validation |
| `django-cache-page` | Server-side API Caching |
| `channels` | WebSocket support for Real-Time Notifications |
| `daphne` | ASGI Server to run WebSockets |

---

## 🔐 2. Authentication Flow (Session-Based)

We use **Session Authentication**. Unlike JWT, the frontend does **not** need to manually store tokens.

1. **Login**: Frontend sends a `POST` to `/api/login/`.
2. **Cookie**: The backend sends a `sessionid` cookie. Browsers automatically store this and send it back with every future request.
3. **CORS**: Ensure `withCredentials: true` is set in your Axios/Fetch config.



---

## 📡 3. API Endpoints

### User & Profile
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/signup/` | `POST` | Create a new account. Prevents SQL injection. |
| `/api/login/` | `POST` | Authenticates user and starts session. |
| `/api/logout/` | `POST` | Destroys session and clears cookies. |
| `/api/profile/` | `GET` | Returns logged-in user details & their joined tournaments. |

### Tournaments
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/tournaments/` | `GET` | Returns list of tournaments. **Cached & Paginated**. |
| `/api/tournaments/<id>/join/` | `POST` | Registers the logged-in user for a tournament. |

---

## ⚡ 4. Advanced Features Integration

### 📑 Pagination
The tournament list returns **8 items per page** to optimize mobile performance.
- **Request**: `GET /api/tournaments/?page=1`
- **Response Structure**:
```json
{
    "count": 50,
    "next": "http://.../?page=2",
    "previous": null,
    "results": [...] 
}

### Caching
The /api/tournaments/ endpoint is cached for 15 minutes.

- **Impact**: Very fast load times.
- **Note**: If a user joins a tournament, the "Participant Count" on the main list might not update instantly due to the cache.

### 🔔 Real-Time Notifications
Connect to the WebSocket to receive instant updates when tournaments become full or status changes.

- **URL**: ws://127.0.0.1:8000/ws/notifications/
- **Frontend Snippet**:
```javascript
const socket = new WebSocket('ws://localhost:8000/ws/notifications/');
socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log("New Update:", data.message);
};

### 🏗 5. Database Logic & Constraints

#### Tournament Statuses
The `status` field in the Tournament model determines the frontend UI states:

* **open**: Show "Join Now" button.
* **full**: Show "Registration Closed" (Max capacity reached).
* **ongoing**: Show "Live" or "In Progress".
* **completed**: Show "Results".

#### Capacity Limits
The backend enforces `max_participants`. If a `POST` is sent to the join endpoint and the count equals `max_participants`, the backend will return a **400 Bad Request** and update the status to **full**.

---

### 🛡 6. Security & Environment

* **Environment Variables**: All database and secret keys are stored in a `.env` file (not in the code).
* **SQL Injection**: All inputs are handled via Django’s ORM (parameterized queries).
* **Password Safety**: Passwords are never stored in plain text; they are hashed using **Bcrypt**.

**Contact Backend Lead for API Secret Keys.*