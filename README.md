# Healthcare Patient Management System

A full-stack application for healthcare patient management with AI-powered disease prediction.

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Spring Boot (Java 17) + REST API
- **Database**: H2 (in-memory for development)
- **Authentication**: JWT-based

## Project Structure

```
App layout/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/healthcare/api/
│   │   ├── controller/              # REST Controllers
│   │   ├── model/                   # JPA Entities
│   │   ├── repository/              # Data Repositories
│   │   ├── service/                 # Business Logic
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── security/                # JWT Security
│   │   └── HealthcareApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── README.md
│
└── Update Login Screen Text (2)/    # React Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/          # React Components
    │   │   └── App.tsx              # Main App Component
    │   ├── services/
    │   │   └── api.ts               # API Service Layer
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## Setup Instructions

### Prerequisites

- **Java**: Version 17 or higher
- **Maven**: Version 3.6 or higher
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd "c:\Users\Netra Rupera\Desktop\App layout\backend"
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on **http://localhost:8080**

4. **Verify the backend is running:**
   - Open http://localhost:8080/h2-console in your browser
   - Use these credentials:
     - JDBC URL: `jdbc:h2:mem:healthcare_db`
     - Username: `sa`
     - Password: (leave empty)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd "c:\Users\Netra Rupera\Desktop\App layout\Update Login Screen Text (2)"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on **http://localhost:5173**

## Running Both Together

**Option 1: Use two terminals**

Terminal 1 (Backend):
```bash
cd "c:\Users\Netra Rupera\Desktop\App layout\backend"
mvn spring-boot:run
```

Terminal 2 (Frontend):
```bash
cd "c:\Users\Netra Rupera\Desktop\App layout\Update Login Screen Text (2)"
npm run dev
```

**Option 2: Use PowerShell with background jobs**

```powershell
# Start backend in background
Start-Job -ScriptBlock {
    Set-Location "c:\Users\Netra Rupera\Desktop\App layout\backend"
    mvn spring-boot:run
}

# Wait for backend to start
Start-Sleep -Seconds 30

# Start frontend
Set-Location "c:\Users\Netra Rupera\Desktop\App layout\Update Login Screen Text (2)"
npm run dev
```

## Access the Application

Once both servers are running:

1. **Open your browser** and navigate to: **http://localhost:5173**

2. **Register a new doctor account:**
   - Click on the login screen
   - For first-time use, you'll need to register via API:
   
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Dr. John Smith",
       "email": "doctor@example.com",
       "password": "password123",
       "medicalId": "MED12345",
       "hospital": "City Hospital",
       "hospitalPhone": "1234567890",
       "specialization": "General Medicine"
     }'
   ```

3. **Login with your credentials:**
   - Medical ID / Email: `doctor@example.com` or `MED12345`
   - Password: `password123`

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

## Features

### Frontend Features
- ✅ Doctor authentication (login/logout)
- ✅ Patient registration form
- ✅ Disease prediction based on symptoms
- ✅ Patient dashboard with analytics
- ✅ Risk level classification (Low/Medium/High)
- ✅ Responsive mobile-first design

### Backend Features
- ✅ RESTful API architecture
- ✅ JWT-based authentication
- ✅ Patient data persistence
- ✅ Doctor-patient relationship management
- ✅ Analytics and dashboard data
- ✅ CORS enabled for frontend integration

## Testing the Integration

1. **Test Login:**
   - Start both servers
   - Open http://localhost:5173
   - Enter credentials and click "Log In"
   - Should see "System Ready: Online Mode" status

2. **Test Patient Creation:**
   - Navigate to "Forms" section
   - Fill in patient details
   - Add symptoms
   - Click "Submit and Predict"
   - Patient should be saved to backend database

3. **Test Dashboard:**
   - Navigate to "Dashboards"
   - Should see analytics from all saved patients
   - Charts should display patient distribution

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find and kill the process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Maven build fails:**
```bash
# Clear Maven cache and rebuild
mvn clean
mvn install -U
```

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically use the next available port
- Or change in vite.config.ts:
```typescript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

**API connection fails:**
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify API_BASE_URL in `src/services/api.ts`

### Database Issues

**View database contents:**
- Navigate to http://localhost:8080/h2-console
- Run SQL: `SELECT * FROM DOCTORS;`
- Run SQL: `SELECT * FROM PATIENTS;`

## Localhost URLs

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **H2 Database Console**: http://localhost:8080/h2-console
- **API Documentation**: http://localhost:8080/api (endpoints listed above)

## Development Tips

- Backend changes require restart (Ctrl+C and re-run)
- Frontend has hot-reload enabled (changes apply automatically)
- Check browser DevTools Network tab for API call debugging
- Check backend console for detailed logs

## Production Deployment

For production, you'll need to:
1. Replace H2 with PostgreSQL or MySQL
2. Update application.properties with production database
3. Build frontend: `npm run build`
4. Package backend: `mvn package`
5. Deploy JAR file and frontend build folder to server
6. Update CORS settings to allow only your domain

## License

Proprietary - Healthcare Management System
