# EventStream

A websocket events platform

# Test Project

This project is a test application built with a **FastAPI** backend and a **React** frontend. The project is structured to ensure scalability and reusability.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Backend Design Decisions](#Backend-design-decisions)
- [Closure](#closure)

## Overview

The application is divided into two main components:

- **Backend**: Built using FastAPI and SQLAlchemy.
- **Frontend**: Developed with React, utilizing React Router and React Query, along with the Shadcn UI library.

## Technologies Used

- **Backend**: FastAPI, SQLAlchemy, Alembic
- **Frontend**: React, React Router, React Query, Shadcn UI
- **Containerization**: Docker Compose
- **Real-time Communication**: WebSockets

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-project-directory>
   ```
2. **Build and start the containers:**:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```
3. **Build and start the containers:**:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```
4. **to create a new migration:**:

   ```bash
   docker-compose exec backend alembic revision --autogenerate -m "migration message"

   ```

5. **Build and start the containers:**:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```
6. **Build and start the containers:**:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

## API Documentation

The API documentation is automatically generated and can be accessed at:

http://localhost:8000/api/docs

## Design Decisions:

In designing the backend of the Realtime Events Management App, I employed the repository pattern and dependency injection

**Repository Pattern**:

- The repository pattern abstracts the data access layer, providing a clean and organized way to manage data operations. By creating dedicated repository classes, I was able to encapsulate the logic for querying and manipulating the database. This separation of concerns improves the overall code structure, making it easier to manage and test.

* Implemented dependency injection further, which enhances the flexibility and testability (which I sadly did not find the time to do) of the application. By using dependency injection, I could easily manage the lifecycle of components and services within the application. This approach allows for more straightforward unit testing, as dependencies can be easily mocked or replaced with test implementations. It also promotes loose coupling between components, making the system more modular and easier to maintain.

* Modular and reusable code structure.
* Custom hooks for enhanced functionality.
* Scalable architecture for future growth.

## Closure:

- despite not making a good looking UI nor a complete functioning application, when I started coding, I envisioned a production-ready application in a weeek, Nothing could be further from the truth, but indeed it was a good learning experience for me
