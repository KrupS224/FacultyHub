const mogoose = require('mongoose');  // require mongoose
require('dotenv').config(); // require dotenv

// Connect to database
mogoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(`No connection, error: ${err}`);
});

