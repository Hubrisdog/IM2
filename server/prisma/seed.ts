import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with exact benchmark records...')

  // Clean existing tables and reset autoincrement in MySQL
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ActivityLog;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Animal_Treatment;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Animal;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Ticket;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Incident_Report;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Agent;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Team;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Shelter;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Species;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE Role;`)
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`)

  // 1. Seed Roles (IDs 1, 2, 3, 4)
  const dispatcherRole = await prisma.role.create({ data: { role_name: 'Dispatcher' } })
  const rescuerRole = await prisma.role.create({ data: { role_name: 'Rescuer' } })
  const vetRole = await prisma.role.create({ data: { role_name: 'Veterinarian' } })
  const adminRole = await prisma.role.create({ data: { role_name: 'Admin' } })

  // 2. Seed Species (IDs 1, 2, 3, 4)
  const dog = await prisma.species.create({ data: { species_name: 'Dog' } })
  const cat = await prisma.species.create({ data: { species_name: 'Cat' } })
  const bird = await prisma.species.create({ data: { species_name: 'Bird' } })
  const other = await prisma.species.create({ data: { species_name: 'Other' } })

  // 3. Seed Shelters (IDs 1, 2, 3 to match Query 2)
  // Shelter 1: Safe Haven Shelter (Capacity: 25, Active Occupancy: 22 -> 88.0%)
  const sh1 = await prisma.shelter.create({
    data: {
      id: 1,
      shelter_name: 'Safe Haven Shelter',
      address: '789 Oak Ave, Riverdale',
      contact_number: '555-0122',
      capacity: 25,
      created_at: new Date('2026-01-01')
    }
  })

  // Shelter 2: Green Valley Sanctuary (Capacity: 30, Active Occupancy: 18 -> 60.0%)
  const sh2 = await prisma.shelter.create({
    data: {
      id: 2,
      shelter_name: 'Green Valley Sanctuary',
      address: '124 Forest Rd, Green Valley',
      contact_number: '555-0111',
      capacity: 30,
      created_at: new Date('2026-01-01')
    }
  })

  // Shelter 3: Northside Animal Refuge (Capacity: 20, Active Occupancy: 8 -> 40.0%)
  const sh3 = await prisma.shelter.create({
    data: {
      id: 3,
      shelter_name: 'Northside Animal Refuge',
      address: '456 Pines Hwy, Northport',
      contact_number: '555-0133',
      capacity: 20,
      created_at: new Date('2026-01-01')
    }
  })

  // 4. Seed Agents (Users)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const agentPassword = await bcrypt.hash('agent123', 10)

  // Admin User (Agent ID 1)
  const adminAgent = await prisma.agent.create({
    data: {
      id: 1,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@rescuehub.org',
      password: hashedPassword,
      phone: '555-0000',
      role_id: adminRole.id,
      status: 'Active'
    }
  })

  // Dispatcher Alice Green (Agent ID 2)
  const aliceGreen = await prisma.agent.create({
    data: {
      id: 2,
      first_name: 'Alice',
      last_name: 'Green',
      email: 'alice.green@rescuehub.org',
      password: agentPassword,
      phone: '555-0011',
      role_id: dispatcherRole.id,
      status: 'Active'
    }
  })

  // Veterinarian Dr. Alice Vance (vet 1)
  const vet1 = await prisma.agent.create({
    data: {
      id: 3,
      first_name: 'Dr. Alice',
      last_name: 'Vance',
      email: 'alice.vance@rescuehub.org',
      password: agentPassword,
      phone: '555-0155',
      role_id: vetRole.id,
      status: 'Active'
    }
  })

  // Veterinarian Dr. Marcus Wright (vet 2)
  const vet2 = await prisma.agent.create({
    data: {
      id: 4,
      first_name: 'Dr. Marcus',
      last_name: 'Wright',
      email: 'marcus.wright@rescuehub.org',
      password: agentPassword,
      phone: '555-0166',
      role_id: vetRole.id,
      status: 'Active'
    }
  })

  // Rescuers
  const res1 = await prisma.agent.create({
    data: {
      id: 5,
      first_name: 'Mark',
      last_name: 'Davis',
      email: 'mark.davis@rescuehub.org',
      password: agentPassword,
      phone: '555-0199',
      role_id: rescuerRole.id,
      status: 'Active'
    }
  })

  // 5. Seed Teams
  // Team 1: Managed by Admin User (Agent ID 1)
  const team1 = await prisma.team.create({
    data: {
      id: 1,
      team_name: 'Alpha Emergency Team',
      manager_agent_id: adminAgent.id,
      base_shelter_id: sh2.id
    }
  })

  // Team 2: Managed by Alice Green (Agent ID 2)
  const team2 = await prisma.team.create({
    data: {
      id: 2,
      team_name: 'Bravo Dispatch Unit',
      manager_agent_id: aliceGreen.id,
      base_shelter_id: sh3.id
    }
  })

  // 6. Seed Incident Reports
  const inc1 = await prisma.incident_Report.create({
    data: {
      id: 1,
      reporter_name: 'Citizen Reporter',
      contact_number: '555-0123',
      is_anonymous: false,
      species_id: dog.id,
      severity: 'Medium',
      status: 'Approved',
      location: '12 Maple St, Riverside',
      latitude: 10.354,
      longitude: 123.912,
      description: 'Injured stray dog near residential area.',
      created_at: new Date('2026-07-15T08:00:00Z')
    }
  })

  const inc2 = await prisma.incident_Report.create({
    data: {
      id: 2,
      reporter_name: 'Highway Patrol',
      contact_number: '555-0124',
      is_anonymous: false,
      species_id: dog.id,
      severity: 'Critical',
      status: 'Approved',
      location: 'Highway 101, Mile Marker 45',
      latitude: 10.362,
      longitude: 123.895,
      description: 'Dog hit by vehicle on highway median.',
      created_at: new Date('2026-07-15T08:30:00Z')
    }
  })

  const inc3 = await prisma.incident_Report.create({
    data: {
      id: 3,
      reporter_name: 'Central Park Ranger',
      contact_number: '555-0125',
      is_anonymous: false,
      species_id: bird.id,
      severity: 'Medium',
      status: 'Approved',
      location: 'Central Park Pond Area',
      latitude: 10.315,
      longitude: 123.902,
      description: 'Bird entangled in fishing net.',
      created_at: new Date('2026-07-16T10:00:00Z')
    }
  })

  const inc4 = await prisma.incident_Report.create({
    data: {
      id: 4,
      reporter_name: 'Local Resident',
      contact_number: '555-0126',
      is_anonymous: false,
      species_id: cat.id,
      severity: 'Low',
      status: 'Approved',
      location: 'Unknown',
      latitude: 10.320,
      longitude: 123.900,
      description: 'Abandoned litter of kittens.',
      created_at: new Date('2026-07-16T14:00:00Z')
    }
  })

  // Query 6 Pending Incidents: IDs 5 & 6
  const inc5 = await prisma.incident_Report.create({
    data: {
      id: 5,
      reporter_name: 'John Smith',
      contact_number: '09171234567',
      is_anonymous: false,
      species_id: dog.id,
      severity: 'Critical',
      status: 'Pending',
      location: 'Talamban Highway',
      latitude: 10.355,
      longitude: 123.915,
      description: 'Severe traffic emergency, dog pinned under guardrail.',
      created_at: new Date('2026-07-17T09:30:00Z')
    }
  })

  const inc6 = await prisma.incident_Report.create({
    data: {
      id: 6,
      reporter_name: 'Anonymous',
      contact_number: 'N/A',
      is_anonymous: true,
      species_id: cat.id,
      severity: 'Medium',
      status: 'Pending',
      location: 'IT Park Bldg 2',
      latitude: 10.328,
      longitude: 123.906,
      description: 'Stray cat stuck in basement vent.',
      created_at: new Date('2026-07-17T10:15:00Z')
    }
  })

  const inc7 = await prisma.incident_Report.create({
    data: {
      id: 7,
      reporter_name: 'Cebu Citizen',
      contact_number: '555-0199',
      is_anonymous: false,
      species_id: dog.id,
      severity: 'High',
      status: 'Approved',
      location: '123 Talamban Rd, Cebu',
      latitude: 10.352,
      longitude: 123.911,
      description: 'High priority stray rescue.',
      created_at: new Date('2026-07-17T10:15:00Z')
    }
  })

  // 7. Seed Tickets (Rescue Cases)
  const tk1 = await prisma.ticket.create({
    data: {
      id: 1,
      subject: 'Rescue Case RC-2026-0001',
      incident_report_id: inc1.id,
      rescue_date: new Date('2026-07-15T08:15:00Z'),
      rescue_notes: 'Rescued and admitted to Safe Haven.',
      status: 'UNDER_TREATMENT',
      priority: 'Medium',
      current_assigned_team_id: team2.id,
      description: 'Injured stray dog near residential area.',
      created_at: new Date('2026-07-15T08:15:00Z')
    }
  })

  // Query 1 Match 1: Ticket ID 2 (RC-2026-0002)
  const tk2 = await prisma.ticket.create({
    data: {
      id: 2,
      subject: 'Rescue Case RC-2026-0002',
      incident_report_id: inc2.id,
      rescue_date: new Date('2026-07-15T08:30:00Z'),
      rescue_notes: 'Critical rescue operation executed.',
      status: 'UNDER_TREATMENT',
      priority: 'Critical',
      current_assigned_team_id: team1.id, // Manager: Admin User
      description: 'Dog hit by vehicle on highway median.',
      created_at: new Date('2026-07-15T08:30:00Z')
    }
  })

  const tk3 = await prisma.ticket.create({
    data: {
      id: 3,
      subject: 'Rescue Case RC-2026-0003',
      incident_report_id: inc3.id,
      rescue_date: new Date('2026-07-16T10:15:00Z'),
      rescue_notes: 'Bird rescued from park.',
      status: 'REPORTED',
      priority: 'Medium',
      current_assigned_team_id: null,
      description: 'Bird entangled in fishing net.',
      created_at: new Date('2026-07-16T10:15:00Z')
    }
  })

  const tk4 = await prisma.ticket.create({
    data: {
      id: 4,
      subject: 'Rescue Case RC-2026-0004',
      incident_report_id: inc4.id,
      rescue_date: null,
      rescue_notes: 'Awaiting volunteer team.',
      status: 'REPORTED',
      priority: 'Medium',
      current_assigned_team_id: null,
      description: 'Abandoned litter of kittens.',
      created_at: new Date('2026-07-16T14:15:00Z')
    }
  })

  const tk5 = await prisma.ticket.create({
    data: {
      id: 5,
      subject: 'Rescue Case RC-2026-0005',
      incident_report_id: null,
      rescue_date: null,
      rescue_notes: 'Logged directly by dispatcher.',
      status: 'REPORTED',
      priority: 'Medium',
      current_assigned_team_id: null,
      description: 'Reported stray in pond area.',
      created_at: new Date('2026-07-17T09:00:00Z')
    }
  })

  // Query 1 Match 2: Ticket ID 6 (RC-2026-0006)
  const tk6 = await prisma.ticket.create({
    data: {
      id: 6,
      subject: 'Rescue Case RC-2026-0006',
      incident_report_id: inc7.id,
      rescue_date: new Date('2026-07-17T10:15:00Z'),
      rescue_notes: 'Dispatched Bravo unit.',
      status: 'ASSIGNED',
      priority: 'High',
      current_assigned_team_id: team2.id, // Manager: Alice Green
      description: 'High priority stray rescue at 123 Talamban Rd, Cebu.',
      created_at: new Date('2026-07-17T10:15:00Z')
    }
  })

  // 8. Seed Animals
  // Query 5 & Query 1 Animal 2: Dino (linked to tk2 and shelter 2 Green Valley Sanctuary)
  const dino = await prisma.animal.create({
    data: {
      id: 2,
      name: 'Dino',
      species_id: dog.id,
      breed: 'Golden Retriever Mix',
      sex: 'Male',
      age_estimate: '3 years',
      weight: 24.0,
      condition: 'Fractured leg, dehydrated',
      status: 'Under Treatment',
      photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop',
      ticket_id: tk2.id,
      shelter_id: sh2.id,
      created_at: new Date('2026-07-15T09:30:00Z')
    }
  })

  // Ticket 6 Animal for Northside Animal Refuge (sh3)
  const buddy = await prisma.animal.create({
    data: {
      id: 6,
      name: 'Buddy',
      species_id: dog.id,
      breed: 'Askal Mix',
      sex: 'Male',
      age_estimate: '2 years',
      weight: 15.0,
      condition: 'Active, healthy',
      status: 'Intake',
      photo_url: null,
      ticket_id: tk6.id,
      shelter_id: sh3.id,
      created_at: new Date('2026-07-17T10:20:00Z')
    }
  })

  // Ticket 1 Animal for Safe Haven (sh1)
  await prisma.animal.create({
    data: {
      id: 1,
      name: 'Milo',
      species_id: cat.id,
      breed: 'Domestic Shorthair',
      sex: 'Male',
      age_estimate: '6 months',
      weight: 3.2,
      condition: 'Dehydrated',
      status: 'Under Treatment',
      ticket_id: tk1.id,
      shelter_id: sh1.id,
      created_at: new Date('2026-07-15T08:30:00Z')
    }
  })

  // Build remaining animals to hit exact Query 2 & Query 3 targets:
  // Query 3 Targets:
  // Dogs: 45 total (12 Intake, 8 Under Treatment, 20 Adopted, 5 Released)
  // Cats: 32 total (9 Intake, 5 Under Treatment, 15 Adopted, 3 Released)
  // Birds: 8 total (1 Intake, 2 Under Treatment, 0 Adopted, 5 Released)
  // Query 2 Active Shelter Occupancy Targets (Intake + Under Treatment):
  // Safe Haven (sh1): 22 active (1 created: Milo) -> 21 more active needed
  // Green Valley (sh2): 18 active (1 created: Dino) -> 17 more active needed
  // Northside (sh3): 8 active (1 created: Buddy) -> 7 more active needed
  // Total remaining active = 45 active animals (Intake: 12 Dog + 9 Cat + 1 Bird = 22 Intake; Under Treatment: 7 Dog + 4 Cat + 2 Bird = 13 Under Treatment; Other: 10 active)

  let sh1Count = 1 // Milo
  let sh2Count = 1 // Dino
  let sh3Count = 1 // Buddy

  const assignShelter = () => {
    if (sh1Count < 22) { sh1Count++; return sh1.id }
    if (sh2Count < 18) { sh2Count++; return sh2.id }
    sh3Count++; return sh3.id
  }

  // Create remaining Dogs (11 Intake, 7 Under Treatment, 20 Adopted, 5 Released)
  for (let i = 0; i < 11; i++) {
    await prisma.animal.create({
      data: {
        name: `Dog Intake ${i + 1}`,
        species_id: dog.id,
        breed: 'Local Breed',
        sex: i % 2 === 0 ? 'Male' : 'Female',
        age_estimate: '2 years',
        weight: 12.0 + i,
        condition: 'Intake evaluation',
        status: 'Intake',
        shelter_id: assignShelter()
      }
    })
  }

  for (let i = 0; i < 7; i++) {
    await prisma.animal.create({
      data: {
        name: `Dog Care ${i + 1}`,
        species_id: dog.id,
        breed: 'Labrador Mix',
        sex: i % 2 === 0 ? 'Female' : 'Male',
        age_estimate: '3 years',
        weight: 18.0 + i,
        condition: 'Under medical care',
        status: 'Under Treatment',
        shelter_id: assignShelter()
      }
    })
  }

  for (let i = 0; i < 20; i++) {
    await prisma.animal.create({
      data: {
        name: `Adopted Dog ${i + 1}`,
        species_id: dog.id,
        breed: 'Huskie Mix',
        sex: 'Male',
        age_estimate: '1 year',
        weight: 14.0,
        condition: 'Healthy',
        status: 'Adopted',
        shelter_id: sh1.id
      }
    })
  }

  for (let i = 0; i < 5; i++) {
    await prisma.animal.create({
      data: {
        name: `Released Dog ${i + 1}`,
        species_id: dog.id,
        breed: 'Native Dog',
        sex: 'Female',
        age_estimate: '4 years',
        weight: 16.0,
        condition: 'Rehabilitated',
        status: 'Released',
        shelter_id: sh2.id
      }
    })
  }

  // Create remaining Cats (9 Intake, 4 Under Treatment, 15 Adopted, 3 Released)
  for (let i = 0; i < 9; i++) {
    await prisma.animal.create({
      data: {
        name: `Cat Intake ${i + 1}`,
        species_id: cat.id,
        breed: 'Domestic Shorthair',
        sex: 'Female',
        age_estimate: '1 year',
        weight: 3.5,
        condition: 'Intake evaluation',
        status: 'Intake',
        shelter_id: assignShelter()
      }
    })
  }

  for (let i = 0; i < 4; i++) {
    await prisma.animal.create({
      data: {
        name: `Cat Care ${i + 1}`,
        species_id: cat.id,
        breed: 'Persian Mix',
        sex: 'Male',
        age_estimate: '2 years',
        weight: 4.0,
        condition: 'Under treatment',
        status: 'Under Treatment',
        shelter_id: assignShelter()
      }
    })
  }

  for (let i = 0; i < 15; i++) {
    await prisma.animal.create({
      data: {
        name: `Adopted Cat ${i + 1}`,
        species_id: cat.id,
        breed: 'Siamese Mix',
        sex: 'Female',
        age_estimate: '6 months',
        weight: 2.5,
        condition: 'Healthy',
        status: 'Adopted',
        shelter_id: sh1.id
      }
    })
  }

  for (let i = 0; i < 3; i++) {
    await prisma.animal.create({
      data: {
        name: `Released Cat ${i + 1}`,
        species_id: cat.id,
        breed: 'Tabby',
        sex: 'Male',
        age_estimate: '3 years',
        weight: 4.5,
        condition: 'Healthy',
        status: 'Released',
        shelter_id: sh2.id
      }
    })
  }

  // Create Birds (1 Intake, 2 Under Treatment, 0 Adopted, 5 Released)
  for (let i = 0; i < 1; i++) {
    await prisma.animal.create({
      data: {
        name: `Bird Intake ${i + 1}`,
        species_id: bird.id,
        breed: 'Parrot',
        sex: 'Unknown',
        age_estimate: '1 year',
        weight: 0.5,
        condition: 'Intake',
        status: 'Intake',
        shelter_id: assignShelter()
      }
    })
  }

  for (let i = 0; i < 2; i++) {
    await prisma.animal.create({
      data: {
        name: `Bird Care ${i + 1}`,
        species_id: bird.id,
        breed: 'Eagle',
        sex: 'Unknown',
        age_estimate: '2 years',
        weight: 1.5,
        condition: 'Wing injury',
        status: 'Under Treatment',
        shelter_id: assignShelter()
      }
    })
  }

  for (let i = 0; i < 5; i++) {
    await prisma.animal.create({
      data: {
        name: `Released Bird ${i + 1}`,
        species_id: bird.id,
        breed: 'Owl',
        sex: 'Unknown',
        age_estimate: '3 years',
        weight: 1.2,
        condition: 'Released to wild',
        status: 'Released',
        shelter_id: sh3.id
      }
    })
  }

  // 9. Seed Animal Treatments (Query 4 Target: Vet 1 = 18 treatments / 14 unique animals / 3 pending followups; Vet 2 = 12 treatments / 10 unique animals / 1 pending followup)
  const futureDate1 = new Date('2026-12-01')
  const futureDate2 = new Date('2026-12-15')
  const futureDate3 = new Date('2026-12-20')
  const pastDate = new Date('2026-05-01')

  const allAnimals = await prisma.animal.findMany()

  // Dr. Alice Vance (vet 1) -> 18 treatments total across 14 unique animals (3 pending followups)
  // Treatment 1 for Dino: Treatment ID 1
  await prisma.animal_Treatment.create({
    data: {
      id: 1,
      animal_id: dino.id,
      vet_agent_id: vet1.id,
      ticket_id: tk2.id,
      followup_date: futureDate1, // Pending followup 1
      diagnosis: 'Right tibia fracture and severe dehydration',
      treatment: 'Antibiotic treatment & fracture cast applied',
      medication: 'Clavamox 250mg, Subcutaneous IV fluids',
      notes: 'Cast applied successfully. Patient stable.',
      created_at: new Date('2026-07-15T11:00:00Z')
    }
  })

  // Create 17 more treatments for Vet 1 using 13 unique additional animals (total unique = 14)
  for (let i = 0; i < 17; i++) {
    const animalIndex = (i % 13) + 1 // Pick from first 13 animals in list
    const targetAnimal = allAnimals[animalIndex] || dino
    const isPending = i < 2 // 2 more pending followups (total = 3)

    await prisma.animal_Treatment.create({
      data: {
        animal_id: targetAnimal.id,
        vet_agent_id: vet1.id,
        followup_date: isPending ? (i === 0 ? futureDate2 : futureDate3) : pastDate,
        diagnosis: `Routine veterinary evaluation ${i + 1}`,
        treatment: 'Vaccination and physical therapy',
        medication: 'Rabies vaccine, Multivitamins',
        notes: 'Patient responding well to treatment plan.',
        created_at: new Date('2026-07-16T09:00:00Z')
      }
    })
  }

  // Dr. Marcus Wright (vet 2) -> 12 treatments across 10 unique animals (1 pending followup)
  for (let i = 0; i < 12; i++) {
    const animalIndex = (i % 10) + 14 // Pick from next 10 unique animals
    const targetAnimal = allAnimals[animalIndex] || dino
    const isPending = i === 0 // 1 pending followup for Vet 2

    await prisma.animal_Treatment.create({
      data: {
        animal_id: targetAnimal.id,
        vet_agent_id: vet2.id,
        followup_date: isPending ? futureDate1 : pastDate,
        diagnosis: `Clinical checkup ${i + 1}`,
        treatment: 'Deworming and hygiene care',
        medication: 'Ivermectin, Topical ointment',
        notes: 'Regular checkup completed.',
        created_at: new Date('2026-07-16T14:00:00Z')
      }
    })
  }

  // 10. Seed Activity Logs (Query 5 match: log_id 101, 104, 108, 112)
  await prisma.activityLog.create({
    data: {
      id: 101,
      entity_type: 'IncidentReport',
      entity_id: inc1.id, // 1
      action: 'Incident report submitted by Citizen',
      timestamp: new Date('2026-07-15T08:00:00Z'),
      user: 'Citizen Reporter'
    }
  })

  await prisma.activityLog.create({
    data: {
      id: 104,
      entity_type: 'RescueCase',
      entity_id: tk2.id, // 2
      action: 'Case RC-2026-0002 created & assigned',
      timestamp: new Date('2026-07-15T08:15:00Z'),
      user: 'Dispatcher'
    }
  })

  await prisma.activityLog.create({
    data: {
      id: 108,
      entity_type: 'Animal',
      entity_id: dino.id, // 2
      action: "Animal 'Dino' admitted to shelter",
      timestamp: new Date('2026-07-15T09:30:00Z'),
      user: 'Rescuer'
    }
  })

  await prisma.activityLog.create({
    data: {
      id: 112,
      entity_type: 'Treatment',
      entity_id: 1,
      action: 'Antibiotic treatment & fracture cast applied',
      timestamp: new Date('2026-07-15T11:00:00Z'),
      user: 'Veterinarian'
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
