# Real Estate Zoning Update Tool

A full-stack web application for managing zoning updates for real estate parcels. Users can interactively select parcels on a map, assign new zoning types, and submit updates, all while maintaining an audit log of changes.

---  

## 🌐 Deployed Demo

👉 [https://real-estate-zoning-update-tool.vercel.app](https://real-estate-zoning-update-tool.vercel.app)  
_Backend hosted on Render: [https://real-estate-zoning-update-tool-backend.onrender.com](https://real-estate-zoning-update-tool-backend.onrender.com)_

---

## 🚀 How to Run the System

### 1. **Clone the Repository**


```bash
git clone https://github.com/BlairLi/real-estate-zoning-update-tool.git
cd real-estate-zoning-update-tool
```

### 2. **Backend Setup (Spring Boot + PostgreSQL)**
```bash
cd real-estate-zoning-update-tool_backend

# Make sure you have Java 17+ and Maven installed
./mvnw clean install

# Configure database access
# src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://<your-host>.render.com/<your-db>
spring.datasource.username=<your-db-username>
spring.datasource.password=<your-db-password>

# Run the backend
./mvnw spring-boot:run
```

### 3. **Frontend Setup (React)**
```bash
cd real-estate-zoning-update-tool

# Install dependencies
npm install

# Create a `.env.local` file
touch .env.local

```
Paste the following into <mark>.env.local</mark>
```env
REACT_APP_API_URL=https://real-estate-zoning-update-tool-backend.onrender.com
```
Then run the server:
```bash
npm run start
```

## 💡 Assumptions
* When updating the zoning type for parcels, users are allowed to update current zoning type
* Initial data load from the backend may take up to 1–2 minutes due to cold start on Render.

## 📂 Related Repositories
* Frontend: [real-estate-zoning-update-tool](https://github.com/BlairLi/real-estate-zoning-update-tool)
* Backend: [real-estate-zoning-update-tool_backend](https://github.com/BlairLi/real-estate-zoning-update-tool_backend)
