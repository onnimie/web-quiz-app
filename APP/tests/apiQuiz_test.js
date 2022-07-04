import { app } from "../app.js";
import { superoak, assertEquals } from "../deps.js";
import { getNumberOfQuestions } from "../services/questionServices.js";


// Test API quiz for json object
Deno.test({
    name: "API request for random question should return a json object",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/questions/random").expect(200)
        .expect("Content-Type", new RegExp("application/json"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});


// Test API quiz's json object for its attributes
Deno.test("API request for random question should return a json object of correct format", async () => {
    const testClient = await superoak(app);
    const http_response = await testClient.get("/api/questions/random").expect(200)
    .expect("Content-Type", new RegExp("application/json"))

    const response = http_response.body;
    const nof_questions = await getNumberOfQuestions();
    if (nof_questions != 0) {

        assertEquals((new RegExp("\d*")).test(response.questionId), true);
        assertEquals((new RegExp(".*")).test(response.questionText), true);
        assertEquals(Array.isArray(response.answerOptions), true);

    } else {

        assertEquals(JSON.stringify(response), "{}");

    }
});


// Test API random question for allowed cross origin resource sharing
Deno.test("API random question should have CORS allowed", async () => {
    const testClient = await superoak(app);
    const http_response = await testClient.get("/api/questions/random").expect(200)
    .expect("Access-Control-Allow-Origin", "*");
    //console.log(http_response);
});


// Test API for json object response to posted question answer
Deno.test("API should send a json response to a posted question answer", async () => {
    const testClient = await superoak(app);
    const data = {questionId: 0, optionId: 0};
    const http_response = await testClient.post("/api/questions/answer")
    .send(data)
    .expect(200)
    .expect("Content-Type", new RegExp("application/json"));
});


// Test API question answer response for correct format
Deno.test("API response to posted question answer should have correct-attribute", async () => {
    const testClient = await superoak(app);
    const data = {questionId: 0, optionId: 0};
    const http_response = await testClient.post("/api/questions/answer")
    .send(data)
    .expect(200)
    .expect("Content-Type", new RegExp("application/json"));

    assertEquals(http_response.body.correct != undefined, true);
    assertEquals(typeof http_response.body.correct, "boolean");
});


// Test API answer question for allowed cross origin resource sharing
Deno.test("API answer question should have CORS allowed", async () => {
    const testClient = await superoak(app);
    const data = {questionId: 0, optionId: 0};
    const http_response = await testClient.post("/api/questions/answer")
    .send(data)
    .expect(200)
    .expect("Access-Control-Allow-Origin", "*");
});
