import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const SECRET = "sos2526-secret";

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

    passport.use(new GitHubStrategy({
        clientID: 'Ov23lidqxCovkHPbwdTe',
        clientSecret: '5af6b8a13b033471f5fe6651221123ad2c2167e7',
        callbackURL: '/api/v2/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, { username: profile.username });
    }));

    app.get('/api/v2/auth/github',
        passport.authenticate('github', { scope: ['user:email'] })
    );

    app.get('/api/v2/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/aids-deaths-stats' }),
        (req, res) => {
            const token = jwt.sign({ username: req.user.username }, SECRET, { expiresIn: '1h' });
            res.redirect(`/aids-deaths-stats?token=${token}`);
        }
    );
}