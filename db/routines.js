/* eslint-disable no-useless-catch */
const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities")

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );


    return routine; 
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const{ rows: [routine] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id=$1
    `,
    [id]
    );
    if (!routine) {
      throw {
        name: "RoutineNotFoundError",
        message: "Could not find a routine with that id",
      };
      
    }
    return routine;
  } catch (error) {
    throw error
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      
      `SELECT *
     FROM routines
    `
    );
    return rows;
  } catch (error) {
    throw error
  }
}

async function getAllRoutines() {
  try {
    const { rows:routines } = await client.query(
      
      `SELECT routines.*, users.username AS "creatorName"
     FROM routines
     JOIN users ON routines."creatorId"=users.id
    `
    );
  
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows:routines } = await client.query(
      
      `SELECT routines.*, users.username AS "creatorName"
     FROM routines 
     JOIN users ON routines."creatorId"=users.id
     WHERE "isPublic"=true
    `
    );
  
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows:routines } = await client.query(
      
      `SELECT routines.*, users.username AS "creatorName"
     FROM routines 
     JOIN users ON routines."creatorId"=users.id
     WHERE username=$1 
    `,
    [username]
    );
  
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows:routines } = await client.query(
      
      `SELECT routines.*, users.username AS "creatorName"
     FROM routines 
     JOIN users ON routines."creatorId"=users.id
     WHERE username=$1 AND "isPublic"=true
    `,
    [username]
    );
  
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
  const { rows:routines } = await client.query(
      
    `SELECT routines.*, users.username AS "creatorName"
     FROM routines 
     JOIN users ON routines."creatorId"=users.id
     JOIN routine_activities ON routines.id=routine_activities."routineId"
     WHERE "isPublic"=true AND routine_activities."activityId"=$1
  `,
  [id]);

  return await attachActivitiesToRoutines(routines)
} catch (error) {
  throw error;
}


}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
