# RescueHub: A Web-based Animal Rescue Operations

### An Information Management II Proposal

**Presented to the Faculty of the**  
**Department of Computer, Information Sciences and Mathematics**  
**University of San Carlos**  

**In Partial Fulfillment**  
**of the Requirements for the**  
**INFORMATION MANAGEMENT II**  

**By**  
Garado, Al Philippe Abrenzosa  
Gerson, Christian Jake  
Piczon, Jan Gethree Abrenzosa  
Saya-ang, Ian Dane  
Young, Jon Michael Quimiguing  

**Edwin Bartlett**  
Instructor  

**July 2026**  

<div style="page-break-after: always;"></div>

---

## Table of Contents

* **Table of Contents** .................................................................................................... **ii**
* **CHAPTER 1. INTRODUCTION** .................................................................................... **1**
  * **1.1 Rationale** ...................................................................................................... **1**
  * **1.2 Objectives** .................................................................................................... **2**
    * **1.2.1 General Objectives** ................................................................................ **2**
    * **1.2.3 Specific Objectives** ................................................................................ **2**
  * **1.3 Scope and Limitation** .................................................................................... **3**
    * **1.3.1 Scope** .................................................................................................. **3**
    * **1.3.2 Limitation** ............................................................................................. **3**
* **CHAPTER 2. ANALYSIS AND DESIGN** ...................................................................... **4**
  * **2.1 Business Process** .......................................................................................... **4**
  * **2.2 Users** ............................................................................................................ **4**
  * **2.3 ERD** .............................................................................................................. **5**
  * **2.4 SQL Queries Used** ........................................................................................ **6**
  * **2.5 Functional Requirements** ............................................................................ **10**
  * **2.6 Access and Security Controls** .................................................----------------- **11**
  * **2.7 Project Schedule (Use Gantt Chart)** ............................................................. **12**
  * **2.8 User Interface** .............................................................................................. **12**
* **REFERENCES** .................................................................................----------------........... **13**
* **APPENDICES** .......................................................................................................... **14**
  * **Appendix A. Business Process Model and Notation (BPMN) Diagram** .................. **14**
  * **Appendix B. Entity-Relationship Diagram (ERD) & Schema Model** .................... **15**

<div style="page-break-after: always;"></div>

---

# CHAPTER 1

## INTRODUCTION

### 1.1 Rationale

#### Background
Animal welfare organizations and stray shelters frequently operate in highly dynamic environments. Field rescuers, veterinarians, and volunteer coordinators are constantly in transit, responding to emergency reports of injured, stray, or distressed animals. However, operational efficiency is severely hampered by critical bottlenecks:

* **Information Disconnect:** Rescuers in the field lack real-time access to active incident locations, contact details of reporting citizens, and historical records of animals previously rescued in the area, leading to delayed dispatches.
* **Unmonitored Shelter Capacities:** Intake staff lack a centralized mechanism to monitor kennel availability across different shelter locations, which causes unbalanced distributions and shelter overcrowding.
* **Fragmented Health Tracking:** Veterinary diagnosis, medication logs, and treatment plans are recorded in paper-based logs or localized spreadsheets, rendering historical medical data inaccessible when adjusting rehabilitation plans.

#### Business Opportunity
The ubiquity of mobile internet connectivity presents a significant opportunity to streamline animal rescue operations through a centralized, web-based platform:

* **Real-time Incident Portals:** A public reporting interface allows citizens to submit incident descriptions, animal species, photos, severity levels, and geographic coordinates directly into the queue.
* **Centralized Dispatch & Registry:** Staff can instantly review, update, and assign incidents to volunteers and shelters, logging rescue timelines, statuses, and veterinary treatments.
* **Privileged Access Control:** Secure interfaces partition operational duties, ensuring public guests can only report cases, while volunteers, veterinarians, and managers retain appropriate write privileges.
* **Open-Source Customizability:** Building this platform as a specialized, low-cost solution ensures small-to-medium shelters can adopt it without the prohibitive licensing costs of generic commercial CRM systems.

<div style="page-break-after: always;"></div>

### 1.2 Objectives

#### 1.2.1 General Objectives
The general objective of this project is to develop and deploy **RescueHub**, a web-based Animal Rescue operations and Information Management Platform that centralizes public incident reporting, rescue case dispatching, shelter capacity allocation, and veterinary treatment history tracking for animal welfare organizations.

