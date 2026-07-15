import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Seed Roles
  const dispatcherRole = await prisma.role.upsert({
    where: { role_name: 'Dispatcher' },
    update: {},
    create: { role_name: 'Dispatcher' }
  })
  const rescuerRole = await prisma.role.upsert({
    where: { role_name: 'Rescuer' },
    update: {},
    create: { role_name: 'Rescuer' }
  })
  const vetRole = await prisma.role.upsert({
    where: { role_name: 'Veterinarian' },
    update: {},
    create: { role_name: 'Veterinarian' }
  })
  const adminRole = await prisma.role.upsert({
    where: { role_name: 'Admin' },
    update: {},
    create: { role_name: 'Admin' }
  })

  // 2. Seed Species
  const dog = await prisma.species.upsert({
    where: { species_name: 'Dog' },
    update: {},
    create: { species_name: 'Dog' }
  })
  const cat = await prisma.species.upsert({
    where: { species_name: 'Cat' },
    update: {},
    create: { species_name: 'Cat' }
  })
  const bird = await prisma.species.upsert({
    where: { species_name: 'Bird' },
    update: {},
    create: { species_name: 'Bird' }
  })
  const other = await prisma.species.upsert({
    where: { species_name: 'Other' },
    update: {},
    create: { species_name: 'Other' }
  })

  // 3. Seed Shelters
  const sh1 = await prisma.shelter.create({
    data: {
      shelter_name: 'Green Valley Sanctuary',
      address: '124 Forest Rd, Green Valley',
      contact_number: '555-0111',
      capacity: 25
    }
  })
  const sh2 = await prisma.shelter.create({
    data: {
      shelter_name: 'Safe Haven Shelter',
      address: '789 Oak Ave, Riverdale',
      contact_number: '555-0122',
      capacity: 15
    }
  })
  const sh3 = await prisma.shelter.create({
    data: {
      shelter_name: 'Northside Animal Refuge',
      address: '456 Pines Hwy, Northport',
      contact_number: '555-0133',
      capacity: 10
    }
  })

  // 4. Seed Teams
  const t1 = await prisma.team.create({
    data: {
      team_name: 'USC Rescue Team',
      base_shelter_id: sh1.id
    }
  })
  const t2 = await prisma.team.create({
    data: {
      team_name: 'Riverside Volunteers',
      base_shelter_id: sh2.id
    }
  })

  // 5. Seed Agents
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const agentPassword = await bcrypt.hash('agent123', 10)

  // Admin User
  const adminAgent = await prisma.agent.create({
    data: {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@rescuehub.org',
      password: hashedPassword,
      phone: '555-0000',
      role_id: adminRole.id,
      status: 'Active'
    }
  })

  // Dispatcher
  const dispatcherAgent = await prisma.agent.create({
    data: {
      first_name: 'Alice',
      last_name: 'Green',
      email: 'alice.green@rescuehub.org',
      password: agentPassword,
      phone: '555-0011',
      role_id: dispatcherRole.id,
      status: 'Active'
    }
  })

  // Rescuers
  const res1 = await prisma.agent.create({
    data: {
      first_name: 'Mark',
      last_name: 'Davis',
      email: 'mark.davis@rescuehub.org',
      password: agentPassword,
      phone: '555-0199',
      role_id: rescuerRole.id,
      team_id: t1.id,
      status: 'Active'
    }
  })
  const res2 = await prisma.agent.create({
    data: {
      first_name: 'Linda',
      last_name: 'Jones',
      email: 'linda.jones@rescuehub.org',
      password: agentPassword,
      phone: '555-0188',
      role_id: rescuerRole.id,
      team_id: t2.id,
      status: 'Active'
    }
  })
  const res3 = await prisma.agent.create({
    data: {
      first_name: 'Robert',
      last_name: 'Chen',
      email: 'robert.chen@rescuehub.org',
      password: agentPassword,
      phone: '555-0177',
      role_id: rescuerRole.id,
      team_id: t1.id,
      status: 'Active'
    }
  })

  // Veterinarians
  const vet1 = await prisma.agent.create({
    data: {
      first_name: 'Alice',
      last_name: 'Vance',
      email: 'alice.vance@rescuehub.org',
      password: agentPassword,
      phone: '555-0155',
      role_id: vetRole.id,
      status: 'Active'
    }
  })

  // Set managers for teams
  await prisma.team.update({
    where: { id: t1.id },
    data: { manager_agent_id: res1.id }
  })
  await prisma.team.update({
    where: { id: t2.id },
    data: { manager_agent_id: res2.id }
  })

  // 6. Seed Incident Reports
  const inc1 = await prisma.incident_Report.create({
    data: {
      reporter_name: 'John Smith',
      contact_number: '555-0123',
      is_anonymous: false,
      species_id: cat.id,
      severity: 'Medium',
      status: 'Approved',
      location: '12 Maple St, Riverside',
      latitude: 10.354,
      longitude: 123.912,
      description: 'Stray kitten stuck inside a stormwater drain. Meowing loudly.'
    }
  })
  const inc2 = await prisma.incident_Report.create({
    data: {
      reporter_name: 'Alice Cooper',
      contact_number: '555-0124',
      is_anonymous: false,
      species_id: dog.id,
      severity: 'Critical',
      status: 'Approved',
      location: 'Highway 101, Mile Marker 45',
      latitude: 10.362,
      longitude: 123.895,
      description: 'Dog seen running along the median. Looks scared and exhausted.'
    }
  })
  const inc3 = await prisma.incident_Report.create({
    data: {
      reporter_name: 'Anonymous',
      is_anonymous: true,
      species_id: bird.id,
      severity: 'Low',
      status: 'Pending',
      location: 'Central Park, Pond Area',
      latitude: 10.315,
      longitude: 123.902,
      description: 'Geese with plastic ring caught around its neck. Struggling to eat.'
    }
  })

  // 7. Seed Tickets (Rescue Cases)
  const tk1 = await prisma.ticket.create({
    data: {
      subject: 'Rescue Case for inc-1',
      incident_report_id: inc1.id,
      rescue_date: new Date('2026-06-16T11:30:00Z'),
      rescue_notes: 'Kitten was shivering and wet. Transferred to Safe Haven.',
      status: 'UNDER_TREATMENT',
      priority: 'Medium',
      current_assigned_team_id: t2.id,
      description: 'Stray kitten stuck inside a stormwater drain. Meowing loudly.'
    }
  })
  const tk2 = await prisma.ticket.create({
    data: {
      subject: 'Rescue Case for inc-2',
      incident_report_id: inc2.id,
      rescue_date: new Date('2026-06-17T09:15:00Z'),
      rescue_notes: 'Friendly dog, easily lured with treats. Dehydrated.',
      status: 'UNDER_TREATMENT',
      priority: 'Critical',
      current_assigned_team_id: t1.id,
      description: 'Dog seen running along the median. Looks scared and exhausted.'
    }
  })

  // 8. Seed Animals
  const ani1 = await prisma.animal.create({
    data: {
      name: 'Bella',
      species_id: dog.id,
      breed: 'Golden Retriever Mix',
      sex: 'Female',
      age_estimate: '2 years',
      weight: 22.5,
      condition: 'Malnourished, minor lacerations',
      status: 'Under Treatment',
      photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop',
      ticket_id: tk2.id,
      shelter_id: sh1.id
    }
  })
  const ani2 = await prisma.animal.create({
    data: {
      name: 'Milo',
      species_id: cat.id,
      breed: 'Domestic Shorthair',
      sex: 'Male',
      age_estimate: '6 months',
      weight: 3.2,
      condition: 'Dehydrated, respiratory infection',
      status: 'Under Treatment',
      photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      ticket_id: tk1.id,
      shelter_id: sh2.id
    }
  })
  const ani3 = await prisma.animal.create({
    data: {
      name: 'Rocky',
      species_id: dog.id,
      breed: 'Boxer Mix',
      sex: 'Male',
      age_estimate: '4 years',
      weight: 28.0,
      condition: 'Recovered and active',
      status: 'Recovered',
      photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
      shelter_id: sh1.id
    }
  })

  // Update tickets with animal ids
  await prisma.ticket.update({
    where: { id: tk1.id },
    data: { subject: `Rescue Case for Milo (${cat.species_name})` }
  })
  await prisma.ticket.update({
    where: { id: tk2.id },
    data: { subject: `Rescue Case for Bella (${dog.species_name})` }
  })

  // 9. Seed Animal Treatments
  await prisma.animal_Treatment.create({
    data: {
      animal_id: ani1.id,
      vet_agent_id: vet1.id,
      ticket_id: tk2.id,
      followup_date: new Date('2026-06-24'),
      diagnosis: 'Severe dehydration and minor cuts',
      treatment: 'Wound disinfection, IV fluid hydration',
      medication: 'Clavamox, subcutaneous fluids',
      notes: 'Monitor diet closely. Dog needs high-calorie intake.'
    }
  })
  await prisma.animal_Treatment.create({
    data: {
      animal_id: ani2.id,
      vet_agent_id: vet1.id,
      ticket_id: tk1.id,
      followup_date: new Date('2026-06-23'),
      diagnosis: 'Upper respiratory infection',
      treatment: 'Basic checkup, cleaning nasal passages',
      medication: 'L-Lysine, Clavamox drops',
      notes: 'Keep in warm isolation room.'
    }
  })

  // 10. Seed Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        entity_type: 'IncidentReport',
        entity_id: inc1.id,
        action: 'Incident report submitted by John Smith',
        user: 'Citizen Reporter'
      },
      {
        entity_type: 'RescueCase',
        entity_id: tk1.id,
        action: `Rescue Case RC-2026-0001 created from Incident Report`,
        user: 'Dispatcher'
      },
      {
        entity_type: 'RescueCase',
        entity_id: tk1.id,
        action: 'Case status updated to ASSIGNED. Rescuer Linda Jones assigned',
        user: 'Dispatcher'
      },
      {
        entity_type: 'Treatment',
        entity_id: 1,
        action: 'Treatment recorded for Milo: Upper respiratory infection diagnosis',
        user: 'Dr. Alice Vance'
      }
    ]
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
