import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const SECRET = "sos2526-secret";

const isLocal = process.env.NODE_ENV !== 'production';
const isRailway = process.env.RAILWAY_ENVIRONMENT !== undefined;

const GITHUB_CONFIG = isLocal ? {
    clientID: 'Ov23lidqxCovkHPbwdTe',
    clientSecret: '5af6b8a13b033471f5fe6651221123ad2c2167e7',
    callbackURL: 'http://localhost:3000/api/v2/auth/github/callback'
} : isRailway ? {
    clientID: 'Ov23liLLEyH5cXfkbUug',
    clientSecret: '829373c5a8e5ab563c7ac012422a6eef0ad2e9c4',
    callbackURL: 'https://sos2526-21.up.railway.app/api/v2/auth/github/callback'
} : {
    clientID: 'Ov23li1IAVbxG9uqeRoD',
    clientSecret: '77bded535280386c2a14f9d825903e1defafc8c3',
    callbackURL: 'https://sos2526-21.onrender.com/api/v2/auth/github/callback'
};

export function loadOAuthDDLRF(app) {
    app.use(session({
        secret: 'sos2526-session',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    passport.use(new GitHubStrategy(GITHUB_CONFIG,
        (accessToken, refreshToken, profile, done) => {
            return done(null, { username: profile.username });
        }
    ));

    app.get('/api/v2/auth/github',
        passport.authenticate('github', { scope: ['user:email'] })
    );

    app.get('/api/v2/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/aids-deaths-stats-opcional' }),
        (req, res) => {
            const token = jwt.sign({ username: req.user.username }, SECRET, { expiresIn: '1h' });
            res.redirect(`/aids-deaths-stats-opcional?token=${token}`);
        }
    );
}