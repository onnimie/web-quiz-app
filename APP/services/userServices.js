import { executeQuery } from "../database/database.js";


const createUser = async (email, password, is_admin) => {
    await executeQuery("INSERT INTO users (email, admin, password) VALUES ($1, $2, $3);", email, is_admin, password);
};

const getUserArrayByEmail = async (email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    return res.rows;
};

const getUser = async (id) => {
    const res = await executeQuery("SELECT * FROM users WHERE id = $1;", id);
    return res.rows[0];
};

const getNumberOfUsers = async () => {
    const res = await executeQuery("SELECT COUNT(*) FROM users;");
    return res.rows[0];
};



export { createUser, getUserArrayByEmail, getUser, getNumberOfUsers };