#### 1.2.3 Specific Objectives
##### Objectives & Success Criteria
* **Reduce Response Lag:** Decrease the time elapsed between public incident reporting and volunteer team dispatch by **50%** through automated notifications.
* **Minimize Administrative Overhead:** Reduce the home office administration and paper log maintenance costs by **20%** by digitizing case sheets and medical logs.
* **Eliminate Duplicate Dispatches:** Reduce double dispatches to the same location/animal report by **40%** through live coordinate mapping and incident status tracking.
* **Lighten Field Cargo:** Decrease the physical documentation (manual forms, clipboard logs) carried by field responders by **75%** without compromising reporting compliance.
* **Enhance Medical Accuracy:** Ensure **100%** of admitted animals have their diagnoses, medication dosages, and veterinarian identities accurately logged and easily retrievable in the field.

##### Business Risks
* **Scope Creep & High Development Cycles:** Custom-building a system from scratch might consume extensive development time, making it less cost-effective than standard digital forms (e.g., Google Forms) if project milestones are delayed.
* **Operational Incompatibility:** If design features fail to account for field constraints (e.g., inputting data on mobile devices in chaotic environments), volunteers may bypass the system, leaving records unpopulated.

<div style="page-break-after: always;"></div>

### 1.3 Scope and Limitation

#### 1.3.1 Scope
The system tracks the progress of the animal rescue project, specifically monitoring incident reports, rescue cases, shelter capacities, and veterinary care logs.

##### Scope of initial release
* **Focus on reading/modifying existing project documents:** Users can view, search, and update active rescue cases, animal registers, and medical logs.
* **Time stamps, version control:** Every state change, assignment, or status update dynamically records timestamps and logs changes in the append-only `activityLogs` audit system.
* **Very simple menu-based interface:** Navigation is handled through a straightforward, responsive sidebar menu.

##### Scope of subsequent releases
* **Improve interface:** Integrate advanced dashboard cards, customizable layout themes, and real-time mapping dashboards.
* **Add capability to originate new projects:** Enable dispatchers to create fresh case logs directly or promote incoming citizen incident reports.
* **Add user privilege functionality:** Implement Role-Based Access Control (RBAC) to differentiate permissions between Admin, Dispatcher, Rescuer, and Vet.
* **Allow personnel assignments:** Allow dispatchers to assign field rescuers and select housing shelters for specific rescue cases.

#### 1.3.2 Limitation
The system handles operational data logging and internal tracking only; it cannot support multi-tenant hosting, direct communication routing, or live financial transactions due to initial architecture and integration boundaries.

##### Limitations and exclusions
* **Tethered Database Model:** RescueHub will be coupled directly with the organization’s central database and does not support multi-tenant configurations for separate external organizations.
* **Communication Modes:** The platform will manage operational logs but will not replace existing communication channels (e.g., phone call hotlines, VHF radios, or email clients).
* **Payment Gateways:** The initial release does not process financial donations, adoption fee transactions, or vet billing directly; it only records audit entries, leaving payment processing to manual workflows.

<div style="page-break-after: always;"></div>

---

# CHAPTER 2

## ANALYSIS AND DESIGN

### 2.1 Business Process
The animal rescue operational lifecycle follows a linear path from the moment an animal is spotted in distress until its final case resolution:

```
[Public Portal] ➔ Citizens spot animal in distress & submit report with location & photo.
[Dispatch Console] ➔ Dispatcher verifies report severity ➔ Assigns volunteer team & shelter.
[Field Rescue Operation] ➔ Rescuers receive alert ➔ Travel to scene & transport animal.
[Shelter Intake & Rehab] ➔ Animal admitted ➔ Vet performs physical exam & logs treatment ➔ Final Outcome (Adopted / Released).
```

---

### 2.2 Users
The platform categorizes its users into four primary classes, each matching a specific technical profile and set of operational permissions:

| User Class | Description | Technical Profile | Privilege Level | Key Functions Used |
| :--- | :--- | :--- | :--- | :--- |
| **Public Reporter** | Everyday citizens report stray or injured animals. | Low; relies on simple, form-driven mobile UI. | Guest (Unauthenticated) | Submit Incident Report, view public knowledge base articles. |
| **Field Rescuer** | Volunteer field agents executing physical rescue operations. | Moderate; accesses mobile layouts in field conditions. | Agent | View active dispatches, update case statuses, log field notes. |
| **Veterinarian** | Medical professionals treating rescued animals at shelters. | Moderate; accesses tablet/desktop interfaces in clinic. | Agent (Specialized) | View animal records, insert diagnoses, log treatments and medications. |
| **Dispatcher / Shelter Manager** | Central staff overseeing rescues and shelter operations. | High; manages operations using a desktop workspace. | Admin / Manager | Review incident reports, assign tickets to agents, track capacities. |

