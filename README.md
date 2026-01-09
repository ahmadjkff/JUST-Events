
# JUST Events

This is a web application for managing events at Jordan University of Science and Technology (JUST). It consists of a React frontend, a Node.js backend, and a simulator API for testing purposes.

## Project Structure

The project is organized into three main directories:

-   `frontend/`: Contains the React.js client-side application.
-   `backend/`: Contains the Node.js Express server-side application.
-   `just-simulator-api/`: A Node.js Express server to simulate JUST services.

## Getting Started

### Prerequisites

-   Node.js (v18.x or later recommended)
-   npm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd JUST-Events
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

4.  **Install Simulator API Dependencies:**
    ```bash
    cd just-simulator-api
    npm install
    cd ..
    ```

### Running the Application

You need to run each part of the application in a separate terminal.

1.  **Run the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend will be running on `http://localhost:3000`.

2.  **Run the Frontend Application:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend development server will be running on `http://localhost:5173`.

3.  **Run the Simulator API:**
    ```bash
    cd just-simulator-api
    npm run dev
    ```
    The simulator will be running on `http://localhost:4000`.

## Key Technologies

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS
-   **Backend**: Node.js, Express, TypeScript, MongoDB (likely, based on typical MERN stack)
-   **Simulator**: Node.js, Express, TypeScript

## Additional Documentation

- [Socket.IO Implementation Details](SOCKET_IO_IMPLEMENTATION.md)
- [Notification Implementation Details](NOTIFICATION_IMPLEMENTATION.md)
- [Additional Notification Information](ADDITIONAL_NOTIFICATIONS.md)

## Usage

The application supports three user roles: **Admin**, **Supervisor**, and **Student**. The workflow is designed to facilitate smooth event management from creation to participation.

### 1. Supervisor Actions

1.  **Login**: A supervisor logs into their account.
2.  **Create Event**: From their dashboard, a supervisor can create a new event by providing details like title, description, date, location, etc.
3.  **Submit for Approval**: Once the event is created, it is submitted to the administrators for approval. The supervisor receives a notification when the event is approved or rejected.
4.  **Manage Registrations**: After an event is approved and live, supervisors can view the list of students who have registered or applied to volunteer. They can then approve or reject these applications.

### 2. Admin Actions

1.  **Login**: An admin logs into their account.
2.  **Review Pending Events**: The admin dashboard displays a list of pending events created by supervisors.
3.  **Approve or Reject Events**: The admin reviews the details of each event and decides to either approve or reject it.
    -   If **approved**, the event becomes visible to all students. The supervisor who created the event is notified.
    -   If **rejected**, the event is sent back to the supervisor for revision. The supervisor is notified.
4.  **Manage All Events**: Admins have full oversight and can manage all events in the system, regardless of their status.

### 3. Student Actions

1.  **Login**: A student logs into their account.
2.  **Browse Events**: Students can browse the list of all approved and upcoming events.
3.  **View Event Details**: They can click on an event to view more details, such as the description, date, time, location, and the hosting supervisor.
4.  **Register/Volunteer**: Students can register to attend an event or apply to be a volunteer (if applicable).
5.  **Receive Notifications**: Students receive real-time notifications about the status of their registration (approved or rejected) and reminders for upcoming events they are registered for.
6.  **Download Certificates**: After attending an event, students may be able to download a certificate of attendance or participation.
