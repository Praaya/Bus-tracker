# Live Bus Tracking System – AI Context

## Project Overview
This project is a real-time bus tracking system designed to allow users to view the live location of buses on a map.

The system collects GPS coordinates from a driver device or tracking module and updates the bus location in real time on the frontend map.

This project was created as part of a college/hackathon project focused on improving public transportation visibility.

---

## Tech Stack

Frontend
- React
- Leaflet (map visualization)
- HTML/CSS/JavaScript

Backend
- Node.js
- Express.js

Database
- Firebase / MongoDB (depending on deployment)

Version Control
- GitHub repository

---

## Core Features

- Real-time bus location tracking
- Bus marker displayed on map
- Route visualization
- Bus stop markers
- ETA estimation
- Backend API for location updates

---

## System Architecture

Driver Device (GPS)
        ↓
Backend API (Node.js / Express)
        ↓
Database (stores latest coordinates)
        ↓
Frontend Map (React + Leaflet)

The driver device sends latitude and longitude updates periodically to the backend API.

The frontend fetches updated coordinates and moves the bus marker accordingly.

---

## Important Backend Responsibilities

- Receive GPS coordinates from tracking device
- Store latest location in database
- Provide API endpoint for frontend to fetch bus data
- Ensure location updates occur at regular intervals

Example API endpoint:

POST /update-location

Payload example:

{
  "bus_id": "bus_01",
  "latitude": 26.182,
  "longitude": 91.745,
  "speed": 35
}

---

## Important Frontend Responsibilities

- Render map interface
- Display bus location marker
- Fetch updated coordinates from backend
- Animate marker movement when coordinates change
- Display bus route and stops

---

## Future Improvements

- WebSocket real-time updates instead of polling
- Multiple buses tracking
- Passenger mobile interface
- Traffic-aware ETA calculations
- Authentication for drivers
- Route optimization

---

## When Assisting With This Project

When analyzing this repository, focus on:

- Improving real-time location updates  
- Optimizing API structure
- Debugging frontend map rendering
- Improving project architecture
- Suggesting scalable solutions for live tracking systems