---

### 2.3 ERD (Entity-Relationship Diagram)

The normalized database schema consists of 10 primary entity sets designed to 3rd Normal Form (3NF):
* **`Shelter`** (1) ──── (M) **`Animal`**
* **`Species`** (1) ──── (M) **`Animal`**
* **`Incident_Report`** (1) ──── (1) **`Ticket`**
* **`Ticket`** (1) ──── (1) **`Animal`**
* **`Agent`** (1) ──── (M) **`Animal_Treatment`**
* **`Role`** (1) ──── (M) **`Agent`**
* **`Team`** (1) ──── (M) **`Ticket`**

<div style="page-break-after: always;"></div>

### 2.4 SQL Queries Used

#### Query 1. Active Emergency and Critical Rescue Cases
**Purpose:**  
This query retrieves all active rescue cases with **Critical** or **High** priority that require immediate dispatcher attention. It joins rescue cases with incident reports, assigned rescuers, and designated shelters to provide a consolidated operational view.

**SQL Code:**
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

**Sample Output:**
| case_id | case_number | severity | case_status | location | assigned_rescuer | target_shelter | dispatched_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2 | RC-2026-0002 | Critical | UNDER_TREATMENT | Highway 101, Mile Marker 45 | Admin User | Green Valley Sanctuary | 2026-07-15 08:30:00 |
| 6 | RC-2026-0006 | High | ASSIGNED | 123 Talamban Rd, Cebu | Alice Green | Northside Animal Refuge | 2026-07-17 10:15:00 |

---

#### Query 2. Live Shelter Bed Capacity Utilization
**Purpose:**  
This query calculates the total shelter capacity, occupied beds, available beds, and occupancy percentage for every registered shelter. It assists dispatchers in assigning rescued animals to shelters with available space.

**SQL Code:**
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

**Sample Output:**
| shelter_id | shelter_name | total_beds | occupied_beds | available_beds | occupancy_percentage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Safe Haven Shelter | 25 | 22 | 3 | 88.0% |
| 2 | Green Valley Sanctuary | 30 | 18 | 12 | 60.0% |
| 3 | Northside Animal Refuge | 20 | 8 | 12 | 40.0% |

---

#### Query 3. Species Intake Distribution Report
**Purpose:**  
This query summarizes rescued animals according to species and current rescue outcomes. The generated report supports rescue planning and operational analysis.

**SQL Code:**
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

**Sample Output:**
| species_name | total_admitted | in_intake | under_care | adopted_out | released_wild |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Dog | 45 | 12 | 8 | 20 | 5 |
| Cat | 32 | 9 | 5 | 15 | 3 |
| Bird | 8 | 1 | 2 | 0 | 5 |

---

#### Query 4. Medical Treatment Workload by Veterinarian
**Purpose:**  
This query calculates the number of treatment records handled by each veterinarian together with the number of unique animal patients and pending follow-up schedules.

**SQL Code:**
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

**Sample Output:**
| veterinarian_name | total_treatments_logged | unique_patients_treated | pending_followups |
| :--- | :--- | :--- | :--- |
| Dr. Alice Vance | 18 | 14 | 3 |
| Dr. Marcus Wright | 12 | 10 | 1 |

---

#### Query 5. Rescue Case Activity Timeline
**Purpose:**  
This query retrieves the chronological activity logs associated with a rescue case, including the original incident report, animal profile updates, and medical treatments. It provides a complete audit trail of the rescue workflow.

**SQL Code:**
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

**Sample Output:**
| log_id | timestamp | entity_type | entity_id | action | performed_by |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 101 | 2026-07-15 08:00:00 | IncidentReport | 1 | Incident report submitted by Citizen | Citizen Reporter |
| 104 | 2026-07-15 08:15:00 | RescueCase | 2 | Case RC-2026-0002 created & assigned | Dispatcher |
| 108 | 2026-07-15 09:30:00 | Animal | 2 | Animal 'Dino' admitted to shelter | Rescuer |
| 112 | 2026-07-15 11:00:00 | Treatment | 1 | Antibiotic treatment & fracture cast applied | Veterinarian |

