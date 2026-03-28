# pgAdmin Database Setup Guide

This guide provides step-by-step instructions on how to create and configure the PostgreSQL database for the NESAm application using pgAdmin.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Accessing pgAdmin](#accessing-pgadmin)
3. [Adding PostgreSQL Server Connection](#adding-postgresql-server-connection)
4. [Creating the Database](#creating-the-database)
5. [Running Database Schema Scripts](#running-database-schema-scripts)
6. [Verifying the Database Setup](#verifying-the-database-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure the following:

✅ **Docker is running** on your machine  
✅ **PostgreSQL and pgAdmin containers are running**

To start the containers:
```bash
# Navigate to the API folder
cd nesam-api/nesam

# Start Docker containers
docker-compose up -d
```

Verify containers are running:
```bash
docker ps
```

You should see:
- `postgres_db` (PostgreSQL 16 container)
- `pgadmin` (pgAdmin 4 container)

---

## Accessing pgAdmin

### Step 1: Open pgAdmin in Your Browser

Navigate to: **http://localhost:8080**

### Step 2: Login to pgAdmin

Use the default credentials:
- **Email:** `admin@example.com`
- **Password:** `secretpassword`

![pgAdmin Login Screen](https://i.imgur.com/placeholder.png)

> **Note:** These credentials are defined in `docker-compose.yml` and can be changed if needed.

---

## Adding PostgreSQL Server Connection

Once logged into pgAdmin, you need to register the PostgreSQL server.

### Step 1: Register a New Server

1. In the **Browser** panel (left sidebar), right-click on **Servers**
2. Select **Register** → **Server...**

![Register Server](https://i.imgur.com/placeholder.png)

### Step 2: Configure General Settings

In the **Register - Server** dialog:

**General Tab:**
- **Name:** `NESAm PostgreSQL Server` (or any descriptive name)

![General Tab](https://i.imgur.com/placeholder.png)

### Step 3: Configure Connection Settings

**Connection Tab:**
- **Host name/address:** `postgres_db` (Docker container name)
  - *Alternative:* Use `localhost` if connecting from outside Docker
- **Port:** `5432`
- **Maintenance database:** `postgres` (default)
- **Username:** `postgres`
- **Password:** `testpass` (from `docker-test-password.txt`)
- ☑️ **Save password** (optional, for convenience)

![Connection Tab](https://i.imgur.com/placeholder.png)

> **Important:** When connecting from pgAdmin running in Docker to PostgreSQL in Docker, use the container name `postgres_db` as the hostname. Docker's internal networking will resolve this.

### Step 4: Save the Server Configuration

Click **Save** to register the server.

You should now see **NESAm PostgreSQL Server** in the left sidebar under **Servers**.

---

## Creating the Database

### Step 1: Navigate to Databases

1. Expand **Servers** → **NESAm PostgreSQL Server** in the left sidebar
2. Right-click on **Databases**
3. Select **Create** → **Database...**

![Create Database](https://i.imgur.com/placeholder.png)

### Step 2: Configure Database Settings

In the **Create - Database** dialog:

**General Tab:**
- **Database:** `nesam_db`
- **Owner:** `postgres`
- **Comment:** `NESAm Application Database` (optional)

![Database General Tab](https://i.imgur.com/placeholder.png)

**Definition Tab (optional):**
- **Encoding:** `UTF8`
- **Template:** `template0`
- **Collation:** `en_US.utf8`
- **Character type:** `en_US.utf8`

![Database Definition Tab](https://i.imgur.com/placeholder.png)

### Step 3: Create the Database

Click **Save** to create the database.

The database **nesam_db** should now appear under **Databases** in the left sidebar.

---

## Running Database Schema Scripts

Now that the database exists, you need to populate it with tables, constraints, and initial data.

### Step 1: Locate the SQL Script

The schema script is located at:
```
nesam-api/nesam/docs/db_scripts_v1.6_postgres.sql
```

> **Important:** Use `db_scripts_v1.6_postgres.sql` (PostgreSQL-specific), **NOT** `db_scripts_v1.5.sql` (MySQL format).

### Step 2: Open Query Tool

1. In pgAdmin, expand **Servers** → **NESAm PostgreSQL Server** → **Databases**
2. Click on the **nesam_db** database
3. Click the **Query Tool** button in the toolbar (or press **Alt + Shift + Q**)

![Query Tool](https://i.imgur.com/placeholder.png)

### Step 3: Load the SQL Script

1. In the Query Tool, click the **Open File** icon (folder icon)
2. Navigate to `nesam-api/nesam/docs/`
3. Select `db_scripts_v1.6_postgres.sql`
4. Click **Open**

![Load SQL Script](https://i.imgur.com/placeholder.png)

### Step 4: Execute the Script

1. Review the SQL script in the editor (optional)
2. Click the **Execute/Refresh** button (▶️ icon) or press **F5**
3. Wait for the script to complete

![Execute Script](https://i.imgur.com/placeholder.png)

### Step 5: Check Execution Results

In the **Messages** tab at the bottom, you should see:
```
Query returned successfully in XXX msec.
```

If there are errors, review the error messages and ensure:
- You're using the correct PostgreSQL script (v1.6)
- The database is selected
- You have proper permissions

---

## Verifying the Database Setup

### Step 1: Verify Tables

1. In the Browser panel, navigate to:
   **Servers** → **NESAm PostgreSQL Server** → **Databases** → **example** → **Schemas** → **public** → **Tables**

2. Right-click on **Tables** and select **Refresh**

You should see the following tables:
- ✅ `user_profiles`
- ✅ `memberships`
- ✅ `nominees`
- ✅ `transaction_ledger`
- ✅ `notification_logs`
- ✅ `master_fee_slabs`
- ✅ `master_dfc_rates`
- ✅ `system_parameters`
- ✅ `admin_users`
- ✅ `audit_logs`

![Tables List](https://i.imgur.com/placeholder.png)

### Step 2: Verify Data Types (Enums)

Navigate to:
**Schemas** → **public** → **Types**

You should see custom PostgreSQL enums:
- ✅ `membership_status`
- ✅ `gender_type`
- ✅ `membership_category`
- ✅ `transaction_type`
- ✅ `transaction_status`
- ✅ `notification_intent`
- ✅ `notification_channel`

### Step 3: Run a Test Query

In the Query Tool, run:
```sql
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';
```

You should get a count of **10 tables** (or the expected number based on your schema).

### Step 4: Check Seed Data (if applicable)

If your script includes seed data, verify it:
```sql
-- Check system parameters
SELECT * FROM system_parameters;

-- Check fee slabs
SELECT * FROM master_fee_slabs;

-- Check DFC rates
SELECT * FROM master_dfc_rates;
```

---

## Database Connection String

Once the database is set up, your Spring Boot application will connect using:

**JDBC URL:**
```
jdbc:postgresql://localhost:5432/nesam_db
```

**Configuration (in `.env` file):**
```env
DB_URL=jdbc:postgresql://localhost:5432/nesam_db
DB_USERNAME=postgres
DB_PASSWORD=Kumarini@249
```

> **Security Note:** Ensure your `.env` file is listed in `.gitignore` to prevent committing sensitive credentials.

---

## Troubleshooting

### Issue 1: Cannot Connect to PostgreSQL Server

**Error:** `connection to server at "postgres_db", port 5432 failed`

**Solutions:**
- ✅ Verify Docker containers are running: `docker ps`
- ✅ Restart containers: `docker-compose down && docker-compose up -d`
- ✅ Try using `localhost` instead of `postgres_db` if connecting from host machine
- ✅ Check port 5432 is not blocked by firewall

### Issue 2: Authentication Failed

**Error:** `FATAL: password authentication failed for user "postgres"`

**Solutions:**
- ✅ Verify password is `testpass` (from `docker-test-password.txt`)
- ✅ Check `.env` file has correct `DB_PASSWORD`
- ✅ Recreate containers: `docker-compose down -v && docker-compose up -d`

### Issue 3: Database "example" Already Exists

**Error:** `ERROR: database "example" already exists`

**Solutions:**
- ✅ Database is already created - skip creation step
- ✅ To recreate: Drop the database first (right-click → Delete/Drop)
- ✅ Or use a different database name

### Issue 4: SQL Script Syntax Errors

**Error:** `ERROR: syntax error at or near...`

**Solutions:**
- ✅ Ensure you're using `db_scripts_v1.6_postgres.sql` (PostgreSQL format)
- ✅ Do NOT use `db_scripts_v1.5.sql` (MySQL format)
- ✅ Verify you're connected to the `example` database before running the script

### Issue 5: Permission Denied

**Error:** `ERROR: permission denied for schema public`

**Solutions:**
- ✅ Ensure you're logged in as `postgres` user
- ✅ Grant necessary permissions:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE example TO postgres;
  GRANT ALL ON SCHEMA public TO postgres;
  ```

### Issue 6: pgAdmin Shows Empty Database

**Solutions:**
- ✅ Refresh the database: Right-click on **Databases** → **Refresh**
- ✅ Expand **Schemas** → **public** → **Tables**
- ✅ Ensure script executed successfully (check Messages tab)

---

## Additional Resources

### Database Schema Documentation
For detailed information about tables, relationships, and fields:
📄 `architecture-docs/DATABASE_SCHEMA.md`

### Environment Variables Documentation
For configuration details:
📄 `Governance Docs/ENVIRONMENT_VARIABLES.md`

### Docker Compose Configuration
For container setup:
📄 `nesam-api/nesam/docker-compose.yml`

### Application Setup Guide
For complete application setup:
📄 `Docs/SETUP_GUIDE.md`

---

## Summary

You have successfully:
✅ Accessed pgAdmin  
✅ Registered the PostgreSQL server  
✅ Created the `example` database  
✅ Executed the schema scripts  
✅ Verified the database setup  

Your NESAm application database is now ready for use! 🎉

---

## Next Steps

1. **Start the Spring Boot API:**
   ```bash
   cd nesam-api/nesam
   ./mvnw spring-boot:run
   ```

2. **Verify API connection:**
   - Visit: http://localhost:9090/swagger-ui/index.html
   - Check database connectivity in application logs

3. **Start the React frontend:**
   ```bash
   cd reactjs-starter
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173

---

**Need Help?** Check the troubleshooting section above or refer to the main README.md for additional guidance.
