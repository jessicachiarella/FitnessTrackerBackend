const express = require('express');
const { getAllPublicRoutines, createRoutine } = require('../db');
const router = express.Router();
const { requireUser } = require("./utils");

// GET /api/routines
router.get('/', async (req, res, next) => {
    try {
      const allRoutines = await getAllPublicRoutines();
      
        res.send(
            allRoutines
        );
    
   } catch ({ name, message }) {
    next({ name, message })
   }   
});

// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
    const { name, goal, isPublic }  = req.body;
    const routineData = {};
    try {
        routineData.name = name
        routineData.goal = goal
        routineData.isPublic = isPublic
        routineData.creatorId = req.user.id
        const routine = await createRoutine(routineData);
            res.send( routine )
        }
    catch ({ name, message }) {
    next({ name, message });
  }
  });


// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
