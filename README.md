
# Carats & Crowns - Jewelry E-commerce Platform
## Table of Contents
- Prerequisites
- Environment Setup
- Installation
- Configuration
- Running the Application
- Features
## Prerequisites
Before running the project, ensure you have the following installed:

- Node.js (Latest LTS version)
- PostgreSQL
- Git
## Environment Setup
1. Clone the repository:
```
git clone <repository-url>
cd carats_and_crowns
```
2. Create a .env file in the backend directory with the following variables:
```
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=carats_and_crowns

# JWT Configuration
JWT_SECRET=your_jwt_secret_ke
y

# Email Configuration
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_pas
sword

# Payment Gateway 
Configuration
RAZORPAY_KEY_ID=your_razorpay
_key_id
RAZORPAY_KEY_SECRET=your_razo
rpay_secret_key
```
## Installation
1. Install backend dependencies:
```
cd backend
npm install
```
2. Install frontend dependencies:
```
cd ../frontend
npm install
```
## Configuration
1. Database Setup:
   
   - Create a PostgreSQL database named carats_and_crowns
   - The tables will be automatically created when you start the backend server
2. Email Setup:
   
   - Enable 2-factor authentication in your Gmail account
   - Generate an App Password for the application
   - Use these credentials in the .env file
3. Payment Integration:
   
   - Create a Razorpay account
   - Get your API keys from the dashboard
   - Add them to the .env file
## Running the Application
1. Start the backend server:
```
cd backend
npm start
```
The server will run on http://localhost:5000

2. Start the frontend development server:
```
cd frontend
npm run dev
```
The application will be available at http://localhost:5173

## Features
### User Features
- User authentication (Login/Signup)
- Email verification with OTP
- Browse products
- Custom jewelry orders
- Shopping cart management
- Secure checkout process
- Order tracking
- Password reset functionality
### Admin Features
- Product management
- Order management
- User management
- Custom order handling
### Security Features
- JWT-based authentication
- Password hashing
- Protected admin routes
- Secure payment processing
### Technical Features
- Responsive design
- Image upload functionality
- Email notifications
- Real-time order updates
## Troubleshooting
1. If you encounter database connection issues:
   
   - Verify PostgreSQL is running
   - Check database credentials in .env
   - Ensure the database exists
2. If email sending fails:
   
   - Verify Gmail credentials
   - Check if less secure app access is enabled
   - Confirm the App Password is correct
3. For payment integration issues:
   
   - Verify Razorpay API keys
   - Ensure test mode is enabled for development
   - Check the payment callback URLs
