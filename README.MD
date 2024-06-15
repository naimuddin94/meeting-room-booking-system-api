# 🔗 Meeting Room Booking System Application

The Co-Working Space Management Application streamlines the administration and booking of co-working spaces. Administrators can manage room details and time slots efficiently, ensuring up-to-date inventory. Users enjoy a seamless booking experience with real-time availability updates and automatic cost calculations, making the process smooth and conflict-free. This application enhances efficiency and satisfaction for both administrators and users.

## Live Api

[![Live API](https://img.shields.io/badge/API-Live-brightgreen?style=for-the-badge)](https://room-booking-api-mocha.vercel.app)

## Features

- User authentication - (Create, Login, Logout)
- JWT - (Access Token and Refresh Token)
- Room - (Create, Fetch, Update and delete with authenticate role base)
- Slot - (Administrators can create multiple slot at time with base one available time without conflict)
- Booking - (Authenticate user can booking available room slot and administrator can update it)

### Admin Actions

- Room Management: Administrators have the privilege of creating, updating, and deleting rooms. They can specify details such as the room's name, room number, floor number, capacity, price per slot, and available amenities.

- Slot Management: Admins are responsible for creating time slots for each room. They set the date, start time, and end time for these slots, ensuring that users have a range of options to choose from.

- Inventory Management: Through the web interface, admins can effortlessly manage the co-working space inventory and slot availability, ensuring accurate and up-to-date information for users.

### User Interactions

- Booking Creation: Individuals can create bookings by selecting from the available time slots for their desired meeting times. They input the date and select specific slots for their sessions, along with their preferred room selection.

- Cost Calculation: The system automatically calculates the total amount based on the number of slots selected and the price per slot.

- Real-Time Availability: Users receive real-time feedback on the availability of rooms and slots, ensuring smooth booking experiences without conflicts.

## Run Locally

Clone the project

```bash
  git clone https://github.com/naimuddin94/meeting-room-booking-system-api.git
```

Go to the project directory

```bash
  cd meeting-room-booking-system-api
```

Install dependencies

```bash
  npm install
```

Start the server development

```bash
  npm run dev
```

Build project

```bash
  npm run build
```

## 🔗 Documentation

[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://documenter.getpostman.com/view/34122341/2sA3XQh2Rt)

## Database Diagram

![Diagram](https://res.cloudinary.com/dxoncladp/image/upload/v1718436659/Untitled_ej3xcc.png)
