# 📡 CampusOptiX REST API Documentation

Base URLs:
- `http://localhost:5000/api`
- `http://localhost:5000/api/v1`

Interactive Swagger UI:
- **`http://localhost:5000/api/docs`**

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT token.
- **Request Body**:
  ```json
  {
    "email": "admin@campusoptix.edu",
    "password": "Admin@123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "usr-123",
        "name": "Campus Administrator",
        "email": "admin@campusoptix.edu",
        "role": "ADMIN"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

## 2. Main Dashboard & Analytics

### `GET /api/dashboard`
Returns live KPI spatial utilization metrics.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "rooms": 24,
      "labs": 8,
      "activeConflicts": 3,
      "underutilizedResources": 3,
      "campusUtilization": 68.4,
      "resolvedConflicts": 18,
      "availableRooms": 8,
      "occupiedRooms": 9,
      "overcrowdedRooms": 2,
      "maintenanceRooms": 2,
      "recentOptimizations": [],
      "topAlerts": []
    }
  }
  ```

---

## 3. Optimizer & Recommendation Engine

### `GET /api/optimizer/conflicts/:conflictId/candidates`
Searches all campus rooms, evaluates 6 hard constraints, and ranks candidates using the 7-criteria soft score.

### `POST /api/optimizer/recommend`
Generates structured explainable recommendation data with before-and-after delta.
- **Request Body**:
  ```json
  {
    "conflictId": "conflict-primary-demo"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "recommendation": "MOVE DATABASE MANAGEMENT SYSTEMS LAB → LAB A",
      "recommendedRoom": {
        "id": "lab-a-id",
        "name": "Lab A (Advanced Computing)",
        "capacity": 80,
        "type": "COMPUTER_LAB"
      },
      "score": 94,
      "scoreBreakdown": {
        "capacity": 25,
        "equipment": 20,
        "availability": 20,
        "roomType": 15,
        "utilization": 10,
        "facultyPreference": 5,
        "studentTravel": 5
      },
      "reasons": [
        "Capacity is sufficient (80 seats for 65 students)",
        "Required equipment available",
        "Room available at selected time (14:00)",
        "No new conflict created"
      ],
      "beforeVsAfter": {
        "conflictsBefore": 3,
        "conflictsAfter": 2,
        "utilizationBefore": 162.5,
        "utilizationAfter": 81.2,
        "capacityEfficiency": 81.2,
        "studentTravelDistanceMeters": 0,
        "measurableImprovement": "Space utilization optimized from 163% to 81% with 0 scheduling collisions."
      }
    }
  }
  ```

### `POST /api/recommendations/:id/approve`
Commits recommendation atomically using an ACID database transaction.

---

## 4. Emergency Reallocation & Sandbox Simulation

### `POST /api/optimizer/emergency`
Impact solver for sudden venue outages.
- **Request Body**:
  ```json
  {
    "resourceId": "lab-b-id",
    "startTime": "14:00",
    "endTime": "17:00",
    "reason": "HVAC electrical inspection"
  }
  ```

### `POST /api/simulation/run`
Runs an in-memory What-If scenario model without modifying production timetable records.
- **Request Body**:
  ```json
  {
    "scenarioType": "ROOM_UNAVAILABLE",
    "scenarioData": {
      "roomId": "lab-b-id",
      "startTime": "14:00",
      "endTime": "17:00"
    }
  }
  ```

---

## 5. Attendance Demand Prediction & Natural Language AI

### `GET /api/attendance/prediction?classId=...&scheduled=80`
Returns empirical historical turnout projection:
```json
{
  "success": true,
  "data": {
    "scheduledStudents": 80,
    "historicalAveragePresent": 64,
    "historicalAttendanceRate": 80.0,
    "predictedAttendance": 64,
    "confidenceLevel": "HIGH",
    "calculationMethod": "Empirical Historical Moving Average"
  }
}
```

### `POST /api/ai/query`
Natural language query converted into structured filters with deterministic backend verification:
- **Request Body**:
  ```json
  {
    "query": "What rooms are available for 60 students tomorrow at 2 PM?"
  }
  ```
