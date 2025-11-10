import { Router } from 'express';

import auth from './auth';
import cardTopUps from './cardTopUps';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/card-top-ups', cardTopUps);
router.use('/users', users);

export default router;
