# Task Management Dashboard

A full-stack task management application with CRUD operations built with Next.js and Spring Boot.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Spring Boot, Java, Maven
- Database: H2 (in-memory)

## Features

- Create, Read, Update, Delete tasks
- Task status: Pending, In Progress, Completed
- Live statistics dashboard
- Responsive design

## Run Locally

### Backend
cd task-backend
mvn spring-boot:run

### Frontend
cd task-dashboard
npm install
npm run dev

Open: http://localhost:3000

## API Endpoints

- GET    /api/tasks          - Get all tasks
- POST   /api/tasks          - Create a task
- PUT    /api/tasks/{id}     - Update a task
- DELETE /api/tasks/{id}     - Delete a task

## Project Structure

task-management-dashboard/
- task-dashboard/     # Next.js frontend
- task-backend/       # Spring Boot backend

## Author

Sapoorna Janani

GitHub: https://github.com/Sapoorna
LinkedIn: https://www.linkedin.com/in/sapoorna-janani-6169b5264/
Portfolio: https://sapoornajanani.vercel.app
