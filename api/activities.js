const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getPublicRoutinesByActivity,
  getActivityById,
  updateActivity,
} = require("../db");
const router = express.Router();
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const activities = await getPublicRoutinesByActivity({ id: activityId });
    if (!activities.length) {
      next({
        name: "ActivityDoesn'tExistError",
        message: `Activity ${activityId} not found`,
      });
    } else {
      res.send(activities);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const activityData = {};
  try {
    const _activity = await getActivityByName(name);
    if (_activity) {
      res.status(401);
      next({
        name: "ActivityExistsError",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      activityData.name = name;
      activityData.description = description;
      const activity = await createActivity(activityData);
      res.send(activity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const updateFields = { id: activityId };

  if (name) {
    updateFields.name = name;
  }

  if (description) {
    updateFields.description = description;
  }
  try {
    const originalActivity = await getActivityById(activityId);
    const activityName = await getActivityByName(name);
    if (!originalActivity) {
      next({
        name: "ActivityNotFoundError",
        message: `Activity ${activityId} not found`,
      });
    } else if (activityName) {
      next({
        name: "NameAlreadyExists",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const updatedActivity = await updateActivity(updateFields);
      res.send(updatedActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