---

#### Query 6. Pending Incident Reports
**Purpose:**  
This query retrieves all public incident reports that are still awaiting dispatcher verification. Reports are ordered according to severity level and submission time to ensure urgent cases receive immediate attention.

**SQL Code:**
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

**Sample Output:**
| incident_id | reporter_name | contact_number | species_name | severity | location | reported_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 5 | John Smith | 09171234567 | Dog | Critical | Talamban Highway | 2026-07-17 09:30:00 |
| 6 | Anonymous | N/A | Cat | Medium | IT Park Bldg 2 | 2026-07-17 10:15:00 |

<div style="page-break-after: always;"></div>

### 2.5 Functional Requirements

Functional requirements define the services and operations that the RescueHub system must provide to achieve its objectives. These requirements describe how users interact with the system and how information is processed throughout the animal rescue workflow. The RescueHub system is divided into five primary functional modules:

#### 2.5.1 Citizen Emergency Incident Reporting Subsystem (Public Portal)
* **FR-1.1 Incident Data Capture:** The system shall allow public users (citizens) to submit emergency incident reports by inputting the reporter's name, contact phone number, animal species (Dog, Cat, Bird, Other), estimated severity level (`Low`, `Medium`, `High`, `Critical`), geographic location/address, landmark description, and optional photo file uploads.
* **FR-1.2 Interactive Map Location Pinning:** The system shall provide an interactive map interface allowing users to pin geographic coordinates (latitude and longitude) or select pre-defined municipal landmarks.
* **FR-1.3 Anonymous Incident Submissions:** The system shall permit users to toggle anonymous reporting, withholding reporter contact details while still queuing the incident for emergency dispatch review.
* **FR-1.4 Submission Confirmation:** Upon successful submission, the system shall generate a unique incident tracking reference and display a clear confirmation notification to the reporter.

#### 2.5.2 Emergency Dispatch & Case Lifecycle Subsystem
* **FR-2.1 Incident Queue & Review:** The system shall display incoming public incident reports in a centralized dispatcher queue sorted chronologically and prioritized by severity.
* **FR-2.2 Incident Verification & Promotion:** The system shall enable authorized dispatchers to review pending incident reports and promote valid reports into formal Rescue Cases (`RC-2026-XXXX`).
* **FR-2.3 Responder & Shelter Assignment:** The system shall allow dispatchers to assign active field rescue teams (or individual rescuers) and designate target housing shelters to specific rescue cases.
* **FR-2.4 Lifecycle Status Progression:** The system shall strictly enforce sequential case status transitions through the operational pipeline: `REPORTED` ➔ `ASSIGNED` ➔ `EN_ROUTE` ➔ `RESCUED` ➔ `SHELTER_INTAKE` ➔ `UNDER_TREATMENT` ➔ `RECOVERED` ➔ `ADOPTED`/`RELEASED`.
* **FR-2.5 Rescue Journey Audit Timeline:** The system shall render a vertical, chronological timeline for every rescue case, displaying all status updates, responder reassignments, and notes along with timestamps and user attribution.

#### 2.5.3 Animal Intake & Shelter Capacity Allocation Subsystem
* **FR-3.1 Digital Animal Profile Registration:** The system shall allow shelter intake staff to register admitted animals with detailed attributes including name, species, breed, sex, estimated age, weight (kg), physical condition assessment, admission date, and primary photo.
* **FR-3.2 Real-Time Capacity Calculation:** The system shall continuously calculate and display total, occupied, and available bed capacities for all registered shelter facilities using live database queries (`Available Beds = Total Capacity - Count of Currently Admitted Animals`).
* **FR-3.3 Overcrowding Threshold Warnings:** The system shall trigger visual warnings (high-occupancy badges) whenever a shelter facility reaches or exceeds **90%** bed capacity utilization.
* **FR-3.4 Image Storage & Indexing:** The system shall store uploaded animal photos on the server file directory and index relative path references within the MySQL `Animal` table.

