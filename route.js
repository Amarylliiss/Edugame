
const express = require("express");
const router = express.Router();

app.get('/views/home', (req, res) => {
    res.render('home')
})
app.get('/views/memory', (req, res) => {
    res.render('memory')
})
app.get('/views/register', (req, res) => {
    res.render('register')
})
app.get('/views/quiz', (req, res) => {
    res.render('main')
})
app.get('/views/emojimaker', (req, res) => {
    res.render('index')
})
module.exports = router;