import passport from "passport";
import passportJWT from "passport-jwt";
import express from 'express';
import qrRouter from './routes/qr.routes.js';

const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;

const app = express();

//controllers

//routers

//defining the JWT strategy
const passportStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'superSecret'  // secret key 
}, (jwt_payload, next) => {
    console.log(jwt_payload)
    next(null, jwt_payload)
});

//init passport strategy
passport.use(passportStrategy);

//handle browser options Request
const handleOptionsReq = (req, res, next) => {
    if (req.method === 'OPTIONS') { 
        res.send(200);
    } else { 
        next();
    }
}

//test routes
// app.get('/test', test);
// app.get('/test/ping', pingTest);

//secured routes - auth using user JWT
// app.use('/api', handleOptionsReq, passport.authenticate('jwt', { session: false }));
app.use('/api', qrRouter);


export default app;
