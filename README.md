# RescueHub: A Web-based Animal Rescue Operations and Information Management System

[![University](https://img.shields.io/badge/University-University%20of%20San%20Carlos-green.svg)](https://www.usc.edu.ph/)
[![Department](https://img.shields.io/badge/Department-DCISM-blue.svg)]()
[![Course](https://img.shields.io/badge/Course-Information%20Management%20II-orange.svg)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20Prisma%20%7C%20MySQL-purple.svg)]()

> **An Information Management II Proposal & Academic Project**  
> Presented to the Faculty of the Department of Computer, Information Sciences and Mathematics  
> **University of San Carlos — Talamban Campus, Cebu City**  
> **Instructor:** Mr. Edwin Bartlett  
> **Date:** July 2026  

---

## 👥 Authors & Project Team

| Student Author | Role / Contributions |
| :--- | :--- |
| **Garado, Al Philippe Abrenzosa** | Full-Stack Development, System Architecture & Lead Developer |
| **Gerson, Christian Jake** | Backend API & Database Normalization (Prisma/MySQL) |
| **Piczon, Jan Gethree Abrenzosa** | Requirements Engineering, Documentation & SRS |
| **Saya-ang, Ian Dane** | UI/UX Design & Dashboard Analytics |
| **Young, Jon Michael Quimiguing** | Testing, Quality Assurance & Security Audit |

---

## 📖 Table of Contents
1. [Executive Summary & Rationale](#-executive-summary--rationale)
2. [General & Specific Objectives](#-general--specific-objectives)
3. [System Architecture & Tech Stack](#-system-architecture--tech-stack)
4. [Core Features & Functional Modules](#-core-features--functional-modules)
5. [Database Schema & ERD](#-database-schema--erd)
6. [SQL Benchmark Queries (Paper Section 2.4)](#-sql-benchmark-queries-paper-section-24)
7. [Access & Security Controls (RBAC)](#-access--security-controls-rbac)
8. [Installation & Setup Guide](#-installation--setup-guide)
9. [Appendices & References](#-appendices--references)

---

## 📌 Executive Summary & Rationale

Animal welfare organizations and stray shelters frequently operate under highly dynamic field conditions. Field rescuers, veterinarians, and volunteer coordinators are constantly in transit, responding to emergency reports of injured, stray, or distressed animals. However, operational efficiency is severely hampered by critical bottlenecks:

* 🚨 **Information Disconnect:** Rescuers in the field lack real-time access to active incident locations, contact details of reporting citizens, and historical records of animals previously rescued in the area, leading to delayed dispatches.
* 🏠 **Unmonitored Shelter Capacities:** Intake staff lack a centralized mechanism to monitor kennel availability across different shelter locations, which causes unbalanced distributions and shelter overcrowding.
* 🩺 **Fragmented Health Tracking:** Veterinary diagnosis, medication logs, and treatment plans are recorded in paper-based logs or localized spreadsheets, rendering historical medical data inaccessible when adjusting rehabilitation plans.

**RescueHub** solves these challenges by providing a centralized, web-based platform that unifies public incident reporting, dispatch management, real-time shelter capacity allocation, veterinary treatment tracking, and append-only activity auditing.

---

## 🎯 General & Specific Objectives

### General Objective
To develop and deploy **RescueHub**, a web-based Animal Rescue Operations and Information Management Platform that centralizes public incident reporting, rescue case dispatching, shelter capacity allocation, and veterinary treatment history tracking for animal welfare organizations.

### Specific Objectives & Success Criteria
* ⏱️ **Reduce Response Lag:** Decrease the time elapsed between public incident reporting and volunteer team dispatch by **50%** through automated notifications.
* 📄 **Minimize Administrative Overhead:** Reduce home office administration and paper log maintenance costs by **20%** by digitizing case sheets and medical logs.
* 📍 **Eliminate Duplicate Dispatches:** Reduce double dispatches to the same location/animal report by **40%** through live coordinate mapping and incident status tracking.
* 📋 **Lighten Field Cargo:** Decrease physical documentation carried by field responders by **75%** without compromising reporting compliance.
* 💊 **Enhance Medical Accuracy:** Ensure **100%** of admitted animals have their diagnoses, medication dosages, and veterinarian identities accurately logged and easily retrievable in the field.

---

## 🛠️ System Architecture & Tech Stack

```mermaid
graph TD
    A["Public Citizen / Field Rescuer / Vet / Dispatcher"] -->|HTTP/REST| B["Vite + React 18 Frontend UI"]
    B -->|Zustand State & TanStack Router| C["Express.js REST API Server"]
    C -->|JWT Auth & RBAC Middleware| D["Prisma ORM"]
    D -->|SQL Queries| E[("MySQL Relational Database")]
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite, TanStack Router |
| **Styling & Components** | TailwindCSS, Shadcn UI, Lucide Icons, Sonner Toasts |
| **State Management** | Zustand (Persistent Local & API Sync Store) |
| **Backend Server** | Node.js, Express.js (TypeScript) |
| **ORM & Database** | Prisma ORM, MySQL 8.0 Database |
| **Authentication & Security** | JSON Web Tokens (JWT), bcryptjs, Express RBAC Middleware |

---

## ✨ Core Features & Functional Modules

### 1. Citizen Incident Reporting Portal (`/report-incident`)
* Publicly accessible form allowing citizens to report distressed animals.
* Captures reporter details, species, estimated severity (`Low`, `Medium`, `High`, `Critical`), location, landmark descriptions, and photo uploads.
* Supports anonymous reporting option for user privacy.

### 2. Dispatch & Case Management Console (`/rescue-cases`)
* Verification queue for dispatchers to promote citizen reports into formal Rescue Cases (`RC-2026-XXXX`).
* Sequential status lifecycle enforcement: `REPORTED` ➔ `ASSIGNED` ➔ `EN_ROUTE` ➔ `RESCUED` ➔ `SHELTER_INTAKE` ➔ `UNDER_TREATMENT` ➔ `RECOVERED` ➔ `ADOPTED`/`RELEASED`.
* Dynamic **Rescue Case Journey Timeline** modal displaying an append-only audit trail of every update, assignment, and status transition.

### 3. Digital Animals Register & Photo Management (`/animals`)
* Centralized registry of all admitted animals detailing species, breed, sex, age estimate, weight, physical condition, and shelter assignment.
* Integrated base64 photo preview and file upload pipeline indexed directly to MySQL records.

### 4. Veterinary Medical Care Subsystem (`/treatments`)
* Dedicated clinic view for veterinarians to log diagnoses, surgical treatments, administered prescriptions, and follow-up evaluation dates.

### 5. Real-Time Shelter Capacity Allocation (`/shelters`)
* Live monitoring of occupied versus total kennel capacity across shelter facilities.
* Automatic warning badges triggered when bed occupancy reaches ≥90%.

### 6. Relational Dashboard Analytics & Performance Reports (`/reports`)
* Primary operational dashboard featuring 8 KPI cards (Active Dispatches, Emergency Cases, Under Care, Available Shelters, Highest Occupancy Shelter).
* 5-tab performance reporting panel providing aggregated tables for Species Intake, Shelter Occupancies, Case Status Distribution, Vet Workloads, and Adoption Outcomes.

---

## 🗄️ Database Schema & ERD

The database schema is fully normalized up to **3rd Normal Form (3NF)** in MySQL via Prisma ORM:

```
+------------------+       +-------------------+       +--------------------+
|  Incident_Report | ----> |       Ticket      | ----> |       Animal       |
| (Citizen Intake) | 1:1   |   (Rescue Case)   | 1:1   |  (Admitted Record) |
+------------------+       +-------------------+       +--------------------+
                                     |                           |
                                     v                           v
                           +-------------------+       +--------------------+
                           |        Team       |       |  Animal_Treatment  |
                           | (Assigned Rescuer)|       |  (Veterinary Care) |
                           +-------------------+       +--------------------+
```

---

## 📊 SQL Benchmark Queries (Paper Section 2.4)

### Query 1: Active Emergency & Critical Rescue Cases
```sql
SELECT 
    t.id AS case_id,
    CONCAT('RC-2026-', LPAD(t.id, 4, '0')) AS case_number,
    t.priority AS severity,
    t.status AS case_status,
    ir.location,
    CONCAT(a.first_name, ' ', a.last_name) AS assigned_rescuer,
    s.shelter_name AS target_shelter,
    t.created_at AS dispatched_at
FROM Ticket t
LEFT JOIN Incident_Report ir ON t.incident_report_id = ir.id
LEFT JOIN Team tm ON t.current_assigned_team_id = tm.id
LEFT JOIN Agent a ON tm.manager_agent_id = a.id
LEFT JOIN Animal an ON an.ticket_id = t.id
LEFT JOIN Shelter s ON an.shelter_id = s.id
WHERE t.priority IN ('Critical', 'High')
  AND t.status NOT IN ('CLOSED', 'ADOPTED', 'RELEASED')
ORDER BY t.created_at DESC;
```
* **Sample Output:**
| case_id | case_number | severity | case_status | location | assigned_rescuer | target_shelter | dispatched_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `2` | `RC-2026-0002` | `Critical` | `UNDER_TREATMENT` | Highway 101, Mile Marker 45 | Admin User | Green Valley Sanctuary | 2026-07-15 08:30:00 |
| `6` | `RC-2026-0006` | `High` | `ASSIGNED` | 123 Talamban Rd, Cebu | Alice Green | Northside Animal Refuge | 2026-07-17 10:15:00 |

---

### Query 2: Live Shelter Bed Capacity Utilization
```sql
SELECT 
    s.id AS shelter_id,
    s.shelter_name,
    s.capacity AS total_beds,
    COUNT(an.id) AS occupied_beds,
    (s.capacity - COUNT(an.id)) AS available_beds,
    ROUND((COUNT(an.id) / s.capacity) * 100, 1) AS occupancy_percentage
FROM Shelter s
LEFT JOIN Animal an ON s.id = an.shelter_id 
    AND an.status NOT IN ('Adopted', 'Released')
GROUP BY s.id, s.shelter_name, s.capacity
ORDER BY occupancy_percentage DESC;
```
* **Sample Output:**
| shelter_id | shelter_name | total_beds | occupied_beds | available_beds | occupancy_percentage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | Safe Haven Shelter | 25 | 22 | 3 | 88.0% |
| `2` | Green Valley Sanctuary | 30 | 18 | 12 | 60.0% |
| `3` | Northside Animal Refuge | 20 | 8 | 12 | 40.0% |

---

### Query 3: Species Intake Distribution Report
```sql
SELECT 
    sp.species_name,
    COUNT(a.id) AS total_admitted,
    SUM(CASE WHEN a.status = 'Intake' THEN 1 ELSE 0 END) AS in_intake,
    SUM(CASE WHEN a.status = 'Under Treatment' THEN 1 ELSE 0 END) AS under_care,
    SUM(CASE WHEN a.status = 'Adopted' THEN 1 ELSE 0 END) AS adopted_out,
    SUM(CASE WHEN a.status = 'Released' THEN 1 ELSE 0 END) AS released_wild
FROM Species sp
LEFT JOIN Animal a ON sp.id = a.species_id
GROUP BY sp.id, sp.species_name
ORDER BY total_admitted DESC;
```
* **Sample Output:**
| species_name | total_admitted | in_intake | under_care | adopted_out | released_wild |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Dog | 45 | 12 | 8 | 20 | 5 |
| Cat | 32 | 9 | 5 | 15 | 3 |
| Bird | 8 | 1 | 2 | 0 | 5 |

---

### Query 4: Medical Treatment Workload by Veterinarian
```sql
SELECT 
    CONCAT(ag.first_name, ' ', ag.last_name) AS veterinarian_name,
    COUNT(at.id) AS total_treatments_logged,
    COUNT(DISTINCT at.animal_id) AS unique_patients_treated,
    SUM(CASE WHEN at.followup_date >= CURDATE() THEN 1 ELSE 0 END) AS pending_followups
FROM Agent ag
INNER JOIN Role r ON ag.role_id = r.id
LEFT JOIN Animal_Treatment at ON ag.id = at.vet_agent_id
WHERE r.role_name IN ('Veterinarian', 'Admin')
GROUP BY ag.id, ag.first_name, ag.last_name
ORDER BY total_treatments_logged DESC;
```
* **Sample Output:**
| veterinarian_name | total_treatments_logged | unique_patients_treated | pending_followups |
| :--- | :--- | :--- | :--- |
| Dr. Alice Vance | 18 | 14 | 3 |
| Dr. Marcus Wright | 12 | 10 | 1 |

---

### Query 5: Full Rescue Journey Audit Logs for Specific Case
```sql
SELECT 
    al.id AS log_id,
    al.timestamp,
    al.entity_type,
    al.entity_id,
    al.action,
    al.user AS performed_by
FROM ActivityLog al
WHERE (al.entity_type = 'RescueCase' AND al.entity_id = 2)
   OR (al.entity_type = 'IncidentReport' AND al.entity_id = 1)
   OR (al.entity_type = 'Animal' AND al.entity_id = 2)
ORDER BY al.timestamp ASC;
```
* **Sample Output:**
| log_id | timestamp | entity_type | entity_id | action | performed_by |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `101` | 2026-07-15 08:00:00 | IncidentReport | 1 | Incident report submitted by Citizen | Citizen Reporter |
| `104` | 2026-07-15 08:15:00 | RescueCase | 2 | Case RC-2026-0002 created & assigned | Dispatcher |
| `108` | 2026-07-15 09:30:00 | Animal | 2 | Animal 'Dino' admitted to shelter | Rescuer |
| `112` | 2026-07-15 11:00:00 | Treatment | 1 | Antibiotic treatment & fracture cast applied | Veterinarian |

---

### Query 6: Citizen Incident Queue Pending Verification
```sql
SELECT 
    ir.id AS incident_id,
    ir.reporter_name,
    ir.contact_number,
    sp.species_name,
    ir.severity,
    ir.location,
    ir.description,
    ir.created_at AS reported_at
FROM Incident_Report ir
INNER JOIN Species sp ON ir.species_id = sp.id
WHERE ir.status = 'Pending'
ORDER BY 
    CASE ir.severity 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        WHEN 'Low' THEN 4 
    END,
    ir.created_at ASC;
```
* **Sample Output:**
| incident_id | reporter_name | contact_number | species_name | severity | location | reported_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `5` | John Smith | 09171234567 | Dog | Critical | Talamban Highway | 2026-07-17 09:30:00 |
| `6` | Anonymous | N/A | Cat | Medium | IT Park Bldg 2 | 2026-07-17 10:15:00 |

---

## 🔒 Access & Security Controls (RBAC)

### User Role Permissions Matrix

| Permission / Function | Guest (Public) | Rescuer | Veterinarian | Dispatcher | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Submit Incident Report** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Rescue Cases Queue** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Update Case Status & Notes** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Promote Incident / Assign Responder** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **View & Register Animal Profiles** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Log Veterinary Medical Care** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Manage Shelters & Rescuers Roster** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Delete Records Across System** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **View Full Activity Audit Logs** | ❌ | ❌ | ❌ | ❌ | ✅ |

### Database Privileges (MySQL DCL)
```sql
-- 1. Create Application Database User
CREATE USER 'rescuehub_app'@'localhost' IDENTIFIED BY 'SecureAppPass2026!';
GRANT SELECT, INSERT, UPDATE, DELETE ON rescuehub_db.* TO 'rescuehub_app'@'localhost';

-- 2. Create Read-Only Reporting User for Analytics
CREATE USER 'rescuehub_analytics'@'localhost' IDENTIFIED BY 'ReadOnlyAnalytics2026!';
GRANT SELECT ON rescuehub_db.* TO 'rescuehub_analytics'@'localhost';

FLUSH PRIVILEGES;
```

---

## ⚙️ Installation & Local Setup Guide

### Prerequisites
* **Node.js** v18.0 or higher
* **MySQL Server** 8.0 or higher
* **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/Hubrisdog/rescue-hub-im2-system.git
cd rescue-hub-im2-system
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/rescuehub_db"
JWT_SECRET="rescuehub_secret_key_2026"
```

### 3. Install Dependencies & Push Database Schema
```bash
# Install root/frontend dependencies
npm install

# Install server dependencies
cd server
npm install

# Push Prisma schema to MySQL
npx prisma db push

# Seed database with benchmark records
npm run prisma:seed
```

### 4. Run Development Servers
```bash
# In server directory:
npm run dev

# In a new terminal (root directory):
npm run dev
```

Open your browser at `http://localhost:5173` to view **RescueHub**!

---

## 📄 License & Academic Attribution
This project was developed for academic evaluation under **Information Management II (IM2)** at the **University of San Carlos (USC)**. All rights reserved by the student authors and faculty instructors.
