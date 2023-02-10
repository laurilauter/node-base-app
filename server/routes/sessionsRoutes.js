import express from 'express';
const sessionsRouter = express.Router();
import * as sessionsController from '../controllers/sessionsController.js';
import bodyParser from 'body-parser';
sessionsRouter.use(bodyParser.json());
sessionsRouter.use(bodyParser.urlencoded({ extended: false }));

//TODO: move these to /sessions/login /sesssions/logout
sessionsRouter.post('/login', sessionsController.loginUser);

sessionsRouter.get('/logout', sessionsController.logoutUser);

//return userinfo from session cookie
sessionsRouter.get('/return', sessionsController.sessionReturn);

//get session info
sessionsRouter.get('/:id', sessionsController.sessionInfo);

export default sessionsRouter;
