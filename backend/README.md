# Destek Support Backend

This is the backend service for the Destek Support application, which provides customer support functionality for companies like Atasun Optik, BIM, and Gratis.

## Prerequisites

- Java 17 or higher
- Maven
- MySQL 8.0 or higher
- Redis (optional, for caching)

## Setup

### Database Setup

1. Install MySQL if not already installed
2. Create a MySQL database:
   ```sql
   CREATE DATABASE destek_support;
   ```
3. Configure your MySQL username and password in `application.properties` or `application-dev.properties` file

### Building the Application

```bash
mvn clean install
```

## Running the Application

### Using Development Profile with Sample Data

To run the application with the development profile and load sample data:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

This will:
- Create all necessary tables
- Load sample data with Turkish companies (Atasun Optik, BIM, Gratis)
- Configure the application for development

### Using Production Profile

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Sample Data

The application includes sample data for testing purposes in the `src/main/resources/data-sample.sql` file. This includes:

- Companies: Atasun Optik, BIM, Gratis, and others
- Users: Super Admin, Admins, Managers, and Customers
- Return Requests and Complaints

All sample users have the password: `password123`

## API Documentation

Once the application is running, you can access the Swagger UI documentation at:

```
http://localhost:8080/api/swagger-ui.html
```

## Company Structure

The system is designed to support multiple companies, each with their own set of users:

- **Atasun Optik**: Eyewear retailer
- **BIM**: Discount grocery chain
- **Gratis**: Personal care and cosmetics retailer

Each company has administrators, managers, and customers with appropriate permissions.

## User Types

- **Super Admin**: System-wide administrator with full access
- **Admin**: Company administrator with company-wide access
- **Manager**: Handles day-to-day operations and customer issues
- **Customer**: End-users who can submit requests and complaints 