# 🩺 Medora — AI-Powered Health Guidance Platform

Medora is a full-stack healthcare web application designed to help users understand their laboratory results through **structured report analysis and AI-powered health guidance**.

Built with **React, Spring Boot, MySQL, and Groq AI**, Medora combines modern full-stack development with AI to provide a simple and user-friendly health information experience.

> ⚠️ **Disclaimer:** Medora is an educational and informational project. Its results and AI-generated guidance are not medical diagnoses or professional medical advice.

---

## ✨ Features

* 🔐 Secure user registration and login
* 🔑 JWT-based authentication
* 🧠 AI-powered health guidance using Groq
* 📋 Health report creation and management
* 📊 Support for Medora and laboratory-specific reference ranges
* 🔒 Environment-based protection for sensitive credentials

---

# 📸 Screenshots

## 🏠 Home Page

The Medora home page provides an overview of the platform and access to its health analysis features.

<img width="1405" height="868" alt="Screenshot 2026-09-24 145941" src="https://github.com/user-attachments/assets/039a8019-313f-45bd-ac33-1790e9735404" />

---

## 🔐 Login

Users can securely sign in to access their personalized health information and reports.

<img width="690" height="777" alt="Medora Login" src="https://github.com/user-attachments/assets/4a7f7479-ff8c-4a69-8296-809a49630cb8" />

---

## 📝 Create an Account

New users can create a Medora account to access the laboratory analysis and AI health guidance features.

<div align="center"><img width="1403" height="867" alt="Create Account" src="https://github.com/user-attachments/assets/443324af-e44e-4050-9f5d-d2ddb762d8f9" />
<img width="1407" height="456" alt="Create Account Form" src="https://github.com/user-attachments/assets/c9e02ab7-3aaa-44cb-a409-94e90cdad2aa" /></div>


---

## 📊 Health Reports

Users can access the available laboratory report categories and select the type of test they want to analyze.

<img width="1402" height="747" alt="Health Reports" src="https://github.com/user-attachments/assets/64377264-ee9e-409b-92e6-4e18b30c5626" />

---

# 🩸 Blood Glucose Analysis — Example

The Blood Glucose module demonstrates how Medora processes laboratory results using reference ranges.

### 1. Select the Analysis

Users can select **Blood Glucose** from the available laboratory report categories.

<img width="1407" height="862" alt="Blood Glucose Analysis" src="https://github.com/user-attachments/assets/afae9090-a84b-49d5-8842-5de1f8f3ff3f" />

<img width="1406" height="475" alt="Blood Glucose Reference Selection" src="https://github.com/user-attachments/assets/77244e0d-4494-4405-bb74-6438de7db58f" />

### 2. Enter Laboratory Values

Users can enter the values from their laboratory report into the corresponding fields.

<img width="1407" height="502" alt="Enter Blood Glucose Values" src="https://github.com/user-attachments/assets/84c1b6b4-96c2-48d2-b85b-4dae59c0df09" />

### 3. Below the Reference Range

When a value is below the selected reference range, Medora identifies the result accordingly.

<img width="1406" height="493" alt="Screenshot 2026-09-24 133010" src="https://github.com/user-attachments/assets/a331251b-5b66-4c03-8934-b6aea426e215" />


### 4. Within the Reference Range

When a value falls within the selected reference range, Medora identifies it as being within the expected range.

<img width="1405" height="492" alt="Within Reference Range" src="https://github.com/user-attachments/assets/a59223da-d07e-419b-840c-5801a508930d" />

### 5. Above the Reference Range

When a value is above the selected reference range, Medora identifies the result accordingly.

<img width="1405" height="553" alt="Above Reference Range" src="https://github.com/user-attachments/assets/c94e467e-43a7-439a-a6b8-f9f0e36c95ce" />

### Reference Range Selection

Users can choose between **Medora reference values** and **laboratory-provided reference values**, allowing the analysis to be adapted to the reference ranges used by their laboratory.

---

# 🧠 AI Health Guidance

After analyzing laboratory results, Medora provides AI-powered guidance to help users better understand their results.

The AI-generated information is presented in a simple and accessible format.

<img width="1407" height="797" alt="Screenshot 2026-09-24 194155" src="https://github.com/user-attachments/assets/f050b1e3-0e28-49cf-bb6b-a6f0b592b791" />

