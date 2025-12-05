import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/fines';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateFinePayload } from 'middleware/validation/fines';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateFinePayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateFinePayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
