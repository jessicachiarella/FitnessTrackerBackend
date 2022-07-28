const express = require('express');
const { getAllActivities, createActivity, getActivityByName } = require('../db');
const router = express.Router();
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/', async (req, res, next) => {
    try {
      const allActivities = await getAllActivities();
      
        res.send(
            allActivities
        );
    
   } catch ({ name, message }) {
    next({ name, message })
   }   
});

// POST /api/activities
router.post('/', requireUser, async (req, res, next) => {
    const { name, description }  = req.body;
    const activityData = {};
    try {
        const _activity = await getActivityByName(name);
        if (_activity) {
            res.status(401);
            next({
              name: "ActivityExistsError",
              message: `An activity with name ${name} already exists`,
            })} else {
        activityData.name = name
        activityData.description = description
        const activity = await createActivity(activityData);
            res.send( activity )
        }}
    catch ({ name, message }) {
    next({ name, message });
  }
  });

// PATCH /api/activities/:activityId

module.exports = router;
