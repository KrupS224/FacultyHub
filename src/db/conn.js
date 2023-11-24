const express = require('express'); // require express
const app = express(); // create express app
const mogoose = require('mongoose');  // require mongoose
require('dotenv').config(); // require dotenv

const port = process.env.PORT || 8000;

// Connect to database
mogoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/FacultyHub", {
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

