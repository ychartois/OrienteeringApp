# Orienteering Control Description Learning App

A mobile application to help users learn and understand IOF (International Orienteering Federation) control description symbols.

## Project Overview

This application aims to educate users on IOF control description symbols, enabling them to interpret control description sheets independently. It provides interactive learning experiences, practice tools, and progress tracking to help users improve their understanding of orienteering control descriptions.

## Features

- **Symbol Library**: A comprehensive catalog of IOF symbols with detailed descriptions
- **Interactive Quizzes**: Engaging quizzes to test symbol knowledge
- **Control Sheet Simulator**: A tool to practice interpreting full control description sheets
- **Progress Tracking**: Monitor user advancement and provide feedback

## Project Structure

```
OrienteeringApp/
├── frontend/                 # React Native mobile app
│   ├── src/
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # App screens
│   │   ├── navigation/       # Navigation configuration
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   ├── package.json          # Frontend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utility functions
│   ├── config/               # Configuration files
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables
│
├── assests/                  # Orienteering symbol images
├── specs/                    # Project specifications
└── python/                   # Asset extraction scripts
```

## Technology Stack

- **Frontend**: React Native with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication
- **State Management**: Redux or Context API

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database)
- React Native development environment

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

   If you encounter dependency conflicts, try:
   ```
   npm install --legacy-peer-deps
   ```
   
   For TypeScript errors, make sure to install type definitions:
   ```
   npm install --save-dev @types/react-native @types/react-native-vector-icons
   ```
   
   For issues with vector icons on web:
   ```
   # For Android, you may need to link the vector icons
   npx react-native link react-native-vector-icons
   ```
   
   If you encounter webpack errors with vector icons:
   - The webpack.config.js has been configured to handle vector icons
   - A simplified implementation of MaterialCommunityIcons is provided for web
   - You may need to restart the webpack dev server after making changes

3. Start the development server:
   ```
   npm start
   ```

4. Run on Android or iOS:
   ```
   npm run android
   # or
   npm run ios
   ```

5. Run on Web (for easier testing):
   ```
   npm run web
   ```
   This will open a browser window at http://localhost:3000 with the app running.

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the MongoDB Atlas connection string with your credentials
   - To set up MongoDB Atlas:
     1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     2. Create a new cluster
     3. Create a database user with read/write privileges
     4. Get your connection string from the "Connect" button
     5. Replace `<username>` and `<password>` in the connection string with your database user credentials

4. Start the server:
   ```
   npm run dev
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
