import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/schedules';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateSchedulePayload } from 'middleware/validation/schedules';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateSchedulePayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateSchedulePayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
