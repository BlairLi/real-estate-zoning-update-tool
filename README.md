# Real Estate Zoning Update Tool

A full-stack web application for managing zoning updates for real estate parcels. Users can select parcels on a map, assign zoning types, and submit updates while maintaining an audit log of all changes.

## Project Structure

```
real-estate-zoning-update-tool/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/         # Map component with Leaflet/Mapbox
│   │   │   ├── ZoningForm/  # Zoning type selection form
│   │   │   ├── StatsPanel/  # Optional statistics display
│   │   │   └── common/      # Shared components
│   │   ├── services/        # API service calls
│   │   ├── utils/          # Helper functions
│   │   └── styles/         # CSS files
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   ├── controller/     # REST endpoints
│   │   ├── model/         # Data models
│   │   ├── repository/    # Database repositories
│   │   ├── service/       # Business logic
│   │   └── config/        # Configuration
│   └── src/main/resources/
│       └── application.properties
└── README.md
```

## Technology Stack

### Frontend
- React with TypeScript
- Leaflet/Mapbox for map visualization
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Spring Boot (Java)
- PostgreSQL for main database
- JPA/Hibernate for ORM
- Transaction management for atomic operations

## Features

- Interactive map display of real estate parcels
- Single/multiple parcel selection
- Zoning type updates
- Audit logging
- Optional statistics display
- Transaction management for data consistency

## Database Connection

```
postgres://real_estate:ZT9b0qv6iQ@108.61.159.122:13432/postgres
Table: real_estate_zoning
```

## Implementation Strategy

1. **Phase 1 - Setup**
   - Initialize React and Spring Boot projects
   - Set up database connection
   - Configure map library

2. **Phase 2 - Core Features**
   - Implement map display
   - Add parcel selection
   - Create zoning update form
   - Set up basic API endpoints

3. **Phase 3 - Backend Logic**
   - Implement transaction management
   - Add audit logging
   - Handle concurrent updates

4. **Phase 4 - Polish**
   - Add error handling
   - Implement statistics
   - Add loading states
   - Improve UI/UX

## Key Considerations

- Transaction Management:
  - Use Spring's `@Transactional` for atomic operations
  - Ensure both parcel update and audit log are in same transaction
- Error Handling:
  - Frontend validation
  - Backend exception handling
  - User-friendly error messages
- Performance:
  - Optimize GeoJSON loading
  - Implement pagination if needed
  - Cache frequently accessed data

## Getting Started

(To be added after project setup)

## License

MIT
