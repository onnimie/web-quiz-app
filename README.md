# Web project 2: Drill and practise with Quizzes and Topics

To try out the application online, go to https://wsd-quiz-topics.herokuapp.com/

If you want to try out the application locally with Docker, there are instructions to this later in this document.


## Description of the application

Simply put, the application is a tool for quizzing with user-created topics and questions.
This web project is the final project in the course CS-C3170 - Web Software Development.

Users can create questions inside topics in the /topics-section and have the application quiz them in the /quiz-section.
Users must create a user-account in order to do this, or use the general user-account (email: user@user.com, password: user)

To create topics and remove them, user must be authenticated as an admin.
Currently, the only way to do this in the online app is to use the general admin-account (email: admin@admin.com, password: 123456)

The user can always navigate to different pages with the navigation bar at the top of the web-pages. There are 3 destinations always available: Topics, Quiz and Main page.

### Logging in or registering a user-account

To use the app, the user must be authenticated with a user-account. There exists already two general accounts.
The general user-account: (email: user@user.com, password: user)
The general admin-account (email: admin@admin.com, password: 123456)

[ To create topics, one must be authenticated as an admin. Also, one cannot create an admin-account in the web app. ]

To register a new account, the user can click the register-link in the main root page of the web app.
Clicking this link directs the user to the registering form, which the user can fill and submit to register a new account.

[ After registering user is directed to the login-page. ]

To log in to an existing account, user must click the log in -link in the main root page of the web app.
Clicking this link directes the user to the login-form, which the user can fill and submit to log in to an existing account.

After logging in, the user is redirected to the topics page at /topics. The user can always navigate between the main page, topics and quiz-page by the navigation bar at the top.

### Creating questions

To create questions, user must click the link of some topic. This means that the created question will belong to this topic.
After clicking the topic, user is directed to the topics own page. There, the user can create questions with the existing form.

After creating a question, user must click the link of the created question in order to add answer options to the created question.
Clicking the link of the question, user is directed to the questions own page. There, the user can add answer options with the existing form.
Remember to check the checkbox for correctness of the answer if the added answer option is a correct answer!

### Quizzing

To quiz oneself with the created questions, user must click the Quiz-link at the top of the web-page. In the quiz-page, there is a list of topics to quiz.
After choosing and clicking a topic in the list, user is randomly quizzed with a question from that topic. User must then choose an answer to the question.
After choosing and clicking the Choose-button of an answer, the user is shown a page which tells whether the answer was correct or not. If not, the correct answer is also shown.

The user can be repeatedly quizzed with random questions from the topic by clicking the Next question -link in the result-page.
To change the topic, user must click the Quiz-link at the top of the web-page again.


## API

Currently, the application supports requesting random questions and responding to these questions with answers.
The questions and answer results are sent as a JSON-object. Also, to answer a random question (to get the result), you must send a JSON-object.

### Request a random question

To request a random question from the API, you must send a GET-request to /api/questions/random.
In the context of the web app, the correct URL would be https://wsd-quiz-topics/api/questions/random.

The response is a JSON-object containing the question and its ID, and the answer options with their individual ID's as well.
EXAMPLE RESPONSE OBJECT
    {
        "questionId": 1,
        "questionText": "How much is 1+1?",
        "answerOptions": [
          { "optionId": 1, "optionText": "2" },
          { "optionId": 2, "optionText": "4" },
          { "optionId": 3, "optionText": "6" },
        ]
    }

### Send an answer to a question and get the result

To send an answer to a question in the database of the web app, you must send a POST-request to /api/questions/answer with a JSON-object.
In the context of the web app, the correct URL would be https://wsd-quiz-topics/api/questions/answer.

You must know the question's ID and the chosen answer option's ID to formulate the correct JSON-object that the API can process.

EXAMPLE REQUEST OBJECT
    {
        "questionId": 1,
        "optionId": 3,
    }

After sending such a request, the API responds with a simple JSON-object that contains the result of the answer.

EXAMPLE RESPONSE OBJECT
    {
        "correct": true,
    }


## Run the application locally with Docker

You can try out the application locally with Docker by launching the project with the command docker-compose up.

All the relevant files for this exist inside the project. Obviously, one can edit them if need be.

Note that, with the current settings in the flyway\sql\V1___initial_schema.sql -file, there is no user-account user@user.com, but only the admin-account admin@admin.com
The database is also initiated with a topic "Finnish language". Beside these datarows and the tables, no other data is added in the initialization.

