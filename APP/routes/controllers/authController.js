import * as userServices from "../../services/userServices.js";
import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";

const validationRules = {
    password: [validasaur.required, validasaur.minLength(4)],
    email: [validasaur.required, validasaur.isEmail],
};



const showRegistrationPage = (context) => {
    context.render("register.eta");
};

const showLoginPage = (context) => {
    context.render("login.eta");
};

const registerUser = async (context) => {

    const body = context.request.body();
    const params = await body.value;

    const data = {
        email: params.get("email"),
        password: params.get("password"),
    };
    
    const [passes, errors] = await validasaur.validate(data, validationRules);

    if (!passes) {

        data.errors = errors;
        context.render("register.eta", data);

    } else {

        // CHECK HERE IF EMAIL ALREADY IN USE
        const userArray = await userServices.getUserArrayByEmail(data.email);
        if (userArray.length != 0) {

            // No user with such email!
            data.errors = {err: {error: "Email already in use!"}};
            context.render("register.eta", data);

        } else {  // Truly passes all tests!

            const password_hash = await bcrypt.hash(data.password);
            await userServices.createUser(data.email, password_hash, false);

            context.response.redirect("/auth/login");
        }
    }
};

const loginUser = async (context) => {
    const body = context.request.body();
    const params = await body.value;

    const data = {
        email: params.get("email"),
        password: params.get("password"),
    };

    const userArray = await userServices.getUserArrayByEmail(data.email);

    if (userArray.length == 0) {

        // No user with such email!
        data.error = true;
        context.render("login.eta", data);

    } else {

        const user = userArray[0];
        const password_hash = user.password;
        const passwordCorrect = await bcrypt.compare(data.password, password_hash);

        if (!passwordCorrect) {

            // Incorrect password!!
            data.error = true;
            context.render("login.eta", data);

        } else {

            // Auth succesfull!!
            await authenticateUser(user, context.state.session);
            context.response.redirect("/topics");
        }
    }
};

const authenticateUser = async (user_object, session) => {

    await session.set("user", {
        id: user_object.id,
        email: user_object.email,
        admin: user_object.admin,
    });
    await session.set("authenticated", true);

};




export { showRegistrationPage,
    showLoginPage,
    registerUser,
    loginUser };