# Customer Churn Prediction Frontend

This is the React frontend for the Customer Churn Prediction application.

## Features
- Single-page form to collect customer data.
- Groups fields into logical sections (Personal, Location, Account, Services, Billing).
- Validates inputs and sends data to the FastAPI backend.
- Displays churn prediction results.

## Tech Stack
- React.js (Vite)
- Tailwind CSS
- Axios

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## API Integration
The form sends a POST request to `http://127.0.0.1:8000/api/v1/predict` with the collected data in JSON format.
