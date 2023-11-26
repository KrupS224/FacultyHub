require('dotenv').config();
const express = require('express'); // require express
const router = express.Router(); // require router
const Admin = require("../models/admin"); // require admin.js
const Faculty = require("../models/faculty"); // require faculty.js
const forgotPass = require("../models/forgotPass"); // require faculty.js
const lockUser = require("../models/lockUser"); // require faculty.js
const SigninCount = require("../models/signinCount"); // require faculty.js
const verifyFaculty = require("../models/verifyFaculty"); // require faculty.js
const jwt = require('jsonwebtoken');
const { log } = require('console');
const { sendAccountRemovalEmail } = require("../functions/mails");

router.delete("/admin-profile-remove/:id", async (req, res) => {
    try {
        const profileId = req.params.id;
        const token = req.cookies.accesstoken;

        const data = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(profileId);
        if (profileId === data._id && data.role === "admin") {

            try {
                const admin = await Admin.findById(profileId);
                const university = admin.university;

                const faculties = await Faculty.find({ institute: university });
                await Promise.all(faculties.map(async (faculty) => {
                    const email = faculty.email;

                    // Deleting faculty
                    await Faculty.deleteOne({ email: email });
                    await forgotPass.deleteOne({ email: email });
                    await lockUser.deleteOne({ email: email });
                    await SigninCount.deleteOne({ email: email });
                    await verifyFaculty.deleteOne({ email: email });

                    // Send account removal email
                    await sendAccountRemovalEmail(email);
                }));

                // deleting all faculties assosiated with admin
                await Faculty.deleteMany({ institute: university });
                log("Faculties removed successfully");

                await Admin.deleteOne({ _id: profileId });
                log("Admin removed successfully.");

                res.sendStatus(200);

            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    message: "Internal server error"
                });
            }
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

});


router.delete("/faculty-profile-remove/:id", async (req, res) => {
    try {
        const profileId = req.params.id;
        const token = req.cookies.accesstoken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(data);
        if (profileId === data._id && data.role === "faculty") {
            // deleting faculty data
            await Faculty.deleteOne({ _id: profileId });
            res.sendStatus(200);
        }

        res.sendStatus(400);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

});

router.delete("/faculty-remove/:id", async (req, res) => {
    try {
        const profileId = req.params.id;
        const token = req.cookies.accesstoken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(data);

        const faculty = await Faculty.findById(profileId);
        const email = faculty.email;

        // deleting faculty data
        await Faculty.deleteOne({ _id: profileId });
        await lockUser.deleteOne({ email: email });
        await SigninCount.deleteOne({ email: email });
        await forgotPass.deleteOne({ email: email });

        // send mail
        sendAccountRemovalEmail(faculty.email);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

});

module.exports = router;