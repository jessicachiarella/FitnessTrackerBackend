const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  getRoutineActivityById,
  updateRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { duration, count } = req.body;

  try {
    const id = req.params.routineActivityId;
    const originalRoutineAct = await getRoutineActivityById(routineActivityId);
    const activityId = originalRoutineAct.activityId;
    const routineId = originalRoutineAct.routineId;
    const originalRoutine = await getRoutineById(routineId);
    if (originalRoutine.creatorId !== req.user.id) {
      res.status(403);
      next({
        name: "UnauthorizedUpdaterError",
        message: `User ${req.user.username} is not allowed to update ${originalRoutine.name}`,
      });
    } else {
      const updatedRoutineAct = await updateRoutineActivity({
        id,
        routineId,
        activityId,
        duration,
        count,
      });
      res.send(updatedRoutineAct);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routine_activities/:routineActivityId

router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;

  try {
    const routineAct = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineAct.id);
    if (routine.creatorId !== req.user.id) {
      res.status(403);
      next({
        name: "User not found",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    } else {
      await destroyRoutineActivity(routineAct.id);
      res.send(routineAct);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
