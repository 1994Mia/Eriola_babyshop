-Eriola Babyshop

Eriola Babyshop is a full-stack web application developed as part of a university coursework project. The application is designed to manage and display baby products using a modern client–server architecture. The backend is implemented using Java and Spring Boot, while the frontend is built with modern JavaScript tools.
The purpose of this project is to demonstrate full-stack development skills, database integration, RESTful API design, and proper use of version control with GitHub.

-Project Overview
The application follows a clear separation of concerns:
- A backend service that handles business logic, database operations, and API endpoints.
- A frontend application that consumes the backend APIs and provides an interactive user interface.
This project was created for academic purposes and reflects practical implementation of concepts learned in class.

- Project Structure
Eriola_babyshopNew/
├── backend/                 Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
├── frontend/                Frontend application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md                Project documentation



- Technologies Used
Backend:
- Java 17
- Spring Boot
- Spring Data JPA (Hibernate)
- MySQL
- Maven

Frontend:
- Node.js
- npm
- Vite
- JavaScript framework (React or Vue)

Tools:
- Git and GitHub
- Visual Studio Code
- MySQL Server

- Prerequisites
The following software must be installed to run the project:
- Java JDK 17
- Node.js (LTS version recommended)
- npm
- MySQL Server
- Git (optional but recommended)

Installation can be verified using:
java -version  
node -v  
npm -v  
mysql --version  

-Backend Setup

A MySQL database must be created before running the backend.
Example:
CREATE DATABASE eriola_babyshop;
Database configuration is located in:
backend/src/main/resources/application.properties

Example configuration:
spring.datasource.url=jdbc:mysql://localhost:3306/eriola_babyshop  
spring.datasource.username=root  
spring.datasource.password=your_password  

spring.jpa.hibernate.ddl-auto=update  
spring.jpa.show-sql=true  
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect  
To run the backend:
cd backend  
./mvnw spring-boot:run  
On Windows:
mvnw.cmd spring-boot:run  
The backend will run on:
http://localhost:8080
-Frontend Setup
Install dependencies:
cd frontend  
npm install  

Run the development server:
npm run dev  

The frontend will be available at:
http://localhost:5173

-Common Issues
If PowerShell blocks npm scripts with an execution policy error, run PowerShell as Administrator and execute:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Restart Visual Studio Code and try again.
If a MySQL connection error occurs, ensure that:
- MySQL Server is running
- Database credentials are correct
- The correct port (default 3306) is used
Test the connection using:
mysql -u root -p

-Running the Application
To run the full application:
1. Start the MySQL Server
2. Run the Spring Boot backend
3. Run the frontend development server
4. Open the application in a web browser
Frontend URL: http://localhost:5173  
Backend API URL: http://localhost:8080  

- Learning Outcomes
This project demonstrates:
- Full-stack web application development
- Backend and frontend integration
- Database management using MySQL
- RESTful API development
- Use of Git and GitHub for version control

 - Author
Umije Tafciu
Ester Sula
Andja Gjonaj
-Eriola Babyshop  
University Full-Stack Development Project

- License
This project was developed for academic purposes and is intended for educational use only.
