import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/drivers';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateDriverPayload } from 'middleware/validation/drivers';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateDriverPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateDriverPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
