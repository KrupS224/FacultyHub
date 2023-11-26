const express = require('express');
const path = require('path');
const router = express.Router();
const { requireAuth } = require("../functions/userFunctions");

router.get("/", async (req, res) => {
    const filePath = path.join(__dirname, "../../templates/views/", "index");
    res.status(200).render(filePath);
});

router.post('/logout', requireAuth, (req, res) => {
    res.cookie("accesstoken", '', { maxAge: 1 })
    res.status(200).redirect("/signin");
})

module.exports = router;