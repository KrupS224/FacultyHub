require('dotenv').config();
const mongoose = require('mongoose');
// require('./src/db/conn');

const express = require('express');
const session = require('express-session');
const path = require('path');
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const { checkUser } = require('./src/functions/userFunctions');

const app = express();
const port = process.env.PORT || 8000;

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() => {
    console.log("Connection successful");
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
}).catch((err) => {
    console.log(`No connection, error: ${err}`);
});


const static_path = path.join(__dirname, "./public");
const templatePath = path.join(__dirname, "./templates/views");
const partialPath = path.join(__dirname, "./templates/partials");

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
const homePageRouter = require("./src/routers/index"); // require home.js
app.use(homePageRouter); // use home.js
// routing - add faculty

const facultyRouter = require("./src/routers/faculty"); // require faculty.js
app.use(facultyRouter); // use faculty.js

// routing - signin
const signinRouter = require("./src/routers/signin"); // require signin.js
app.use(signinRouter); // use signin.js

// routing - signup
const signupRouter = require("./src/routers/signup"); // require signup.js
app.use(signupRouter); // use signup.js

const universityRouter = require("./src/routers/university");
app.use(universityRouter);

// routing - verifyotp
const verifyotpRouter = require("./src/routers/verifyotp"); // require verifyotp.js
app.use(verifyotpRouter); // use verifyotp.js

// routing - unlockAccount
const unlockAccountRouter = require("./src/routers/unlockAccount");
app.use(unlockAccountRouter);

// routing - forgotPassword
const forgotPasswordRouter = require("./src/routers/forgotPassword");
app.use(forgotPasswordRouter);

const adminProfileRouter = require("./src/routers/adminProfile")
app.use(adminProfileRouter);

const changePasswordRouter = require("./src/routers/changePassword");
app.use(changePasswordRouter);

const searchFacultyRouter = require("./src/routers/searchFaculty");
app.use(searchFacultyRouter);

const removeDataRouter = require("./src/routers/removeData");
app.use(removeDataRouter);
