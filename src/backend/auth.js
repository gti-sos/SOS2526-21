import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET = "sos2526-secret";

const usuario = {
    username: "admin",
    password: bcrypt.hashSync("admin", 10)
};

export function loadAuth(app) {
    app.post('/api/v2/auth/login', (req, res) => {
        const login = req.body;
        let username = login.username;
        let password = login.password;
        if (!username || !password) {
            return res.sendStatus(400);
        }

        if (username !== usuario.username) {
            return res.sendStatus(401);
        }

        let valid = bcrypt.compareSync(password, usuario.password);
        if (!valid) {
            return res.sendStatus(401);
        }

        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
        console.log("LOGIN")
    })
}

export function verifyToken(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) return res.sendStatus(401);

    const token = auth.split(' ')[1]; // Bearer <token>
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.sendStatus(401);
        req.user = decoded;
        next();
    });
}