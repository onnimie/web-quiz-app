import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as quizController from "./controllers/quizController.js";
import * as apiQuiz from "./apis/apiQuiz.js";
import * as authController from "./controllers/authController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics/:id", topicController.showTopic);
router.get("/topics", topicController.showTopics);
router.post("/topics/:id/delete", topicController.deleteTopic);
router.post("/topics", topicController.createTopic);

router.get("/topics/:id/questions/:qId", questionController.showQuestion);
router.post("/topics/:id/questions/:qId/options", questionController.addAnswerOption);
router.post("/topics/:id/questions/:qId/options/:oId/delete", questionController.deleteAnswerOption);
router.post("/topics/:id/questions/:qId/delete", questionController.deleteQuestion)
router.post("/topics/:id/questions", questionController.addQuestion);

router.get("/quiz", quizController.showTopics);
router.get("/quiz/:tId", quizController.getQuestionsForTopicAndAskThem);
router.get("/quiz/:tId/questions/:qId", quizController.askQuestion);
router.get("/quiz/:tId/questions/:qId/correct", quizController.showCorrectAnswerPage)
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.showIncorrectAnswerPage)
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.answerQuestion);

router.get("/api/questions/random", apiQuiz.sendRandomQuestion);
router.post("/api/questions/answer", apiQuiz.respondToAnswer);

router.get("/auth/register", authController.showRegistrationPage);
router.get("/auth/login", authController.showLoginPage);
router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.loginUser);

export { router };
