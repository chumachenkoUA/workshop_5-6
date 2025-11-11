import { Router } from 'express';

import auth from './auth';
import cardTopUps from './cardTopUps';
import complaints from './complaints';
import driverAssignments from './driverAssignments';
import drivers from './drivers';
import fineAppeals from './fineAppeals';
import fines from './fines';
import routePoints from './routePoints';
import routes from './routes';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/card-top-ups', cardTopUps);
router.use('/complaints', complaints);
router.use('/driver-assignments', driverAssignments);
router.use('/drivers', drivers);
router.use('/fine-appeals', fineAppeals);
router.use('/fines', fines);
router.use('/route-points', routePoints);
router.use('/routes', routes);
router.use('/users', users);

export default router;
