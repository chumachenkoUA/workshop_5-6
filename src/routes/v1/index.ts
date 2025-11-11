import { Router } from 'express';

import auth from './auth';
import cardTopUps from './cardTopUps';
import complaints from './complaints';
import driverAssignments from './driverAssignments';
import drivers from './drivers';
import fines from './fines';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/card-top-ups', cardTopUps);
router.use('/complaints', complaints);
router.use('/driver-assignments', driverAssignments);
router.use('/drivers', drivers);
router.use('/fines', fines);
router.use('/users', users);

export default router;
