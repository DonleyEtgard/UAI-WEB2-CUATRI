import express from 'express';

import controllers from './controllers';

const router = express.Router();

router.post('/register', controllers.registerUser);
router.post('/login', controllers.loginWithEmailPassword);

export default router;