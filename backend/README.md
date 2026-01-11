# Healthcare API Backend

Spring Boot REST API for Healthcare Patient Management System.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Setup Instructions

1. **Navigate to the backend directory:**
   ```bash
   cd "c:\Users\Netra Rupera\Desktop\App layout\backend"
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new doctor
- `POST /api/auth/login` - Login doctor
- `GET /api/auth/me` - Get current doctor info

### Patients
- `POST /api/patients` - Create a new patient
- `GET /api/patients` - Get all patients for logged-in doctor
- `GET /api/patients/{id}` - Get specific patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics

## Database

Using H2 in-memory database for development.

- Console URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:healthcare_db`
- Username: `sa`
- Password: (empty)

## Testing

You can test the API using:
- Postman
- cURL
- Browser (for GET requests)

### Example Login Request:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"doctor@example.com","password":"password123"}'
```
