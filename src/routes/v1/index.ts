import { Router } from 'express';

import auth from './auth';
import cardTopUps from './cardTopUps';
import complaints from './complaints';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/card-top-ups', cardTopUps);
router.use('/complaints', complaints);
router.use('/users', users);

export default router;
