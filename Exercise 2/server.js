const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');

const app = express();
const PORT = 3000;

const SECRET_KEY = 'marcoJochim';

const posts = ["early bird catches the worm"];

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'hello' && password === 'world') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '15m' });
        return res.json({ token });
    }

    return res.status(401).send('Invalid credentials');
});

app.get('/posts', expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] }), (req, res) => {
    res.json(posts);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});