#### 2.5.4 Veterinary Medical Care & Treatment Subsystem
* **FR-4.1 Medical Examination Logging:** The system shall allow authorized veterinarians to create medical care entries tied to specific animal IDs, recording primary diagnosis, surgical/clinical procedures performed, prescribed medications, and clinical notes.
* **FR-4.2 Follow-Up Checkup Scheduling:** The system shall enable veterinarians to specify future follow-up evaluation dates (`followup_date`) for animals under care.
* **FR-4.3 Pending Care Alerts:** The system shall track pending follow-up evaluations and highlight animals requiring re-examination on the clinic dashboard.
* **FR-4.4 Historical Health Records Retrieval:** The system shall maintain a complete historical log of all veterinary interventions per animal, accessible to clinic staff during ongoing rehabilitation.

#### 2.5.5 Access Control, Reporting & System Audit Subsystem
* **FR-5.1 Role-Based Access Control (RBAC):** The system shall restrict interface features and REST API endpoints according to user roles (`Admin`, `Dispatcher`, `Veterinarian`, `Rescuer`, `Guest`).
* **FR-5.2 Append-Only System Activity Logging:** The system shall automatically record database mutation events (case creation, status updates, treatment entries, record deletions) into an append-only `ActivityLog` table with user identity and ISO timestamps.
* **FR-5.3 Interactive Dashboard Analytics:** The system shall generate aggregated operational metrics including active emergency cases, animals under treatment, total intake distribution by species, and vet care workload statistics.

<div style="page-break-after: always;"></div>

### 2.6 Access and Security Controls

#### Role Permissions Matrix
The RescueHub platform partitions operational duties into five privilege tiers:

| Function / Action | Guest (Public) | Rescuer | Veterinarian | Dispatcher | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Submit Incident Report** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Rescue Cases List** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Update Case Status & Notes** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Promote Incident / Assign Rescuer** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **View & Register Animal Profiles** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Log Veterinary Medical Care** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Manage Shelters & Rescuers Roster** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Delete Database Records** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **View Full Activity Audit Logs** | ❌ | ❌ | ❌ | ❌ | ✅ |

#### Database Security & DCL Privilege Statements
In MySQL, database user roles follow the principle of least privilege:

```sql
-- 1. Create Application Database User
CREATE USER 'rescuehub_app'@'localhost' IDENTIFIED BY 'SecureAppPass2026!';

-- 2. Grant Operational DML Privileges (SELECT, INSERT, UPDATE, DELETE)
GRANT SELECT, INSERT, UPDATE, DELETE ON rescuehub_db.* TO 'rescuehub_app'@'localhost';

-- 3. Create Read-Only Reporting User for Analytics
CREATE USER 'rescuehub_analytics'@'localhost' IDENTIFIED BY 'ReadOnlyAnalytics2026!';
GRANT SELECT ON rescuehub_db.* TO 'rescuehub_analytics'@'localhost';

-- Flush privileges to apply security settings
FLUSH PRIVILEGES;
```

---

### 2.7 Project Schedule (Use Gantt Chart)
The development lifecycle of the RescueHub MVP follows a structured path over six milestones:
1. **Requirement Engineering (06-21 to 06-28):** Domain analysis, stakeholder interviews, and SRS documentation.
2. **Store & Local Schema (06-28 to 07-05):** Database schema normalization (3NF), ERD design, and Prisma migrations.
3. **UI & CRUD Features (07-05 to 07-12):** React interface components, Express REST API development, and RBAC guards.
4. **Map Pinning Integration (07-12 to 07-19):** Coordinate picker integration and location dispatches.
5. **Quality & Release (07-19 to 07-24):** End-to-end testing, audit log verification, and production deployment.

---

### 2.8 User Interface
The user interface is designed using responsive web aesthetics, featuring high-contrast badges, real-time feedback toasts, and clear empty states:
* **Operations Dashboard:** 8 KPI metric cards displaying real-time system dispatches, shelter occupancies, and recent audit activity streams.
* **Citizen Incident Portal:** Mobile-first reporting interface with species pickers, location inputs, and photo upload support.
* **Rescue Cases & Timeline Modal:** Master case registry with a 2-column edit dialog containing the dynamic vertical **Case Journey Timeline**.
* **Animals & Medical Modules:** Digital registries for shelter intake management and veterinary care tracking.

<div style="page-break-after: always;"></div>

---

# REFERENCES

