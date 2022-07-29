const express = require('express');
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine } = require('../db');
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
router.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { name, goal, isPublic } = req.body;
    
    try {
        const id = req.params.routineId
    const originalRoutine = await getRoutineById(routineId);
    if(originalRoutine.creatorId !== req.user.id){
        res.status(403);
        next({
            name: 'UnauthorizedUpdaterError',
            message: `User ${req.user.username} is not allowed to update ${originalRoutine.name}`

        });}

        else{
            const updatedRoutine = await updateRoutine({id: id, name, goal, isPublic});
            res.send( updatedRoutine )}
  
    }
    
     catch ({ name, message }) {
      next({ name, message });
    }
  });

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
