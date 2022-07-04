import * as topicServices from "../../services/topicServices.js";
import * as questionServices from "../../services/questionServices.js";
import { validasaur } from "../../deps.js";


const addQuestion = async (context) => {
    const body = context.request.body();
    const params = await body.value;

    const data = {
        questionText: params.get("question_text"),
    };

    const validationRules = {
        questionText: [validasaur.required, validasaur.minLength(1)],
    };
    const [passes, errors] = await validasaur.validate(data, validationRules);

    const session_user = await context.state.session.get("user");
    const authenticated = await context.state.session.get("authenticated");
    data.userId = session_user.id;
    data.topicId = context.params.id;

    if (passes && authenticated) {

        await questionServices.createQuestion(data.topicId, data.userId, data.questionText);
        context.response.redirect(`/topics/${data.topicId}`);

    } else {

        data.errors = errors;

        const topic = await topicServices.getTopic(data.topicId);
        data.topicName = topic.name;
        data.questions = await questionServices.getQuestionsForTopic(data.topicId);

        context.render("topic.eta", data);
    }
};

const showQuestion = async (context) => {
    const question_id = context.params.qId;
    const topic_id = context.params.id;

    const question = await questionServices.getQuestion(question_id);
    const topic = await topicServices.getTopic(topic_id);

    const answer_options = await questionServices.getAnswerOptions(question_id);

    const data = {
        questionId: question_id,
        topicName: topic.name,
        topicId: topic_id,
        questionText: question.question_text,
        answerOptions: answer_options,
    };

    context.render("question.eta", data);
};

const addAnswerOption = async (context) => {
    const body = context.request.body();
    const parameters = await body.value;

    const question_id = context.params.qId;
    const topic_id = context.params.id; 
    const option_text = parameters.get("option_text");
    const is_correct = parameters.has("is_correct");

    const data = {
        answerOptionText: option_text,
        isCorrect: is_correct,
    };

    const validationRules = {
        answerOptionText: [validasaur.required, validasaur.minLength(1)],
    };
    const [passes, errors] = await validasaur.validate(data, validationRules);
    const authenticated = await context.state.session.get("authenticated");

    if (passes && authenticated) {

        await questionServices.createAnswerOption(question_id, option_text, is_correct);
        context.response.redirect(`/topics/${topic_id}/questions/${question_id}`);

    } else {

        data.errors = errors;

        // get required data to render question.eta-page correctly
        data.questionId = question_id;
        data.topicId = topic_id;
        const topic = await topicServices.getTopic(topic_id);
        const question = await questionServices.getQuestion(question_id);
        const answer_options = await questionServices.getAnswerOptions(question_id);
        data.topicName = topic.name;
        data.questionText = question.question_text;
        data.answerOptions = answer_options;

        context.render("question.eta", data);
    }
};

const deleteAnswerOption = async (context) => {
    const topic_id = context.params.id;
    const question_id = context.params.qId;
    const option_id = context.params.oId;

    const authenticated = await context.state.session.get("authenticated");
    if (authenticated) {
        await questionServices.deleteAnswersForOption(option_id);
        await questionServices.deleteAnswerOption(option_id);
    }
    
    context.response.redirect(`/topics/${topic_id}/questions/${question_id}`);
};

const deleteQuestion = async (context) => {
    const topic_id = context.params.id;
    const question_id = context.params.qId;
    
    const authenticated = await context.state.session.get("authenticated");
    if (authenticated) {
        await questionServices.deleteQuestion(question_id);
    }

    context.response.redirect(`/topics/${topic_id}`);
};



export { addQuestion, showQuestion, addAnswerOption, deleteAnswerOption, deleteQuestion };