1. **Elmasri, R., & Navathe, S. B.** (2021). *Fundamentals of Database Systems* (7th ed.). Pearson.
2. **Fielding, R. T.** (2000). *Architectural styles and the design of network-based software architectures* (Doctoral dissertation, University of California, Irvine).
3. **Freeman, A.** (2022). *Pro React 18: Building Web Applications with React, TypeScript, and Vite* (3rd ed.). Apress. https://doi.org/10.1007/978-1-4842-8871-9
4. **Humane Society International.** (2023). *Digital tools for stray animal census, rescue dispatching, and shelter population management*. HSI Technical Reports. https://www.hsi.org/resources/
5. **Prisma ORM Documentation.** (2026). *Type-safe database client and schema migrations for Node.js and TypeScript*. Prisma Data Inc. https://www.prisma.io/docs/
6. **Rescorla, E.** (2018). *The Transport Layer Security (TLS) Protocol Version 1.3* (RFC 8446). Internet Engineering Task Force (IETF). https://doi.org/10.17487/RFC8446
7. **Sandhu, R. S., Coyne, E. J., Feinstein, H. L., & Youman, C. E.** (1996). Role-based access control models. *IEEE Computer*, 29(2), 38-47. https://doi.org/10.1109/2.485845
8. **Silberschatz, A., Korth, H. F., & Sudarshan, S.** (2020). *Database System Concepts* (7th ed.). McGraw-Hill Education.
9. **World Organisation for Animal Health.** (2024). *Global standards for stray animal management, rescue dispatches, and shelter welfare operations*. WOAH Terrestrial Animal Health Code, Chapter 7.7. https://www.woah.org/

<div style="page-break-after: always;"></div>

---

# APPENDICES

---

## Appendix A. Business Process Model and Notation (BPMN) Diagram & Workflow Description

### 1. BPMN Operational Workflow Diagram
The **Business Process Model and Notation (BPMN)** diagram outlines the end-to-end operational lifecycle of the RescueHub system across four primary functional pools/lanes:

```
+-----------------------------------------------------------------------------------------------------------------------+
| PUBLIC PORTAL LANE                                                                                                    |
|  (Start) ──> Citizen Spots Animal in Distress ──> Fills Species, Location & Details ──> Submits Incident Report ──> (x)|
+-----------------------------------------------------------------------------------------------------------------------+
                                                               |
                                                               v
+-----------------------------------------------------------------------------------------------------------------------+
| DISPATCH CONSOLE LANE                                                                                                 |
|  Dispatcher Receives Alert ──> Reviews Severity & Location ──> Is Report Valid? ──[NO]──> Close Report / Dismiss     |
|                                                                 │                                                     |
|                                                               [YES]                                                   |
|                                                                 ▼                                                     |
|                                                     Promote to Rescue Case (RC-2026-XXXX)                             |
|                                                     Assign Rescue Team & Housing Shelter                              |
+-----------------------------------------------------------------------------------------------------------------------+
                                                               |
                                                               v
+-----------------------------------------------------------------------------------------------------------------------+
| FIELD RESCUE OPERATION LANE                                                                                           |
|  Rescuers Receive Alert ──> Update Status: 'EN_ROUTE' ──> Arrive at Scene & Secure Animal ──> Update Status: 'RESCUED'|
+-----------------------------------------------------------------------------------------------------------------------+
                                                               |
                                                               v
+-----------------------------------------------------------------------------------------------------------------------+
| SHELTER INTAKE & VETERINARY REHABILITATION LANE                                                                       |
|  Shelter Intake: Register Animal Profile ──> Vet Examination ──> Log Diagnosis, Treatment & Medication                |
|                                                                                 │                                     |
|                                                                       Rehabilitation Outcome                          |
|                                                                       ┌─────────┴─────────┐                           |
|                                                                       ▼                   ▼                           |
|                                                                  Adoptable            Wild/Feral                      |
|                                                                       │                   │                           |
|                                                                       ▼                   ▼                           |
|                                                                Adopted Out         Released to Habitat                |
|                                                                 (End - Closed)      (End - Closed)                    |
+-----------------------------------------------------------------------------------------------------------------------+
```

