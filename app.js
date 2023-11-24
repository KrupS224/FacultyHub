require('dotenv').config();
require('./IT314_Project/src/db/conn');

const express = require('express');
const session = require('express-session');
const path = require('path');
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const { checkUser } = require('./IT314_Project/src/functions/userFunctions');

const app = express();
const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "./IT314_Project/public");
const templatePath = path.join(__dirname, "./IT314_Project/templates/views");
const partialPath = path.join(__dirname, "./IT314_Project/templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));


app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

hbs.registerHelper('eq', function (a, b) {
    return a === b;
});

app.get('*', checkUser);

// routing - Home Page
const homePageRouter = require("./IT314_Project/src/routers/index"); // require home.js
app.use(homePageRouter); // use home.js
// routing - add faculty

const facultyRouter = require("./IT314_Project/src/routers/faculty"); // require faculty.js
app.use(facultyRouter); // use faculty.js

// routing - signin
const signinRouter = require("./IT314_Project/src/routers/signin"); // require signin.js
app.use(signinRouter); // use signin.js

// routing - signup
const signupRouter = require("./IT314_Project/src/routers/signup"); // require signup.js
app.use(signupRouter); // use signup.js

const universityRouter = require("./IT314_Project/src/routers/university");
app.use(universityRouter);

// routing - verifyotp
const verifyotpRouter = require("./IT314_Project/src/routers/verifyotp"); // require verifyotp.js
app.use(verifyotpRouter); // use verifyotp.js

// routing - unlockAccount
const unlockAccountRouter = require("./IT314_Project/src/routers/unlockAccount");
app.use(unlockAccountRouter);

// routing - forgotPassword
const forgotPasswordRouter = require("./IT314_Project/src/routers/forgotPassword");
app.use(forgotPasswordRouter);

const adminProfileRouter = require("./IT314_Project/src/routers/adminProfile")
app.use(adminProfileRouter);

const changePasswordRouter = require("./IT314_Project/src/routers/changePassword");
app.use(changePasswordRouter);

const searchFacultyRouter = require("./IT314_Project/src/routers/searchFaculty");
app.use(searchFacultyRouter);

const removeDataRouter = require("./IT314_Project/src/routers/removeData");
app.use(removeDataRouter);


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});