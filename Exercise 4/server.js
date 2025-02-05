const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

const SECRET_KEY = 'marcoJochim';
const REFRESH_SECRET_KEY = 'refreshMarcoJochim';

let refreshTokens = [];

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'user' && password === 'password') {
        const accessToken = jwt.sign({ username }, SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
        refreshTokens.push(refreshToken);
        return res.json({ accessToken, refreshToken });
    }

    return res.status(401).send('Invalid credentials');
});

app.post('/token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).send('Forbidden');
    }

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Forbidden');

        const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '15m' });
        res.json({ accessToken });
    });
});

app.post('/logout', (req, res) => {
    const { refreshToken } = req.body;

    refreshTokens = refreshTokens.filter(token => token !== refreshToken);

    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});