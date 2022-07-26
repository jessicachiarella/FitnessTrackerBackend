const client = require("./client");

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
    console.error(error);
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
    console.error(error)
  }
}

async function getRoutinesWithoutActivities() {
  
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(
      
      `SELECT *
     FROM routines;
    `
    );

    return rows;
  } catch (error) {
    console.error(error)
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

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
