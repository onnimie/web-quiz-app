import * as topicServices from "../../services/topicServices.js";
import * as questionServices from "../../services/questionServices.js";
import { validasaur } from "../../deps.js";

const validationRules = {
    topicName: [validasaur.required, validasaur.minLength(1)],
};

const showTopics = async (context) => {
    const topicsRows = await topicServices.getTopics();
    const session_user = await context.state.session.get("user");
    const user_is_admin = session_user.admin;

    const data = {
        topics: topicsRows,
        userIsAdmin: user_is_admin,
    };

    context.render("topics.eta", data);
};

const showTopic = async (context) => {
    const id = context.params.id;
    const topic = await topicServices.getTopic(id);

    const questions = await questionServices.getQuestionsForTopic(id);

    const data = {
        topicName: topic.name,
        questions: questions,
        topicId: topic.id,
    };

    context.render("topic.eta", data);
};

const createTopic = async (context) => {
    const body = context.request.body();
    const params = await body.value;

    const topic_name = params.get("name");
    const session_user = await context.state.session.get("user");
    const user_id = session_user.id;

    const data = {
        topicName: topic_name,
    };

    if (session_user.admin) {

        const [passes, errors] = await validasaur.validate(data, validationRules);

        if (passes) {

            await topicServices.createTopic(topic_name, user_id);
            context.response.redirect("/topics");

        } else {

            data.errors = errors;
            data.userIsAdmin = session_user.admin;
            data.topics = await topicServices.getTopics();
            context.render("topics.eta", data)
        }
    } else {

        data.authFailed = true;
        data.topics = await topicServices.getTopics();
        context.render("topics.eta", data)
    }
};

const deleteTopic = async (context) => {
    const topic_id = context.params.id;
    const session_user = await context.state.session.get("user");
    const user_is_admin = session_user.admin;

    if (user_is_admin) {

        await questionServices.deleteQuestionsAndAnswersForTopic(topic_id);
        await topicServices.deleteTopic(topic_id);
    
        context.response.redirect("/topics");
    }
};



export { showTopics, showTopic, createTopic, deleteTopic };