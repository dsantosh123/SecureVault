# SecureVault Database Setup

## PostgreSQL Installation & Configuration

### 1. Install PostgreSQL
```bash
# macOS (Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

### 2. Start PostgreSQL Service
```bash
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo service postgresql start

# Windows (should auto-start)
```

### 3. Create Database
```bash
psql -U postgres

# In psql terminal:
CREATE DATABASE securevault;
CREATE USER securevault_user WITH PASSWORD 'securevault_pass123';
ALTER ROLE securevault_user SET client_encoding TO 'utf8';
ALTER ROLE securevault_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE securevault_user SET default_transaction_deferrable TO on;
ALTER ROLE securevault_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE securevault TO securevault_user;
\q
```

### 4. Update application.yml
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/securevault
    username: securevault_user
    password: securevault_pass123
```

### 5. Run Spring Boot Application
```bash
mvn spring-boot:run
```

Spring Hibernate will automatically create tables from entities.

## Tables Created
- users
- assets
- nominees
- blockchain_logs
- plans (optional for future)