### 2. BPMN Process Workflow Description
* **Stage 1 — Public Emergency Intake:** Citizens submit emergency reports via the public portal capturing reporter name, species, estimated severity (`Critical`, `High`, `Medium`, `Low`), location coordinates, and photo uploads.
* **Stage 2 — Dispatch Review & Case Promotion:** Central dispatchers review incoming reports in real time, filtering by urgency. Valid reports are promoted into formal Rescue Cases (`RC-2026-XXXX`) and assigned to active field rescue units and target housing shelters. Invalid or duplicate reports are archived.
* **Stage 3 — Field Dispatch Execution:** Assigned field rescuers receive dispatch alerts, update case statuses to `EN_ROUTE`, locate and secure the animal at the scene, update status to `RESCUED`, and transport the animal to the assigned shelter.
* **Stage 4 — Shelter Intake & Veterinary Rehabilitation:** Intake staff register the admitted animal profile, updating status to `SHELTER_INTAKE`. Clinic veterinarians perform physical evaluations, logging diagnoses, medications, and treatment plans (`UNDER_TREATMENT`). Upon recovery, the animal is marked as `ADOPTED` or `RELEASED`.

<div style="page-break-after: always;"></div>

---

## Appendix B. phpMyAdmin / MySQL Relational ERD & Data Dictionary

### 1. phpMyAdmin / MySQL Relational ERD Schema View
The relational schema engineered in **phpMyAdmin / MySQL 8.0** via Prisma ORM follows **3rd Normal Form (3NF)** with strict InnoDB foreign key constraint cascades (`CASCADE` / `SET NULL`):

```
                  +-------------------+
                  |      Shelter      |
                  +-------------------+
                  | PK  id            | <─────────────┐
                  |     shelter_name  |               │
                  |     capacity      |               │
                  |     address       |               │
                  |     contact_number|               │
                  +-------------------+               │
                            │ 1                       │ 1
                            │                         │
                            │ 0..M                    │ 0..M
                            v                         │
                  +-------------------+               │
                  |       Animal      |               │
                  +-------------------+               │
                  | PK  id            |               │
                  | FK  species_id    | ───┐          │
                  | FK  ticket_id     |    │          │
                  | FK  shelter_id    | ───┼──────────┘
                  |     name          |    │
                  |     breed         |    │
                  |     sex           |    │
                  |     weight        |    │
                  |     condition     |    │
                  |     status        |    │
                  +-------------------+    │
                            │ 1            │
                            │              │
                            │ 0..M         │
                            v              │
                  +-------------------+    │
                  |  Animal_Treatment |    │
                  +-------------------+    │
                  | PK  id            |    │
                  | FK  animal_id     |    │
                  | FK  vet_agent_id  |    │
                  | FK  ticket_id     |    │
                  |     diagnosis     |    │
                  |     treatment     |    │
                  |     medication    |    │
                  |     followup_date |    │
                  +-------------------+    │
                                           │
                                           │
+-------------------+             +────────┴──────────+
|  Incident_Report  |             |      Species      |
+-------------------+             +-------------------+
| PK  id            |             | PK  id            |
| FK  species_id    | ──────────> |     species_name  |
|     reporter_name |             +-------------------+
|     severity      |
|     status        |
|     location      |
|     description   |
+-------------------+
          │ 1
          │
          │ 0..1
          v
+-------------------+             +-------------------+
|       Ticket      |             |       Agent       |
+-------------------+             +-------------------+
| PK  id            |             | PK  id            |
| FK  incident_id   |             | FK  role_id       | ──────> +-------------------+
| FK  team_id       | <─────────  | FK  team_id       |         |        Role       |
|     subject       | 1      0..M |     first_name    |         +-------------------+
|     status        |             |     last_name     |         | PK  id            |
|     priority      |             |     email         |         |     role_name     |
|     rescue_notes  |             +-------------------+         +-------------------+
+-------------------+                       │ 1
                                            │
                                            │ 0..M
                                            v
                                  +-------------------+
                                  |    ActivityLog    |
                                  +-------------------+
                                  | PK  id            |
                                  |     timestamp     |
                                  |     entity_type   |
                                  |     entity_id     |
                                  |     action        |
                                  |     user          |
                                  +-------------------+
```

### 2. phpMyAdmin Data Dictionary & Table Structure Descriptions

#### Table 1: `Shelter`
* **Description:** Stores housing shelter facilities, capacity limits, and contact information.
* **Fields:** `id` (INT, PK, Auto-Increment), `shelter_name` (VARCHAR 255), `address` (TEXT), `contact_number` (VARCHAR 50), `capacity` (INT), `created_at` (DATETIME).

#### Table 2: `Species`
* **Description:** Lookup reference table for animal species classifications.
* **Fields:** `id` (INT, PK, Auto-Increment), `species_name` (VARCHAR 100, UNIQUE). *(Values: Dog, Cat, Bird, Other)*.

