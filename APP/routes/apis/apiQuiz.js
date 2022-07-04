import * as topicServices from "../../services/topicServices.js";
import * as questionServices from "../../services/questionServices.js";

const sendRandomQuestion = async (context) => {
    /* EXAMPLE RESPONSE OBJECT
    {
        "questionId": 1,
        "questionText": "How much is 1+1?",
        "answerOptions": [
          { "optionId": 1, "optionText": "2" },
          { "optionId": 2, "optionText": "4" },
          { "optionId": 3, "optionText": "6" },
        ]
    }
    */

    const questions_list = await questionServices.getRandomQuestions();

    if (questions_list.length == 0) {
        
        context.response.body = {};

    } else {

        const question = questions_list[0];
        const answer_options = await questionServices.getAnswerOptions(question.id);

        const answer_options_mapped = answer_options.map(map_function);

        const data = {
            questionId: question.id,
            questionText: question.question_text,
            answerOptions: answer_options_mapped,
        };

        context.response.body = data;

    } 
};

function map_function(option) {
    return {
        optionId: option.id,
        optionText: option.option_text,
    };
};

const respondToAnswer = async (context) => {
    /* EXAMPLE REQUEST OBJECT
    {
        "questionId": 1,
        "optionId": 3,
    }
    */

    const body = context.request.body({ type: "json" });
    const document = await body.value;

    const question_id = document.questionId;
    const option_id = document.optionId;

    // get the correct answer option
    function isCorrectAnswer(answer) {
        return answer.is_correct;
    }
    const answer_options = await questionServices.getAnswerOptions(question_id);
    const correct_answer_option = answer_options.find(isCorrectAnswer);

    if (correct_answer_option == undefined) { //One of the id's included in the request are non existent in database
        context.response.body = {correct: false};

    } else {
        const is_correct = option_id == correct_answer_option.id;
        const data = {
        correct: is_correct,
        };

        context.response.body = data;
    }
};


export { sendRandomQuestion, respondToAnswer  }