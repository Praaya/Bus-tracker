#!/bin/bash

# Backend
konsole -e bash -c "cd backend && npm run dev; exec bash" &
sleep 1
wmctrl -r "backend" -e 0,800,0,800,500

# Driver app
konsole -e bash -c "cd driver-app && npx expo start; exec bash" &
sleep 1
wmctrl -r "driver-app" -e 0,0,0,800,900

# Dashboard
konsole -e bash -c "cd dashboard && npm run dev; exec bash" &
sleep 1
wmctrl -r "dashboard" -e 0,800,500,800,400
