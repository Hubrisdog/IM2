import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth'
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
router.put('/incidents/:id', authenticateToken, incCtrl.updateIncident)
router.delete('/incidents/:id', authenticateToken, incCtrl.deleteIncident)
router.post('/incidents/:id/promote', authenticateToken, incCtrl.promoteIncident)

// --- Tickets (Rescue Cases) ---
router.get('/tickets', authenticateToken, tkCtrl.getTickets)
router.post('/tickets', authenticateToken, tkCtrl.createTicket)
router.put('/tickets/:id', authenticateToken, tkCtrl.updateTicket)
router.delete('/tickets/:id', authenticateToken, tkCtrl.deleteTicket)

// --- Animals ---
router.get('/animals', authenticateToken, aniCtrl.getAnimals)
router.post('/animals', authenticateToken, aniCtrl.createAnimal)
router.put('/animals/:id', authenticateToken, aniCtrl.updateAnimal)
router.delete('/animals/:id', authenticateToken, aniCtrl.deleteAnimal)

// --- Agents (Rescuers) ---
router.get('/agents', authenticateToken, agCtrl.getAgents)
router.post('/agents', authenticateToken, agCtrl.createAgent)
router.put('/agents/:id', authenticateToken, agCtrl.updateAgent)
router.delete('/agents/:id', authenticateToken, agCtrl.deleteAgent)

// --- Shelters ---
router.get('/shelters', authenticateToken, shCtrl.getShelters)
router.post('/shelters', authenticateToken, shCtrl.createShelter)
router.put('/shelters/:id', authenticateToken, shCtrl.updateShelter)
router.delete('/shelters/:id', authenticateToken, shCtrl.deleteShelter)

// --- Animal Treatments ---
router.get('/treatments', authenticateToken, trtCtrl.getTreatments)
router.post('/treatments', authenticateToken, trtCtrl.createTreatment)
router.put('/treatments/:id', authenticateToken, trtCtrl.updateTreatment)
router.delete('/treatments/:id', authenticateToken, trtCtrl.deleteTreatment)

// --- Teams ---
router.get('/teams', authenticateToken, teamCtrl.getTeams)
router.post('/teams', authenticateToken, teamCtrl.createTeam)
router.put('/teams/:id', authenticateToken, teamCtrl.updateTeam)
router.delete('/teams/:id', authenticateToken, teamCtrl.deleteTeam)

// --- Species Lookup ---
router.get('/species', authenticateToken, spCtrl.getSpecies)
router.post('/species', authenticateToken, spCtrl.createSpecies)
router.delete('/species/:id', authenticateToken, spCtrl.deleteSpecies)

// --- Roles Lookup ---
router.get('/roles', authenticateToken, roleCtrl.getRoles)
router.post('/roles', authenticateToken, roleCtrl.createRole)

// --- Activity Logs ---
router.get('/logs', authenticateToken, logCtrl.getActivityLogs)

export default router
