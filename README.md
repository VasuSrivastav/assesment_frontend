# Customer Management System

A modern React application for customer registration and management.

## 🚀 Quick Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

- React with Vite
- TailwindCSS for styling
- Axios for API calls
- React Router for navigation

## 🔥 Key Features

### 📝 Customer Registration

- **Smart Form Validation**

  - Real-time error checking
  - Password strength meter
  - Character count for address
  - Automatic location detection

- **Enhanced UX**
  - Responsive design
  - Mobile-friendly interface
  - Toast notifications
  - Loading states

### 👥 Customer List View

- **Comprehensive Display**

  - All registered users visible
  - Device information
  - Registration timestamps
  - Location data

- **Smart Layout**
  - Grid/List view
  - Responsive cards
  - Device type badges
  - Interactive UI elements

### 🎨 UI Components

- **Navigation**

  - Responsive navbar
  - Mobile menu
  - Active route highlighting

- **Notifications**
  - Toast messages
  - Status indicators
  - Error handling

### 🔄 Server Status

- Auto-detection of server state
- Retry mechanism
- Wake server functionality
- Status notifications

## 💡 Special Features

1. **Device Detection**

   - Browser identification
   - OS detection
   - Device type recognition

2. **Location Services**

   - Automatic coordinates capture
   - Location error handling
   - Permission management

3. **Real-time Validation**

   - Password strength indicator
   - Form field validation
   - Instant feedback

4. **Responsive Design**
   - Mobile-first approach
   - Tablet optimization
   - Desktop enhancement

## 🏗 Project Structure

```plaintext
src/
  ├── components/
  │   ├── CustomerList.jsx    # Customer display
  │   ├── Registration.jsx    # Registration form
  │   ├── Navbar.jsx         # Navigation
  │   ├── ServerStatus.jsx   # Server monitoring
  │   └── Toaster.jsx        # Notifications
  ├── config/
  │   └── config.js          # Configuration
  └── utils/
      └── deviceInfo.js      # Device detection
```
