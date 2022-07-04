import * as topicServices from "../../services/topicServices.js";
import * as questionServices from "../../services/questionServices.js";

// this is for possibly implementing a random question system where the same question can't occur twice before other questions
// NOT YET implemented (the project specs don't allow this)
const quizData = {
    questions: [],
    index_for_current_question: 0,
};

const showTopics = async (context) => {
    const topicsRows = await topicServices.getTopics();

    const data = {
        topics: topicsRows,
    };

    context.render("quizTopics.eta", data);
};

const getQuestionsForTopicAndAskThem = async (context) => {
    const topic_id = context.params.tId;

    quizData.questions = await questionServices.getQuestionsRandomlyForTopic(topic_id);
    quizData.index_for_current_question = 0;
    const firstQuestion = quizData.questions[0];

    if (quizData.questions.length == 0) {

        // this is just a modified showTopics-function
        const topicsRows = await topicServices.getTopics();
        const data = {
            topics: topicsRows,
            tId_without_questions: topic_id,
        };
        context.render("quizTopics.eta", data);

    } else {

        const question_id = firstQuestion.id;
        context.response.redirect(`/quiz/${topic_id}/questions/${question_id}`);
    }
    
};

const askQuestion = async (context) => {
    const topic_id = context.params.tId;
    const question_id = context.params.qId;

    const question = await questionServices.getQuestion(question_id);
    const answer_options = await questionServices.getAnswerOptions(question_id);

    const data = {
        topicId: topic_id,
        questionId: question_id,
        questionText: question.question_text,
        answerOptions: answer_options,
    };

    context.render("quizQuestion.eta", data);
};

const answerQuestion = async (context) => {
    const topic_id = context.params.tId;
    const question_id = context.params.qId;
    const option_id = context.params.oId;

    const chosen_answer_option = await questionServices.getAnswerOption(option_id);
    const is_correct = chosen_answer_option.is_correct;

    // STORE USER ANSWER HERE TO THE DATABASE
    const session_user = await context.state.session.get("user");
    const user_id = session_user.id;
    await questionServices.addQuestionAnswer(user_id, question_id, option_id);

    if (is_correct) {
        context.response.redirect(`/quiz/${topic_id}/questions/${question_id}/correct`);
    } else {
        context.response.redirect(`/quiz/${topic_id}/questions/${question_id}/incorrect`);
    }
};

const showCorrectAnswerPage = async (context) => {
    const topic_id = context.params.tId;
    const data = {
        topicId: topic_id,
    };

    context.render("quizCorrect.eta", data);
};

const showIncorrectAnswerPage = async (context) => {
    const topic_id = context.params.tId;
    const question_id = context.params.qId;

    const data = {
        topicId: topic_id,
    };

    // get the correct answer option
    function isCorrectAnswer(answer) {
        return answer.is_correct;
    }
    const answer_options = await questionServices.getAnswerOptions(question_id);
    const correct_answer_option = answer_options.find(isCorrectAnswer);

    

    if (correct_answer_option == undefined) {
        data.correctAnswerText = "[THERE WERE NO CORRECT ANSWERS...]"
    } else {
        data.correctAnswerText = correct_answer_option.option_text
    }
    

    context.render("quizIncorrect.eta", data);
};


export { showTopics,
    getQuestionsForTopicAndAskThem,
    askQuestion,
    answerQuestion,
    showCorrectAnswerPage,
    showIncorrectAnswerPage };