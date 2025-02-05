const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

const app = express();
const PORT = 3000;

const USERNAME = 'hello';
const PASSWORD = 'world';

passport.use(new BasicStrategy(
    (username, password, done) => {
        if (username === USERNAME && password === PASSWORD) {
            return done(null, true);
        }
        return done(null, false);
    }
));

app.use(passport.initialize());

app.get('/public', (req, res) => {
    res.send('Hello from /public');
});

app.get('/httpbasic', passport.authenticate('basic', { session: false }), (req, res) => {
    res.send('Hello from httpbasic endpoint using Passport.js');
});

app.get('/anotherhttpbasic', passport.authenticate('basic', { session: false }), (req, res) => {
    res.send('Hello from anotherhttpbasic endpoint using Passport.js');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
