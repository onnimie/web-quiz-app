import { app } from "../app.js";
import { superoak, assertEquals } from "../deps.js";



// Test whether unauthenticated user is redirected from /quiz
Deno.test({
    name: "Unauth user is redirected from /quiz to /auth/login",
    async fn() {
        const testClient = await superoak(app);
        const http_response = await testClient.get("/quiz").expect(302)
        .expect("Location", "/auth/login");

    },
    sanitizeResources: false,
    sanitizeOps: false,
});


// Test with user@user.com if can access quiz
Deno.test({
    name: "user@user.com account can login AND access /quiz",
    async fn() {
        const testClient = await superoak(app);
        const anotherClient = await superoak(app);
        
        const http_response_login = await testClient.post("/auth/login")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("email=user@user.com")
        .send("password=user")
        .expect(302);
        assertEquals((new RegExp("Login failed")).test(http_response_login.text), false);

        const set_cookie = http_response_login.header["set-cookie"];
        const sid = set_cookie.split(";")[0].split("=")[1];

        
        console.log("session=" + sid);
        const http_response_quiz = await anotherClient.get("/quiz")
        .set("Cookie", "session=" + sid)
        .send()
        .expect(200);

        assertEquals((new RegExp("<h2>Quiz Topics</h2>")).test(http_response_quiz.text), true);
        
        
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