<img width="1407" height="866" alt="Screenshot 2026-09-24 194237" src="https://github.com/user-attachments/assets/15a0b183-3eab-4c88-97de-d81758e7b75e" />


---

# 🔄 How It Works

```text
                         User
                           │
                           ▼
                   React Frontend
                           │
                           ▼
                      REST APIs
                           │
                           ▼
                  Spring Boot Backend
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
              MySQL Database    Groq AI
                                  │
                                  ▼
                           AI Health Guidance
                                  │
                                  ▼
                           React Frontend
                                  │
                                  ▼
                                User
```

---

# 🏗️ Architecture

## Frontend

* React.js
* Vite
* JavaScript
* CSS
* React Router

## Backend

* Java
* Spring Boot
* Spring Data JPA
* REST APIs
* JWT Authentication
* BCrypt

## Database

* MySQL
* Hibernate / JPA

## AI

* Groq API
* `openai/gpt-oss-120b`

## Development Tools

* Git & GitHub
* VS Code
* IntelliJ IDEA
* Postman

---

# 🧪 Laboratory Report Analysis

Medora currently supports six laboratory report categories:

| Report           | Description                    |
| ---------------- | ------------------------------ |
| 🩸 CBC           | Complete Blood Count           |
| 🩸 Blood Glucose | Blood glucose analysis         |
| ❤️ Lipid Profile | Cholesterol and lipid analysis |
| 🧪 LFT           | Liver Function Test            |
| 🧪 RFT           | Kidney / Renal Function Test   |
| 🦋 TFT           | Thyroid Function Test          |

Users can enter their laboratory results and, where supported, choose between **Medora reference values** and **laboratory-provided reference values**.

The application compares entered values against the selected reference ranges and identifies results such as **Low, Normal, or High**.

---

# 🔌 API

The Spring Boot backend provides REST APIs for the application's main modules:

| Module         | Purpose                        |
| -------------- | ------------------------------ |
| Authentication | User registration and login    |
| Reports        | Health report management       |
| CBC            | Complete Blood Count analysis  |
| Blood Glucose  | Glucose result analysis        |
| Lipid Profile  | Lipid result analysis          |
| LFT            | Liver function analysis        |
| RFT            | Kidney function analysis       |
| TFT            | Thyroid function analysis      |
| AI             | AI-powered health guidance     |
| User           | Authenticated user information |

Backend:

```text
http://localhost:8081
```

---

# 🔑 Environment Configuration

Sensitive credentials are **not stored in the repository**.

Medora uses environment variables for sensitive configuration:

```text
DB_USERNAME
DB_PASSWORD
GROQ_API_KEY
```

A safe configuration example is provided in:

```text
backend/src/main/resources/application-example.properties
```

> ⚠️ Never commit database passwords, API keys, or other sensitive credentials to GitHub.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* Java 17+
* Maven
* Node.js & npm
* MySQL 8+
* Groq API key

## Clone the Repository

```bash
git clone https://github.com/PabasaraRanasinghe216/Medora.git
cd Medora
```

## Create the Database

Create the MySQL database:

```sql
CREATE DATABASE medora;
```

Configure the required environment variables before starting the application.

## Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8081
```

## Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

# 🔒 Security

Medora includes several security measures:

* JWT-based authentication
* BCrypt password hashing
* Protected backend resources
* Environment-based API key configuration
* Local application configuration excluded from Git
* User-specific health information

---

# 🎯 Project Goals

Medora was developed to explore how **AI and full-stack web development** can be combined to create practical healthcare applications.

The project provides hands-on experience with:

* Full-stack web development
* REST API development
* Authentication and security
* Database integration
* AI API integration
* Laboratory-result processing
* User-focused interface design

---

# 🔮 Future Improvements

* 📸 Medical report image upload and analysis
* 📄 Downloadable health reports
* 📊 Additional laboratory test categories
* 💬 Conversational AI health assistant
* 📱 Mobile application
* 🌍 Multi-language support
* ☁️ Cloud deployment
* 📈 Health data visualizations

---

# 👨‍💻 Developer

**Pabasara Ranasinghe**

Second Year Software Engineering Student — NIBM

Interested in **AI, Frontend Development, Full-Stack Development, and Software Engineering**.

### GitHub

**PabasaraRanasinghe216**

---

# 📄 License

This project is licensed under the **MIT License**.
