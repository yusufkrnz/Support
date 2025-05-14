# Sample Data for Support Application

This directory contains a SQL script (`data-sample.sql`) that can be used to populate your database with sample data for testing and development purposes.

## What's Included

The sample data includes:

1. **Companies** - 6 sample companies (5 active, 1 inactive) with different subscription tiers
2. **Users** - Different types of users with inheritance structure:
   - 1 Super Admin (system-wide)
   - 5 Admins (one for each active company)
   - 8 Managers (distributed across companies)
   - 10 Customers (distributed across companies)
3. **Return Requests** - 10 sample return requests in various statuses
4. **Complaints** - 10 sample complaints with different priorities and statuses

## How to Use

### Option 1: Load data manually

1. Start your application with an empty database
2. Connect to your database using a SQL client
3. Execute the `data-sample.sql` script

### Option 2: Configure Spring Boot to load data at startup

Add the following to your `application.properties` or `application.yml` file:

```properties
# For application.properties
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:data-sample.sql
```

or 

```yaml
# For application.yml
spring:
  sql:
    init:
      mode: always
      data-locations: classpath:data-sample.sql
```

> **Note**: Using this method will attempt to load the sample data every time the application starts. You may want to use a profile to control when this happens:

```properties
# application-dev.properties
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:data-sample.sql
```

And then start your application with the dev profile:

```
java -jar your-app.jar --spring.profiles.active=dev
```

## Credentials

All sample users have the same password hash (`$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q`). If you're using BCrypt, this corresponds to the password `password123`.

## Data Relationships

- Each user (except the SuperAdmin) belongs to a Company
- Each Customer can have multiple ReturnRequests
- Each Customer can have multiple Complaints
- Managers can be assigned to handle Complaints
- Companies have hierarchical user structure (Admins manage companies, Managers handle operational tasks)

## Data Model Diagram

```
┌─────────────┐       ┌─────────────┐
│   Company   │◄──────┤   BaseUser  │
└─────────────┘       └─────┬───────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
┌──────▼───────┐    ┌───────▼────────┐    ┌──────▼───────┐
│    Admin     │    │     Manager    │    │   Customer   │
└──────────────┘    └────────────────┘    └──────┬───────┘
                                                 │
                     ┌─────────────────────┬─────┘
                     │                     │
              ┌──────▼───────┐     ┌──────▼───────┐
              │ ReturnRequest│     │   Complaint  │
              └──────────────┘     └──────────────┘
```

## Environment-Specific Considerations

### Production
Do NOT use this sample data in production environments. It contains non-secure passwords and fictional information.

### Development/Testing
This data is perfect for:
- Development testing
- UI development
- Feature demonstrations
- QA testing scenarios

## Employee Turnover Scenario Testing

The sample data includes users in different roles to test employee turnover scenarios:

1. **Manager Reassignment**: You can simulate a manager leaving by setting their active status to false and reassigning their customers to other managers.

2. **Admin Replacement**: Practice replacing a company admin by deactivating the current admin and creating a new one.

3. **Customer Transfer**: Test transferring customers between companies (in acquisition scenarios).

4. **Company Deactivation**: Try deactivating a company and observe how it affects associated users and their data. 