import { executeQuery } from "../database/database.js";


const getTopics = async () => {
    const res = await executeQuery("SELECT * FROM topics ORDER BY name;");
    return res.rows;
};

const getTopic = async (id) => {
    const res = await executeQuery("SELECT * FROM topics WHERE id = $1;", id);
    return res.rows[0];
};

const createTopic = async (name, user) => {
    await executeQuery("INSERT INTO topics (user_id, name) VALUES ($1, $2);", user, name);
};

const deleteTopic = async (id) => {
    await executeQuery("DELETE FROM topics WHERE id = $1", id);
};

const getNumberOfTopics = async () => {
    const res = await executeQuery("SELECT COUNT(*) FROM topics;");
    return res.rows[0].count;
};



export { getTopics, getTopic, createTopic, deleteTopic, getNumberOfTopics };