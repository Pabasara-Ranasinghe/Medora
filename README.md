# 🩺 Medora — AI-Powered Health Guidance Platform

Medora is a full-stack healthcare web application designed to help users understand their laboratory results through structured report analysis and AI-powered health guidance. Built with React, Spring Boot, MySQL, and Groq AI, Medora combines modern full-stack development with AI to provide a simple and user-friendly health information experience.

The platform allows users to enter laboratory test results, compare values against reference ranges, and receive easy-to-understand explanations of their results. Medora supports multiple laboratory tests, including CBC, Blood Glucose, Lipid Profile, LFT, RFT, and TFT, while providing a structured workflow from result entry to AI-generated guidance.

The project was developed to explore how AI and modern web technologies can be combined to make complex health information easier to understand, while keeping the user experience simple and accessible.

> ⚠️ **Disclaimer:** Medora is an educational and informational project. Its results and AI-generated guidance are not medical diagnoses or professional medical advice.

---

## ✨ Features

* 🔐 User registration and JWT-based authentication
* 🧠 AI-powered health guidance using Groq
* 📋 Health report creation and management
* 🧪 Laboratory result analysis
* 📊 Medora and laboratory-specific reference ranges
* 🔒 Secure environment-based configuration

### Supported Laboratory Tests

| Test             | Analysis                       |
| ---------------- | ------------------------------ |
| 🩸 CBC           | Complete Blood Count           |
| 🩸 Blood Glucose | Glucose analysis               |
| ❤️ Lipid Profile | Cholesterol and lipid analysis |
| 🧪 LFT           | Liver Function Test            |
| 🧪 RFT           | Kidney / Renal Function Test   |
| 🦋 TFT           | Thyroid Function Test          |

---

# 📸 Screenshots

## 🏠 Home

The landing page provides an overview of Medora and access to its health analysis features.

<img width="1405" height="868" alt="Medora Home" src="https://github.com/user-attachments/assets/039a8019-313f-45bd-ac33-1790e9735404" />

## 🔐 Authentication

### Login

<img width="690" height="777" alt="Medora Login" src="https://github.com/user-attachments/assets/4a7f7479-ff8c-4a69-8296-809a49630cb8" />

### Create Account

<img width="1403" height="867" alt="Create Account" src="https://github.com/user-attachments/assets/443324af-e44e-4050-9f5d-d2ddb762d8f9" />

<img width="1407" height="456" alt="Create Account Form" src="https://github.com/user-attachments/assets/c9e02ab7-3aaa-44cb-a409-94e90cdad2aa" />

## 📊 Health Reports

Users can select from the available laboratory test categories and begin an analysis.

<img width="1402" height="747" alt="Health Reports" src="https://github.com/user-attachments/assets/64377264-ee9e-409b-92e6-4e18b30c5626" />

---

# 🩸 Laboratory Analysis — Example

The Blood Glucose module demonstrates Medora's laboratory analysis workflow.

### Select a Test

<img width="1407" height="862" alt="Blood Glucose Analysis" src="https://github.com/user-attachments/assets/afae9090-a84b-49d5-8842-5de1f8f3ff3f" />

### Choose Reference Ranges

Users can select **Medora reference values** or provide **laboratory-specific reference values**.

<img width="1406" height="475" alt="Reference Range Selection" src="https://github.com/user-attachments/assets/77244e0d-4494-4405-bb74-6438de7db58f" />

### Enter Results

Users enter values from their laboratory report for analysis.

<img width="1407" height="502" alt="Enter Laboratory Values" src="https://github.com/user-attachments/assets/84c1b6b4-96c2-48d2-b85b-4dae59c0df09" />

### Result Interpretation

Values are categorized according to the selected reference range.

**Below Range**

<img width="1406" height="493" alt="Below Reference Range" src="https://github.com/user-attachments/assets/a331251b-5b66-4c03-8934-b6aea426e215" />

**Within Range**

<img width="1405" height="492" alt="Within Reference Range" src="https://github.com/user-attachments/assets/a59223da-d07e-419b-840c-5801a508930d" />

**Above Range**

<img width="1405" height="553" alt="Above Reference Range" src="https://github.com/user-attachments/assets/c94e467e-43a7-439a-a6b8-f9f0e36c95ce" />

---

# 🧠 AI Health Guidance

Medora uses Groq AI to generate easy-to-understand explanations based on analyzed health information.

<img width="1407" height="797" alt="AI Health Guidance" src="https://github.com/user-attachments/assets/f050b1e3-0e28-49cf-bb6b-a6f0b592b791" />

<img width="1407" height="866" alt="AI Health Guidance Details" src="https://github.com/user-attachments/assets/15a0b183-3eab-4c88-97de-d81758e7b75e" />

---

# 🏗️ Architecture

```text
                    User
                      │
                      ▼
              React + Vite
                      │
                  REST API
                      │
                      ▼
             Spring Boot Backend
                ┌─────┴─────┐
                ▼           ▼
             MySQL       Groq AI
                │           │
                └─────┬─────┘
                      ▼
                Health Guidance
                      │
                      ▼
                  React UI
```

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS
* React Router

### Backend

* Java
* Spring Boot
* Spring Data JPA
* REST APIs
* JWT
* BCrypt

### Database

* MySQL
* Hibernate / JPA

### AI

* Groq API
* `openai/gpt-oss-120b`

### Tools

* Git & GitHub
* VS Code
* IntelliJ IDEA
* Postman

---

# 🔐 Security

* JWT-based authentication
* BCrypt password hashing
* Protected backend resources
* Environment-based API key configuration
* User-specific health information

> API keys and database credentials are managed through environment variables and are not included in the repository.

---

# 🚀 Getting Started

Follow the steps below to run Medora locally.

### Prerequisites

Make sure the following are installed:

* Java 17+
* Maven
* Node.js & npm
* MySQL 8+
* Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/PabasaraRanasinghe216/Medora.git
cd Medora
```

### 2. Create the Database

Open MySQL and create the Medora database:

```sql
CREATE DATABASE medora;
```

### 3. Configure Environment Variables

Configure the required environment variables:

```text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
GROQ_API_KEY=your_groq_api_key
```

> 🔐 API keys and database credentials are managed through environment variables and are not included in the repository.

### 4. Start the Backend

Open a terminal in the backend directory:

```bash
cd backend
mvn spring-boot:run
```

The backend will run at:

```text
http://localhost:8081
```

### 5. Install Frontend Dependencies

Open another terminal and navigate to the frontend:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### 7. Open Medora

Open the URL provided by Vite in your browser and start using the application.

---

# 🔮 Future Improvements

* 📸 Medical report image upload and analysis
* 📄 Downloadable health reports
* 💬 Conversational AI health assistant
* 📊 Additional laboratory tests
* 📱 Mobile application
* 🌍 Multi-language support
* ☁️ Cloud deployment

---

# 👩‍💻 Developer

**Pabasara Ranasinghe**

Second Year Software Engineering Undergraduate

Interested in **AI, Frontend Development, Full-Stack Development, and Software Engineering**.

🔗 **GitHub Repository:** [Pabasara-Ranasinghe/Medora](https://github.com/Pabasara-Ranasinghe/Medora)

---

# 📄 License

This project is licensed under the **MIT License**.
