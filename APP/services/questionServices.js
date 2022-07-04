import { executeQuery } from "../database/database.js";

const getQuestionsForTopic = async (topic_id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE topic_id = $1;", topic_id);

    return res.rows;
};

const deleteQuestionsAndAnswersForTopic = async (topic_id) => {
    const questions = await getQuestionsForTopic(topic_id);

    for await (const question of questions) {
        const question_id = question.id;
        await deleteQuestionAnswers(question_id);
        await deleteQuestionAnswerOptions(question_id);
        await deleteQuestion(question_id);

    }
    
};

const deleteQuestionAnswers = async (question_id) => {
    await executeQuery("DELETE FROM question_answers WHERE question_id = $1;", question_id);
};

const deleteQuestionAnswerOptions = async (question_id) => {
    await executeQuery("DELETE FROM question_answer_options WHERE question_id = $1;", question_id);
};

const createQuestion = async (topic_id, user_id, question_text) => {
    await executeQuery("INSERT INTO questions (user_id, topic_id, question_text) VALUES ($1, $2, $3);", user_id, topic_id, question_text);
};

const getQuestion = async (id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE id = $1;", id);
    return res.rows[0];
};

const deleteQuestion = async (id) => {
    await executeQuery("DELETE FROM questions WHERE id = $1;", id);
};

const getAnswerOptions = async (question_id) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1;", question_id);
    return res.rows;
};

const getAnswerOption = async (option_id) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE id = $1;", option_id);
    return res.rows[0];
};

const createAnswerOption = async (question_id, option_text, is_correct) => {
    await executeQuery("INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($1, $2, $3);", question_id, option_text, is_correct);
};

const deleteAnswerOption = async (option_id) => {
    await executeQuery("DELETE FROM question_answer_options WHERE id = $1;", option_id);
};

const deleteAnswersForOption = async (option_id) => {
    await executeQuery("DELETE FROM question_answers WHERE question_answer_option_id = $1;", option_id);
};

const getQuestionsRandomlyForTopic = async (topic_id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE topic_id = $1 ORDER BY RANDOM();", topic_id);
    return res.rows;
};

const getRandomQuestions = async () => {
    const res = await executeQuery("SELECT * FROM questions ORDER BY RANDOM();");
    return res.rows;
};

const addQuestionAnswer = async (user_id, question_id, option_id) => {
    await executeQuery("INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES ($1, $2, $3);", user_id, question_id, option_id);
};

const getNumberOfQuestions = async () => {
    const res = await executeQuery("SELECT COUNT(*) FROM questions;");
    return res.rows[0].count;
};

const getNumberOfAnswers = async () => {
    const res = await executeQuery("SELECT COUNT(*) FROM question_answers;");
    return res.rows[0].count;
};



export { getQuestionsForTopic,
    deleteQuestionsAndAnswersForTopic,
    createQuestion,
    getQuestion,
    deleteQuestion,
    getAnswerOptions,
    getAnswerOption,
    createAnswerOption,
    deleteAnswerOption,
    deleteAnswersForOption,
    getQuestionsRandomlyForTopic,
    getRandomQuestions,
    addQuestionAnswer,
    getNumberOfAnswers,
    getNumberOfQuestions };