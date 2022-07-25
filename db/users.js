const client = require("./client");
const bcrypt = require('bcrypt');





// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = bcrypt.hash(password, SALT_COUNT)
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING username;
    `,
      [username, hashedPassword]
    );
    return user;
  } catch (error){
    console.error(error);
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT id, username
        FROM users
        WHERE username=${username}
        `);

    if(passwordsMatch) {
      return user;
    }
    else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }


}

async function getUserById(userId) {
try {
  const{
    rows: [user],
  } = await client.query(`
  SELECT id, username, password
  FROM users
  WHERE id=${userId}
  `)

  if (!user) {
    return null;
  }
  return user;
} catch (error) {
  console.error(error)
}
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username=$1;    
    `,
      [username]
    );

    return user;
  } catch (error) {
    console.error(error);
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
