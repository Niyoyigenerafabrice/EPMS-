# Stock Inventory Management System (SIMS)

**Client:** SmartPark — Rubavu District, Rwanda  
**Stack:** React.js + Node.js (Express) + MySQL + Tailwind CSS + Axios

## Project Structure

```
FirstName_LastName_National_Practical_Exam_2025/
├── backend-project/     # Node.js + Express API server
│   ├── config/          # Database configuration
│   ├── routes/          # API route handlers
│   ├── server.js        # Main server entry point
│   └── database.sql     # Database schema
└── frontend-project/    # React.js frontend
    └── src/
        ├── api/         # Axios API integration files
        ├── components/  # Reusable components (Navbar)
        └── pages/       # Page components
```

## Setup

### Database
```bash
mysql -u root < backend-project/database.sql
```

### Backend
```bash
cd backend-project
npm install
# Create .env file with DB credentials
npm start
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend-project
npm install
npm start
# App runs on http://localhost:3000
```

## API Endpoints

| Resource | POST | GET | PUT | DELETE |
|----------|------|-----|-----|--------|
| `/api/auth/login` | Login | — | — | — |
| `/api/auth/register` | Register | — | — | — |
| `/api/spare-parts` | Add | List | — | — |
| `/api/stock-in` | Add | List | — | — |
| `/api/stock-out` | Add | List | Update | Delete |
| `/api/reports/daily-stockout` | — | Report | — | — |
| `/api/reports/stock-status` | — | Report | — | — |

## Features

- Session-based authentication with bcrypt password hashing
- CRUD operations for stock management
- Daily stock out reports with date filtering
- Stock status overview (stored qty, stock out qty, remaining qty)
- Responsive UI with Tailwind CSS
