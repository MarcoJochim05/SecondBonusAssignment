const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

const app = express();
const PORT = 3000;

const SECRET_KEY = 'marcoJochim';

const users = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'user', password: 'user', role: 'user' }
];

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
        return res.json({ token });
    }

    return res.status(401).send('Invalid credentials');
});

const roleCheck = (role) => {
    return (req, res, next) => {
        if (req.auth.role !== role) {
            return res.status(403).send('Forbidden');
        }
        next();
    };
};

app.get('/posts', expressJwt({ secret: SECRET_KEY, algorithms: ['HS256'] }), (req, res) => {
    res.json(["early bird catches the worm"]);
});

app.post('/posts', expressJwt({ secret: SECRET_KEY, algorithms: ['HS256'] }), roleCheck('admin'), (req, res) => {
    res.json(["new post added"]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});