#### Table 3: `Role`
* **Description:** User privilege tier definitions for System RBAC security.
* **Fields:** `id` (INT, PK, Auto-Increment), `role_name` (VARCHAR 50, UNIQUE). *(Values: Admin, Dispatcher, Veterinarian, Rescuer)*.

#### Table 4: `Agent`
* **Description:** System user accounts including field rescuers, veterinarians, dispatchers, and administrators.
* **Fields:** `id` (INT, PK, Auto-Increment), `first_name` (VARCHAR 100), `last_name` (VARCHAR 100), `email` (VARCHAR 255, UNIQUE), `password` (VARCHAR 255), `phone` (VARCHAR 50), `role_id` (INT, FK ➔ `Role.id`), `team_id` (INT, FK ➔ `Team.id`, NULLABLE), `status` (ENUM: 'Active', 'Inactive').

#### Table 5: `Team`
* **Description:** Field rescue teams and responder units assigned to dispatches.
* **Fields:** `id` (INT, PK, Auto-Increment), `team_name` (VARCHAR 100), `manager_agent_id` (INT, FK ➔ `Agent.id`), `base_shelter_id` (INT, FK ➔ `Shelter.id`).

#### Table 6: `Incident_Report`
* **Description:** Public emergency distress submissions sent by citizens.
* **Fields:** `id` (INT, PK, Auto-Increment), `reporter_name` (VARCHAR 255), `contact_number` (VARCHAR 50), `is_anonymous` (BOOLEAN), `species_id` (INT, FK ➔ `Species.id`), `severity` (ENUM: 'Low', 'Medium', 'High', 'Critical'), `status` (ENUM: 'Pending', 'Approved', 'Rejected'), `location` (TEXT), `latitude` (DOUBLE), `longitude` (DOUBLE), `description` (TEXT), `created_at` (DATETIME).

#### Table 7: `Ticket`
* **Description:** Master operational rescue cases (`RC-2026-XXXX`) promoted from verified incident reports.
* **Fields:** `id` (INT, PK, Auto-Increment), `subject` (VARCHAR 255), `incident_report_id` (INT, FK ➔ `Incident_Report.id`, UNIQUE), `rescue_date` (DATETIME), `rescue_notes` (TEXT), `status` (ENUM: 'REPORTED', 'ASSIGNED', 'EN_ROUTE', 'RESCUED', 'SHELTER_INTAKE', 'UNDER_TREATMENT', 'RECOVERED', 'ADOPTED', 'RELEASED'), `priority` (ENUM: 'Low', 'Medium', 'High', 'Critical'), `current_assigned_team_id` (INT, FK ➔ `Team.id`), `description` (TEXT), `created_at` (DATETIME).

#### Table 8: `Animal`
* **Description:** Digital health profiles for admitted animals.
* **Fields:** `id` (INT, PK, Auto-Increment), `name` (VARCHAR 100), `species_id` (INT, FK ➔ `Species.id`), `breed` (VARCHAR 100), `sex` (VARCHAR 20), `age_estimate` (VARCHAR 50), `weight` (DOUBLE), `condition` (TEXT), `status` (ENUM: 'Intake', 'Under Treatment', 'Recovered', 'Adopted', 'Released'), `photo_url` (TEXT), `ticket_id` (INT, FK ➔ `Ticket.id`, UNIQUE), `shelter_id` (INT, FK ➔ `Shelter.id`), `created_at` (DATETIME).

#### Table 9: `Animal_Treatment`
* **Description:** Veterinary clinic care logs, surgical treatments, and prescriptions.
* **Fields:** `id` (INT, PK, Auto-Increment), `animal_id` (INT, FK ➔ `Animal.id`), `vet_agent_id` (INT, FK ➔ `Agent.id`), `ticket_id` (INT, FK ➔ `Ticket.id`), `diagnosis` (TEXT), `treatment` (TEXT), `medication` (TEXT), `notes` (TEXT), `followup_date` (DATETIME), `created_at` (DATETIME).

#### Table 10: `ActivityLog`
* **Description:** System-wide append-only audit log tracking mutations across all modules.
* **Fields:** `id` (INT, PK, Auto-Increment), `timestamp` (DATETIME), `entity_type` (VARCHAR 100), `entity_id` (INT), `action` (TEXT), `user` (VARCHAR 255).
