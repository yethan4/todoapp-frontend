# To-Do App

The backend is hosted on Render, so it may take up to a minute to start after the first request. Thank you for your patience!<br>
[todoapp-yethan.netlify.app](https://todoapp-yethan.netlify.app/login)

## Technologies Used

- **Frontend**: React
- **Backend**: Python (Django REST Framework, providing REST API for task management, JWT for user authentication)

## Description

The backend, built with Django REST Framework, provides a RESTful API for managing tasks — including creating, deleting, editing, and marking them as completed or not. It also handles user authentication using JWT (JSON Web Tokens) to ensure secure access to user-specific data.
[backend-code](https://github.com/yethan4/todoapp-backend)

The frontend, built with React, offers a clean and interactive user interface for viewing tasks, creating new ones, deleting them, and editing their content or completion status. It communicates with the backend via HTTP requests, using JWT for authentication, which allows secure, stateless communication between the client and server.

## Purpose & Notes

This is a very simple and basic application, created primarily to demonstrate my understanding of:

* Building a basic backend with Django REST Framework
* Implementing JWT-based authentication
* Connecting a React frontend with an API backend

While the frontend currently lacks optimization and polish, it serves its purpose as a working interface. I plan to improve and expand the application in the future by adding more features, better UI/UX, persistent storage, and more advanced functionality.


## Installation – I’ll update this soon.

### Backend Setup Instructions

Follow these steps to set up the application locally:

  1. **Clone the backend repository**
  
  &nbsp;&nbsp;&nbsp;&nbsp;In the project directory, you can run:
  ```bash
  git clone https://github.com/yethan4/todoapp-backend
  cd todoapp-backend
  ```
  
  2. **Create a Virtual Environment**
  ```bash
  python -m venv venv
  ```

  3. **Then activate the virtual environment:**
  
  &nbsp;&nbsp;&nbsp;&nbsp;On macOS/Linux:
  ```bash
  source venv/bin/activate 
  ```
  &nbsp;&nbsp;&nbsp;&nbsp;On Windows
  ```bash
  venv\Scripts\activate
  ```
  4. **Install Dependencies**
  ```bash
  pip install -r requirements.txt
  ```
  5. **Apply Database Migrations**
  ```bash
  python manage.py migrate
  ```
  6. **Create a Superuser (optional)**
  If you want to access the Django admin interface, you can create a superuser with the following command:
  ```bash
  python manage.py createsuperuser
  ```
  7. **Start the Backend Server**
  Finally, run the server with::
  ```bash
  python manage.py runserver
  ```


### Frontend Setup Instructions

Follow these steps to set up the application locally:

  1. **Clone the frontend repository**
  
  In the project directory, you can run:
  
  ```bash
  git clone https://github.com/yethan4/todoapp-frontend
  cd todoapp-frontend
  ```
  
  2. **Install Dependencies**
  
  If you're using npm:
  ```bash
  npm install
  ```
  
  If you're using yarn:
  ```bash
  yarn install
  ```
  3. **Run project**
  
  Using npm:
  ```bash
  npm start
  ```
