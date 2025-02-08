# Real-Time Event Management Website

## Tech Stack
- **Frontend:** React + vite, Tailwind CSS
- **Backend:** Node.js, Express, socket.io
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary

## Features
- **Real-Time Event Updates:** Implemented WebSocket protocol using `socket.io` for instant event notifications and updates.
- **User Authentication:** Secure login system with username and password authentication.
- **Event Management:** Users can create, manage, and join events.
- **Media Support:** Uploaded images and event media are stored securely using Cloudinary.
- **Scalability:** Optimized for real-time event coordination and participant management.

## Credentials for Testing
- **Username:** `testuser`
- **Password:** `testpassword`

## Key Considerations
- **Initial Login Delay:** Since the backend runs on a free instance, the first login attempt may be slow due to server cold start.
- **Feature Completeness:** All functionalities have been implemented as per the project requirements.

## Installation & Setup
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repository.git
   cd your-repository
2. **Install Dependencies:**
   ```bash
   npm install
3. **Run the application-BACKEND**
   ```bash
   cd backend
   node index.js

