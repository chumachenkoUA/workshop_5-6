import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/trips';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateTripPayload } from 'middleware/validation/trips';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateTripPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateTripPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
