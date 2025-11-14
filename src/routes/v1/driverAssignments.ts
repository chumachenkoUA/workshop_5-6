import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/driverAssignments';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import {
  validateDriverAssignmentCreate,
  validateDriverAssignmentUpdate,
} from 'middleware/validation/driverAssignments';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateDriverAssignmentCreate, create);
router.patch('/:id([0-9]+)', adminOnly, validateDriverAssignmentUpdate, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
