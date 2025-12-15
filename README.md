# ZegoCloud Voice Calling Assignment

This project consists of two React applications configured to communicate via ZegoCloud Voice Call.

## Prerequisites

- Node.js installed

## Project Structure

- **app-a**: Represents "User A" (Runs on Port 3000)
- **app-b**: Represents "User B" (Runs on Port 3001)

## Setup & Running

1. **Install Dependencies**
   Navigate to each folder and install dependencies:

   ```bash
   cd app-a
   npm install
   cd ../app-b
   npm install
   ```

2. **Start the Applications**
   Open two terminal windows.

   Terminal 1 (User A):
   ```bash
   cd app-a
   npm run dev
   ```

   Terminal 2 (User B):
   ```bash
   cd app-b
   npm run dev
   ```

3. **Testing**
   - Open Browser: http://localhost:3000 (User A)
   - Open Browser: http://localhost:3001 (User B)
   - Click "Voice Call" on either app to call the other user.
