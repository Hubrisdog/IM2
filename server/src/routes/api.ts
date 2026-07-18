import { Router } from 'express'
import { authenticateToken, requireRole } from '../middlewares/auth'
import * as authCtrl from '../controllers/authController'
import * as incCtrl from '../controllers/incidentController'
import * as tkCtrl from '../controllers/ticketController'
import * as aniCtrl from '../controllers/animalController'
import * as agCtrl from '../controllers/agentController'
import * as shCtrl from '../controllers/shelterController'
import * as trtCtrl from '../controllers/treatmentController'
import * as teamCtrl from '../controllers/teamController'
import * as spCtrl from '../controllers/speciesController'
import * as roleCtrl from '../controllers/roleController'
import * as logCtrl from '../controllers/logController'

const router = Router()

// --- Public / Auth Routes ---
router.post('/auth/login', authCtrl.login)
router.post('/auth/register', authCtrl.register)
router.get('/auth/me', authenticateToken, authCtrl.getMe)

// --- Incidents (Reporting is public, management is protected) ---
router.get('/incidents', authenticateToken, incCtrl.getIncidents)
router.post('/incidents', incCtrl.createIncident) // public entry for citizen reports
router.put('/incidents/:id', authenticateToken, requireRole(['Admin', 'Dispatcher']), incCtrl.updateIncident)
router.delete('/incidents/:id', authenticateToken, requireRole(['Admin']), incCtrl.deleteIncident)
router.post('/incidents/:id/promote', authenticateToken, requireRole(['Admin', 'Dispatcher']), incCtrl.promoteIncident)

// --- Tickets (Rescue Cases) ---
router.get('/tickets', authenticateToken, tkCtrl.getTickets)
router.post('/tickets', authenticateToken, requireRole(['Admin', 'Dispatcher']), tkCtrl.createTicket)
router.put('/tickets/:id', authenticateToken, requireRole(['Admin', 'Dispatcher', 'Rescuer']), tkCtrl.updateTicket)
router.delete('/tickets/:id', authenticateToken, requireRole(['Admin']), tkCtrl.deleteTicket)

// --- Animals ---
router.get('/animals', authenticateToken, aniCtrl.getAnimals)
router.post('/animals', authenticateToken, requireRole(['Admin', 'Dispatcher']), aniCtrl.createAnimal)
router.put('/animals/:id', authenticateToken, requireRole(['Admin', 'Dispatcher', 'Veterinarian']), aniCtrl.updateAnimal)
router.delete('/animals/:id', authenticateToken, requireRole(['Admin']), aniCtrl.deleteAnimal)

// --- Agents (Rescuers) ---
router.get('/agents', authenticateToken, agCtrl.getAgents)
router.post('/agents', authenticateToken, requireRole(['Admin', 'Dispatcher']), agCtrl.createAgent)
router.put('/agents/:id', authenticateToken, requireRole(['Admin', 'Dispatcher']), agCtrl.updateAgent)
router.delete('/agents/:id', authenticateToken, requireRole(['Admin']), agCtrl.deleteAgent)

// --- Shelters ---
router.get('/shelters', authenticateToken, shCtrl.getShelters)
router.post('/shelters', authenticateToken, requireRole(['Admin', 'Dispatcher']), shCtrl.createShelter)
router.put('/shelters/:id', authenticateToken, requireRole(['Admin', 'Dispatcher']), shCtrl.updateShelter)
router.delete('/shelters/:id', authenticateToken, requireRole(['Admin']), shCtrl.deleteShelter)

// --- Animal Treatments (Only Vets & Admins can mutate) ---
router.get('/treatments', authenticateToken, trtCtrl.getTreatments)
router.post('/treatments', authenticateToken, requireRole(['Admin', 'Veterinarian']), trtCtrl.createTreatment)
router.put('/treatments/:id', authenticateToken, requireRole(['Admin', 'Veterinarian']), trtCtrl.updateTreatment)
router.delete('/treatments/:id', authenticateToken, requireRole(['Admin']), trtCtrl.deleteTreatment)

// --- Teams ---
router.get('/teams', authenticateToken, teamCtrl.getTeams)
router.post('/teams', authenticateToken, requireRole(['Admin', 'Dispatcher']), teamCtrl.createTeam)
router.put('/teams/:id', authenticateToken, requireRole(['Admin', 'Dispatcher']), teamCtrl.updateTeam)
router.delete('/teams/:id', authenticateToken, requireRole(['Admin']), teamCtrl.deleteTeam)

// --- Species Lookup ---
router.get('/species', authenticateToken, spCtrl.getSpecies)
router.post('/species', authenticateToken, requireRole(['Admin']), spCtrl.createSpecies)
router.delete('/species/:id', authenticateToken, requireRole(['Admin']), spCtrl.deleteSpecies)

// --- Roles Lookup ---
router.get('/roles', authenticateToken, requireRole(['Admin']), roleCtrl.getRoles)
router.post('/roles', authenticateToken, requireRole(['Admin']), roleCtrl.createRole)

// --- Activity Logs (Only Admins can view full audit trail logs) ---
router.get('/logs', authenticateToken, requireRole(['Admin']), logCtrl.getActivityLogs)

export default router
