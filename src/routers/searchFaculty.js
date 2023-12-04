require('dotenv').config();
const express = require('express'); // require express
const router = express.Router(); // require router
const { log } = require('console');
const Faculty = require('../models/faculty');
const Math = require('math');
const { setOption } = require('../functions/userFunctions');
const path = require('path');

router.get("/search", setOption, async (req, res) => {
    const filePath = path.join(__dirname, '../../templates/views/', 'search_faculty');
    res.status(200).render(filePath);
});

router.get('/search-faculty', setOption, async (req, res) => {
    const course = req.query.course;
    const search_query = req.query.search2;
    const university = req.query.university;
    const query = {};
    const searchdata = {};

    try {
        if (university) {
            query.institute = { $regex: university, $options: 'i' };
            searchdata.university = university;
        }
        if (course) {
            query.department = { $regex: course, $options: 'i' };
            searchdata.department = course;
        }

        if (search_query) {
            if (search_query.toLowerCase() === 'internship') {
                query.internship = { $ne: '' };
            } else {
                query.name = { $regex: search_query, $options: 'i' };
            }
        }

        query.verified = true;
    } catch (error) {
        console.log("Error showing searach results. Error: ", error);
    }
    // console.log(query);
    try {
        const data = await Faculty.find(query)
        if (data) {
            res.render('search_faculty', { data, searchdata });
        }
    } catch (error) {
        console.log("Error querying the database: ", error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router; // export router