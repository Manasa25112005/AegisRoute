🚀 AegisRoute
An Intelligent ML-Driven AI Gateway with Adaptive Routing

AegisRoute is an intelligent AI Gateway designed to dynamically select the most suitable gateway based on real-time performance and availability.

The system uses a Decision Tree machine learning model to evaluate gateway parameters such as response time, failure count, cost, status, and circuit-breaker state. It combines ML-based gateway selection with health monitoring, fault tolerance, routing decision tracking, and a React dashboard.

🚀 Features

- 🤖 **ML-Based Gateway Selection** – Uses a Decision Tree model for intelligent gateway prediction.
- ⚡ **Adaptive Routing** – Selects a suitable gateway based on current gateway conditions.
- ❤️ **Gateway Health Monitoring** – Monitors gateway status and response time.
- 🛡️ **Circuit Breaker** – Prevents unhealthy gateways from being selected when the circuit is open.
- 📊 **Routing Decision Tracking** – Records routing decisions and gateway performance.
- 🧠 **Python ML Service** – Flask-based prediction service integrated with Spring Boot.
- 🗄️ **PostgreSQL Database** – Stores gateway and routing information.
- 💻 **React Dashboard** – Displays gateway configuration and performance information.

🏗️ Architecture

```text
Client Request
      ↓
Spring Boot Backend
      ↓
Gateway Information
      ↓
Decision Tree ML Model
      ↓
Gateway Prediction
      ↓
Routing Engine
      ↓
Selected Gateway
      ↓
PostgreSQL
      ↓
React Dashboard
```
🧠 Machine Learning

AegisRoute uses a Decision Tree classification model for gateway selection.
Prediction Factors
The model considers:
- Gateway Name
- Response Time
- Failure Count
- Cost
- Circuit Breaker State
- Gateway Status
The trained model predicts the most suitable gateway based on these input features.
ML Components
```
ml-training/
│
├── gateway_dataset.csv
├── train_model.py
├── gateway_model.pkl
└── predict.py
```

The trained model is exposed through a Flask prediction API, and the Spring Boot backend communicates with the ML service to obtain the prediction.

💻 Quick Start
1. Clone the Repository
```
git clone https://github.com/Manasa25112005/AegisRoute.git
cd AegisRoute
```
2. Configure PostgreSQL
Create a PostgreSQL database for the application.

Update the database configuration in:
```
src/main/resources/application.properties
```
Configure:
```
Database URL
Username
Password
```
3. Start the ML Prediction Service
Navigate to the ML service directory and start the Flask application.

The prediction API is available at:
```
http://localhost:5001/predict
```
The Spring Boot application sends gateway information to this endpoint and receives the predicted gateway.

4. Start the Spring Boot Backend
From the project root, run:

Windows
```
mvnw.cmd spring-boot:run
```
Linux / macOS
```
./mvnw spring-boot:run
```
The backend runs on:
```
http://localhost:8080
```
5. Start the React Dashboard

Navigate to the frontend directory:
```
cd frontend
``` 
Install the required dependencies:
```
npm install
```
Start the development server:
```
npm run dev
```
The React dashboard will be available through the Vite development server.

🔄 Routing Process
When a routing request is received:
1. Spring Boot retrieves the available gateway information.
2. Gateway performance parameters are collected.
3. The parameters are sent to the Flask ML prediction service.
4. The Decision Tree model predicts the suitable gateway.
5. Spring Boot receives the prediction.
6. The Routing Engine selects the predicted available gateway.
7. Gateways with an open circuit or unavailable status are prevented from being selected.
8. The routing result can be stored for monitoring and analysis.
Example:
```
Request
   ↓
Gateway Data
   ↓
ML Prediction
   ↓
Routing Engine
   ↓
Selected Gateway
```
🛡️ Circuit Breaker

AegisRoute uses a circuit-breaker mechanism to improve fault tolerance.

CLOSED

The gateway is available for routing.

OPEN

The gateway is considered unavailable and should not be selected.

LIMITED

The gateway's availability can be restricted based on its current condition.
This helps prevent repeated requests from being sent to an unhealthy gateway.

🔌 API Endpoints
Get All Gateways
```
GET /gateways
```

Returns the available gateway information.
Test Gateway Routing
```
GET /gateways/route
```
Example response:
```
Selected Gateway : Claude
```
The selected gateway is determined by the current gateway information and ML prediction.

🖥️ Dashboard
The React dashboard provides information about:
- Gateway configuration
- Gateway status
- Gateway health
- Response time
- Cost
- Circuit-breaker state
- Gateway performance
 
🛠️ Technology Stack

Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
  
Machine Learning
- Python
- Flask
- Scikit-learn
- Decision Tree
 
Database
- PostgreSQL
  
Frontend
- React
- JavaScript
- CSS
  
Tools
- IntelliJ IDEA
- VS Code
- Git
- GitHub

📁 Project Structure
```
AegisRoute/
│
├── frontend/
│
├── ml-training/
│   ├── gateway_dataset.csv
│   ├── train_model.py
│   ├── gateway_model.pkl
│   └── predict.py
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/aegisroute/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── entity/
│   │   │       ├── ml/
│   │   │       ├── repository/
│   │   │       ├── routing/
│   │   │       └── service/
│   │   │
│   │   └── resources/
│   │
│   └── test/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
└── .gitignore
```
🎯 Project Objective

The main objective of AegisRoute is to provide an intelligent routing layer that can select a suitable AI gateway based on real-time gateway conditions rather than relying on a fixed gateway.
The project focuses on:
- Intelligent gateway selection
- Adaptive routing
- Fault tolerance
- Gateway monitoring
- Performance awareness
- ML-based decision making
  
🔮 Future Enhancements
- 🔄 Retry mechanism
- ⚖️ Advanced load balancing
- 🌐 Direct integration with AI provider APIs
- 📈 Advanced analytics
- 🔐 Secure API-key management
- 🐳 Docker deployment
- ☁️ Cloud deployment
- 📡 Real-time monitoring
