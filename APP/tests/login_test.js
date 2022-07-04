import { app } from "../app.js";
import { superoak, assertEquals } from "../deps.js";


//Test for login page showing up when GET to login page
Deno.test({
    name: "Login page comes up when GETting /auth/login",
    async fn() {
        const testClient = await superoak(app);
        const http_response = await testClient.get("/auth/login").expect(200)
        .expect("Content-Type", new RegExp("text/html"))
    
        assertEquals((new RegExp("<h1>Log in to your user account</h1>")).test(http_response.text), true);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});


// Test whether user@user.com account can login
Deno.test({
    name: "user@user.com account can login",
    async fn() {
        const testClient = await superoak(app);
        const http_response = await testClient.post("/auth/login")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("email=user@user.com")
        .send("password=user")
        .expect(302);
        //console.log(http_response);
        assertEquals((new RegExp("Login failed")).test(http_response.text), false);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});


// Test if after login, the user is redirected to the topics-page (topics.eta)
Deno.test({
    name: "After login, user is redirected to /topics",
    async fn() {
        const testClient = await superoak(app);
        const http_response = await testClient.post("/auth/login")
        .send("email=user@user.com")
        .send("password=user")
        .expect(302)
        .expect("Location", "/topics");
        
    },
    sanitizeResources: false,
    sanitizeOps: false,
});