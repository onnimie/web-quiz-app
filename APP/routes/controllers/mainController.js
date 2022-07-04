import * as topicServices from "../../services/topicServices.js";
import * as questionServices from "../../services/questionServices.js";

const showMain = async (context) => {

  const data = {};

  data.nof_topics = await topicServices.getNumberOfTopics();
  data.nof_questions = await questionServices.getNumberOfQuestions();
  data.nof_answers = await questionServices.getNumberOfAnswers();

  const auth = await context.state.session.get("authenticated");
  if (auth) {
    const session_user = await context.state.session.get("user");
    data.user_email = session_user.email;
    data.authenticated = true;
  }
  

  context.render("main.eta", data);
};




export { showMain };
